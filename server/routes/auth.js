import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import dotenv from 'dotenv';
dotenv.config();

const router = express.Router();

// Regular register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'User already exists' });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = await User.create({ 
      name, 
      email, 
      password: hashedPassword,
      isAdmin: false  // Default non-admin
    });

    const token = jwt.sign(
      { id: newUser._id, email: newUser.email, isAdmin: false },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      token,
      user: { id: newUser._id, name: newUser.name, email: newUser.email, isAdmin: false }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

// Regular login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign(
      { id: user._id, email: user.email, isAdmin: user.isAdmin || false },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email, isAdmin: user.isAdmin || false }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

// ✅ ADMIN LOGIN ROUTE (THIS WAS MISSING!)
router.post('/admin/login', async (req, res) => {
  try {
    console.log('Admin login attempt:', req.body.email); // Debug log
    const { email, password } = req.body;
    
    const user = await User.findOne({ email });
    if (!user) {
      console.log('User not found:', email);
      return res.status(400).json({ message: 'Invalid admin credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log('Wrong password for:', email);
      return res.status(400).json({ message: 'Invalid admin credentials' });
    }

    if (!user.isAdmin) {
      console.log('User not admin:', email);
      return res.status(403).json({ message: 'Admin access required' });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email, isAdmin: true },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    console.log('Admin login SUCCESS:', email); // Debug log
    res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email, isAdmin: true }
    });
  } catch (err) {
    console.error('Admin login error:', err);
    res.status(500).json({ message: err.message });
  }
});

export default router;
