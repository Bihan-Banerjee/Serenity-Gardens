import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

router.post('/login', async (req, res) => {
  try {
    console.log('Raw body:', req.body);

    let { email, password } = req.body;

    // Normalize email
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    email = String(email).trim().toLowerCase();
    console.log('Normalized email:', email);

    // Try find by email
    const user = await User.findOne({ email });
    console.log('Query result for email:', email, '=>', user);

    if (!user) {
      return res.status(400).json({ message: 'Invalid admin credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    console.log('Password match:', isMatch);

    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid admin credentials' });
    }

    if (!user.isAdmin) {
      return res.status(403).json({ message: 'Admin access required' });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email, isAdmin: user.isAdmin },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
      },
    });
  } catch (err) {
    console.error('Admin login error:', err);
    return res.status(500).json({ message: err.message });
  }
});

export default router;
