import express from "express";
import Review from "../models/Review.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

const listReviews = async (req, res) => {
  try {
    const reviews = await Review.find()
      .sort({ createdAt: -1 })
      .limit(50)
      .select("name review rating createdAt");
    res.json(reviews);
  } catch (err) {
    console.error("Failed to fetch reviews:", err);
    res.status(500).json({ message: "Failed to fetch reviews" });
  }
};

router.get("/", listReviews);
router.get("/all", listReviews);

router.post("/submit", protect, async (req, res) => {
  const { name, review, rating } = req.body;

  if (typeof name !== "string" || typeof review !== "string") {
    return res.status(400).json({ message: "Name and review required" });
  }

  const trimmedName = name.trim();
  const trimmedReview = review.trim();

  if (!trimmedName || !trimmedReview) {
    return res.status(400).json({ message: "Name and review required" });
  }

  if (trimmedName.length > 100 || trimmedReview.length > 2000) {
    return res.status(400).json({ message: "Name or review is too long" });
  }

  let parsedRating = 5;

  if (rating !== undefined) {
    parsedRating = Number(rating);
    if (!Number.isInteger(parsedRating) || parsedRating < 1 || parsedRating > 5) {
      return res.status(400).json({ message: "Rating must be between 1 and 5" });
    }
  }

  try {
    await Review.create({
      name: trimmedName,
      email: req.user.email,
      review: trimmedReview,
      rating: parsedRating,
    });

    res.status(201).json({ message: "Review submitted successfully" });
  } catch (err) {
    console.error("Failed to submit review:", err);
    res.status(500).json({ message: "Failed to submit review" });
  }
});

export default router;
