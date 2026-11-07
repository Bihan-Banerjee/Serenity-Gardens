import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { protect } from '../middleware/auth.js';
import {
  ADDRESS_MAX_LENGTH,
  sanitiseOptionalText,
  sanitisePhone,
} from '../utils/orderFields.js';
import dotenv from 'dotenv';
dotenv.config();

const router = express.Router();

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const signToken = (user) =>
  jwt.sign(
    { id: user._id, email: user.email, isAdmin: user.isAdmin || false },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );

const publicUser = (user) => ({
  _id: user._id,
  id: user._id,
  name: user.name,
  email: user.email,
  phone: user.phone || '',
  address: user.address || '',
  isAdmin: user.isAdmin || false,
});

router.post('/register', async (req, res) => {
  try {
    const { name, email, password, phone, address } = req.body;

    if (
      typeof name !== 'string' ||
      typeof email !== 'string' ||
      typeof password !== 'string'
    ) {
      return res.status(400).json({ message: 'Name, email and password are required' });
    }

    const trimmedName = name.trim();
    const trimmedEmail = email.trim();

    if (!trimmedName || trimmedName.length > 100) {
      return res.status(400).json({ message: 'Please enter a valid name' });
    }

    if (!EMAIL_PATTERN.test(trimmedEmail)) {
      return res.status(400).json({ message: 'Please enter a valid email address' });
    }

    if (password.length < 8 || password.length > 200) {
      return res.status(400).json({ message: 'Password must be at least 8 characters' });
    }

    const parsedPhone = sanitisePhone(phone);
    if (!parsedPhone.ok) return res.status(400).json({ message: parsedPhone.message });

    const parsedAddress = sanitiseOptionalText(address, 'address', ADDRESS_MAX_LENGTH);
    if (!parsedAddress.ok) return res.status(400).json({ message: parsedAddress.message });

    const userExists = await User.findOne({ email: trimmedEmail });
    if (userExists) return res.status(400).json({ message: 'User already exists' });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      name: trimmedName,
      email: trimmedEmail,
      password: hashedPassword,
      phone: parsedPhone.value,
      address: parsedAddress.value,
      isAdmin: false,
    });

    res.status(201).json({
      token: signToken(newUser),
      user: publicUser(newUser),
    });
  } catch (err) {
    if (err && err.code === 11000) {
      return res.status(400).json({ message: 'User already exists' });
    }
    console.error('Registration failed:', err);
    res.status(500).json({ message: 'Registration failed' });
  }
});


router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (typeof email !== 'string' || typeof password !== 'string') {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const user = await User.findOne({ email: email.trim() });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    res.json({
      token: signToken(user),
      user: publicUser(user),
    });
  } catch (err) {
    console.error('Login failed:', err);
    res.status(500).json({ message: 'Login failed' });
  }
});


router.get('/me', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(401).json({ message: 'Not authorized' });

    res.json(publicUser(user));
  } catch (err) {
    console.error('Failed to load current user:', err);
    res.status(500).json({ message: 'Failed to load current user' });
  }
});


// Updates contact details only. There is deliberately no code path here that
// can write isAdmin, email, password or _id: the update object is built from a
// fixed whitelist, so unknown and $-prefixed keys in the body are ignored.
router.patch('/me', protect, async (req, res) => {
  try {
    const { phone, address } = req.body;

    const updates = {};

    if (phone !== undefined) {
      const parsedPhone = sanitisePhone(phone);
      if (!parsedPhone.ok) return res.status(400).json({ message: parsedPhone.message });
      updates.phone = parsedPhone.value === undefined ? '' : parsedPhone.value;
    }

    if (address !== undefined) {
      const parsedAddress = sanitiseOptionalText(address, 'address', ADDRESS_MAX_LENGTH);
      if (!parsedAddress.ok) return res.status(400).json({ message: parsedAddress.message });
      updates.address = parsedAddress.value === undefined ? '' : parsedAddress.value;
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ message: 'Nothing to update' });
    }

    const user = await User.findByIdAndUpdate(req.user.id, updates, {
      new: true,
      runValidators: true,
    }).select('-password');

    if (!user) return res.status(401).json({ message: 'Not authorized' });

    res.json(publicUser(user));
  } catch (err) {
    console.error('Failed to update profile:', err);
    res.status(500).json({ message: 'Failed to update profile' });
  }
});


router.post('/admin/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (typeof email !== 'string' || typeof password !== 'string') {
      return res.status(400).json({ message: 'Invalid admin credentials' });
    }

    const user = await User.findOne({ email: email.trim() });
    if (!user) {
      return res.status(400).json({ message: 'Invalid admin credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid admin credentials' });
    }

    if (!user.isAdmin) {
      return res.status(403).json({ message: 'Admin access required' });
    }

    res.json({
      token: signToken(user),
      user: publicUser(user),
    });
  } catch (err) {
    console.error('Admin login error:', err);
    res.status(500).json({ message: 'Admin login failed' });
  }
});

export default router;
