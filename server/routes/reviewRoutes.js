import express from "express";
import Review from "../models/Review.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();

// Auth middleware to get user info from token
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "No token provided" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({ message: "Invalid token" });
  }
};

// Submit feedback
router.post("/submit", authMiddleware, async (req, res) => {
  const { name, review } = req.body;

  if (!name || !review) {
    return res.status(400).json({ message: "Name and review required" });
  }

  try {
    const newReview = new Review({
      name,
      email: req.user.email,
      review,
    });

    await newReview.save();
    res.status(201).json({ message: "Review submitted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to submit review" });
  }
});

export default router;
