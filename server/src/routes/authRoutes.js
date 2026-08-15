import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { OAuth2Client } from 'google-auth-library';

const router = express.Router();
const client = new
  OAuth2Client(process.env.GOOGLE_CLIENT_ID);

//Google OAuth
router.post('/google', async (req, res) => {
  try {
    const { token } = req.body;
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const { sub, email, name, picture } = payload;

    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        name: `${given_name} ${family_name}`,
        email,
        role: role || 'driver', // Make sure to accept 'role' from frontend
        password: '[PASSWORD]' // Google OAuth handles auth, but schema requires password
      });
    }

    const jwtToken = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET || 'yatriraksha_jwt_secret_key_2026',
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Google Auth Successful',
      token: jwtToken,
      user: { id: sub, name: name, email: email, role: role }
    });
  } catch (err) {
    console.error('Error verifying Google Token:');
    res.status(401).json({ message: 'Invalid Google Token' });
  }
});

// User Signup
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role, phone } = req.body;
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: 'User already exists' });

    const user = await User.create({ name, email, password, role: role || 'driver', phone });
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET || 'yatriraksha_jwt_secret_key_2026',
      { expiresIn: '7d' }
    );

    res.status(201).json({
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// User Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET || 'yatriraksha_jwt_secret_key_2026',
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
