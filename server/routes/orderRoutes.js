import express from "express";
import Order from "../models/Order.js";
import dotenv from "dotenv";
import Item from "../models/Item.js";
import PendingOrder from "../models/PendingOrder.js";
import { protect, adminProtect } from "../middleware/auth.js";
import crypto from "crypto";
import Razorpay from 'razorpay';
dotenv.config();

const router = express.Router();

const razorpayInstance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID, 
    key_secret: process.env.RAZORPAY_KEY_SECRET, 
});

router.post("/", protect, async (req, res) => {
  try {
    const { items } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "No items provided" });
    }

    const orderItems = [];

    for (const item of items) {
      const quantity = Number(item.quantity);

      if (!Number.isInteger(quantity) || quantity <= 0) {
        return res.status(400).json({ message: "Invalid quantity" });
      }

      const product = await Item.findById(item.id).catch(() => null);

      if (!product) {
        return res
          .status(400)
          .json({ message: "One or more items are no longer available" });
      }

      orderItems.push({
        id: product._id.toString(),
        name: product.name,
        price: product.price,
        quantity,
      });
    }

    const totalAmount = orderItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    const newOrder = new Order({
      userId: req.user.id,
      items: orderItems,
      totalAmount,
      paid: false,
    });

    await newOrder.save();

    res
      .status(201)
      .json({ message: "Order placed successfully", orderId: newOrder._id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to place order" });
  }
});

router.patch("/:id", protect, adminProtect, async (req, res) => {
  try {
    const { id } = req.params;
    const { paid } = req.body;

    const order = await Order.findById(id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    if (paid && !order.paid) {
      for (const orderItem of order.items) {
        const product = await Item.findById(orderItem.id);
        if (product) {
          product.stock = Math.max(0, product.stock - orderItem.quantity);
          await product.save();
        }
      }
    }

    order.paid = paid;
    await order.save();

    res.json({ message: "Order updated", order });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update order" });
  }
});

router.get("/", protect, adminProtect, async (req, res) => {
  try {
    const orders = await Order.find().populate("userId", "name email");
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch orders" });
  }
});

router.get("/my", protect, async (req, res) => {
  try {
    const userOrders = await Order.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(userOrders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch user orders" });
  }
});

router.delete("/:id", protect, adminProtect, async (req, res) => {
  try {
    await Order.findByIdAndDelete(req.params.id);
    res.json({ message: "Order deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting order" });
  }
});

router.get("/my-latest", protect, async (req, res) => {
  try {
    const order = await Order.findOne({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .limit(1);
    if (!order) return res.status(404).json({ message: "No previous order found" });
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch previous order" });
  }
});

router.post('/create-razorpay-order', protect, async (req, res) => {
    try {
        const { items } = req.body;

        if (!Array.isArray(items) || items.length === 0) {
            return res.status(400).json({ message: 'No items provided' });
        }

        const pricedItems = [];

        for (const item of items) {
            const quantity = Number(item.quantity);

            if (!Number.isInteger(quantity) || quantity <= 0) {
                return res.status(400).json({ message: 'Invalid quantity' });
            }

            const product = await Item.findById(item.id).catch(() => null);

            if (!product) {
                return res
                    .status(400)
                    .json({ message: 'One or more items are no longer available' });
            }

            if (product.stock < quantity) {
                return res.status(400).json({
                    message: `Only ${product.stock} of ${product.name} left in stock`,
                });
            }

            pricedItems.push({
                id: product._id.toString(),
                name: product.name,
                price: product.price,
                quantity,
            });
        }

        const expectedAmount = pricedItems.reduce(
            (sum, item) => sum + Math.round(item.price * 100) * item.quantity,
            0
        );

        if (expectedAmount <= 0) {
            return res.status(400).json({ message: 'Invalid order total' });
        }

        const order = await razorpayInstance.orders.create({
            amount: expectedAmount,
            currency: 'INR',
            receipt: `receipt_order_${Date.now()}`,
        });

        if (!order) {
            return res.status(500).json({ message: 'Razorpay order creation failed' });
        }

        await PendingOrder.create({
            razorpayOrderId: order.id,
            userId: req.user.id,
            items: pricedItems,
            expectedAmount,
        });

        res.json({ id: order.id, amount: order.amount, currency: order.currency });
    } catch (error) {
        console.error('Razorpay order creation error:', error);
        res.status(500).json({ message: 'Server error creating Razorpay order' });
    }
});

router.post('/verify-payment', protect, async (req, res) => {
    const {
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
    } = req.body;

    if (
        typeof razorpay_order_id !== 'string' ||
        typeof razorpay_payment_id !== 'string' ||
        typeof razorpay_signature !== 'string'
    ) {
         return res.status(400).json({ message: 'Missing payment details' });
    }

    try {
        const expectedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
            .update(razorpay_order_id + "|" + razorpay_payment_id)
            .digest();
        const providedSignature = Buffer.from(razorpay_signature, 'hex');

        if (
            expectedSignature.length !== providedSignature.length ||
            !crypto.timingSafeEqual(expectedSignature, providedSignature)
        ) {
            return res.status(400).json({ message: 'Payment verification failed: Invalid signature' });
        }

        const existingOrder = await Order.findOne({ razorpayPaymentId: razorpay_payment_id });

        if (existingOrder) {
            return res.json({
                message: "Order already recorded",
                orderId: existingOrder._id,
            });
        }

        const pending = await PendingOrder.findOne({
            razorpayOrderId: razorpay_order_id,
            userId: req.user.id,
        });

        if (!pending) {
            return res.status(400).json({ message: 'Unknown payment reference' });
        }

        const payment = await razorpayInstance.payments.fetch(razorpay_payment_id);

        if (
            !payment ||
            payment.order_id !== razorpay_order_id ||
            payment.amount !== pending.expectedAmount ||
            !['authorized', 'captured'].includes(payment.status)
        ) {
            console.error('Razorpay payment did not match the expected order or amount', {
                razorpayOrderId: razorpay_order_id,
                razorpayPaymentId: razorpay_payment_id,
                expectedAmount: pending.expectedAmount,
                actualAmount: payment && payment.amount,
                actualOrderId: payment && payment.order_id,
                status: payment && payment.status,
            });
            return res.status(400).json({ message: 'Payment verification failed' });
        }

        const claimed = await PendingOrder.findOneAndUpdate(
            { _id: pending._id, consumed: false },
            { $set: { consumed: true } }
        );

        if (!claimed) {
            return res.status(400).json({ message: 'Payment has already been processed' });
        }

        const newOrder = new Order({
            userId: pending.userId,
            items: pending.items,
            totalAmount: pending.expectedAmount / 100,
            paid: true,
            razorpayPaymentId: razorpay_payment_id,
        });

        await newOrder.save();

        for (const orderItem of pending.items) {
            const reserved = await Item.findOneAndUpdate(
                { _id: orderItem.id, stock: { $gte: orderItem.quantity } },
                { $inc: { stock: -orderItem.quantity } }
            );

            if (!reserved) {
                console.error('Stock could not be reserved for a paid order', {
                    orderId: newOrder._id.toString(),
                    itemId: orderItem.id,
                    quantity: orderItem.quantity,
                });
            }
        }

        res.status(201).json({ message: "Order placed successfully after payment verification", orderId: newOrder._id });

    } catch (error) {
        console.error('Payment verification/Order creation error:', error);
        res.status(500).json({ message: 'Server error during payment verification or order creation' });
    }
});


export default router;
