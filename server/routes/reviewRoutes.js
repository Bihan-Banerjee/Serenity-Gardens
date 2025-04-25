import express from 'express';
import Review from '../models/Review.js';

const router = express.Router();

// Get all reviews
router.get('/', async (req, res) => {
  try {
    const reviews = await Review.find();
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching reviews' });
  }
});

// Submit a review
router.post('/', async (req, res) => {
  const { name, review, rating } = req.body;
  try {
    const newReview = new Review({ name, review, rating });
    await newReview.save();
    res.status(201).json({ message: 'Review submitted successfully', newReview });
  } catch (error) {
    res.status(500).json({ message: 'Error submitting review' });
  }
});

export default router;
