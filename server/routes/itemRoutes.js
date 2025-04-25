import express from 'express';
import Product from '../models/Product.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Get all products (for customers)
router.get('/', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching products' });
  }
});

// Add product (Admin only)
router.post('/', protect, admin, async (req, res) => {
  const { name, category, price, description, imageUrl } = req.body;
  try {
    const product = new Product({ name, category, price, description, imageUrl });
    await product.save();
    res.status(201).json({ message: 'Product added successfully', product });
  } catch (error) {
    res.status(500).json({ message: 'Error adding product' });
  }
});

export default router;
