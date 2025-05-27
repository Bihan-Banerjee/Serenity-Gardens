import express from "express";
import Order from "../models/Order.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import Item from "../models/Item.js";
dotenv.config();

const router = express.Router();

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

router.post("/", authMiddleware, async (req, res) => {
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

router.patch("/:id", async (req, res) => {
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

router.get("/", async (req, res) => {
  try {
    const orders = await Order.find().populate("userId", "name email");
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch orders" });
  }
});

router.get("/my", authMiddleware, async (req, res) => {
  try {
    const userOrders = await Order.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(userOrders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch user orders" });
  }
});

export default router;
