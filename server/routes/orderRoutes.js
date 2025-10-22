import express from "express";
import Order from "../models/Order.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import Item from "../models/Item.js";
import { protect, adminProtect } from "../middleware/auth.js";
import crypto from "crypto";
//import Razorpay from 'razorpay';
dotenv.config();

const router = express.Router();

const razorpayInstance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID, 
    key_secret: process.env.RAZORPAY_KEY_SECRET, 
});

const authMiddleware = (req, res, next) => {
  let token = req.headers.authorization;

  if (token && token.startsWith("Bearer")) {
    token = token.split(" ")[1];
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
      next();
    } catch (err) {
      return res.status(401).json({ message: "Invalid token" });
    }
  } else {
    return res.status(401).json({ message: "No token provided" });
  }
};

router.post("/", authMiddleware, protect, adminProtect, async (req, res) => {
  try {
    const { items, paid, razorpayPaymentId } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "No items provided" });
    }

    const totalAmount = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    const newOrder = new Order({
      userId: req.user.id,
      items,
      totalAmount,
      paid,
      razorpayPaymentId: razorpayPaymentId || null,
    });

    await newOrder.save();

    if (paid) {
      for (const orderItem of items) {
        const product = await import("../models/Item.js").then((m) =>
          m.default.findById(orderItem.id)
        );
        if (product) {
          product.stock = Math.max(0, product.stock - orderItem.quantity);
          await product.save();
        }
      }
    }

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

router.get("/", protect, async (req, res) => {
  try {
    const orders = await Order.find().populate("userId", "name email");
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch orders" });
  }
});

router.get("/my", protect, authMiddleware, async (req, res) => {
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

router.get("/my-latest", protect, authMiddleware, async (req, res) => {
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

//router.post('/create-razorpay-order', protect, async (req, res) => {
//    try {
//        const { amount, currency = 'INR', receipt } = req.body; 
//
//        if (!amount || amount <= 0) {
//            return res.status(400).json({ message: 'Invalid amount' });
//        }
//
//        const options = {
//            amount: Math.round(amount), 
//            currency,
//            receipt: receipt || `receipt_order_${Date.now()}`, 
//        };
//
//        const order = await razorpayInstance.orders.create(options);
//
//        if (!order) {
//            return res.status(500).json({ message: 'Razorpay order creation failed' });
//        }
//
//        res.json(order); 
//    } catch (error) {
//        console.error('Razorpay order creation error:', error);
//        res.status(500).json({ message: 'Server error creating Razorpay order' });
//    }
//});
//
//router.post('/verify-payment', protect, async (req, res) => {
//    const {
//        razorpay_order_id,
//        razorpay_payment_id,
//        razorpay_signature,
//        items 
//    } = req.body;
//
//    const secret = process.env.RAZORPAY_KEY_SECRET; 
//
//    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !items) {
//         return res.status(400).json({ message: 'Missing payment details or items' });
//    }
//
//    try {
//        const generated_signature = crypto
//            .createHmac('sha256', secret)
//            .update(razorpay_order_id + "|" + razorpay_payment_id)
//            .digest('hex');
//
//        if (generated_signature !== razorpay_signature) {
//            return res.status(400).json({ message: 'Payment verification failed: Invalid signature' });
//        }
//
//        const totalAmount = items.reduce(
//            (sum, item) => sum + item.price * item.quantity,
//            0
//        );
//
//        const newOrder = new Order({
//            userId: req.user.id, 
//            items: items.map(item => ({ 
//                id: item.id, 
//                name: item.name,
//                price: item.price,
//                quantity: item.quantity
//            })),
//            totalAmount,
//            paid: true, 
//            razorpayPaymentId: razorpay_payment_id,
//        });
//
//        await newOrder.save();
//
//        for (const orderItem of newOrder.items) {
//             const product = await Item.findById(orderItem.id);
//             if (product) {
//                product.stock = Math.max(0, product.stock - orderItem.quantity);
//                await product.save();
//             }
//         }
//
//        res.status(201).json({ message: "Order placed successfully after payment verification", orderId: newOrder._id });
//
//    } catch (error) {
//        console.error('Payment verification/Order creation error:', error);
//        res.status(500).json({ message: 'Server error during payment verification or order creation' });
//    }
//});


export default router;
