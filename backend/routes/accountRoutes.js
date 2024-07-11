const express = require('express');
const router = express.Router();
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

// Environment config
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

// Account creation endpoint
router.post('/create', async (req, res) => {
  try {
    const { firstName, lastName, username, email, password } = req.body;

    const newUser = new User({
      firstName,
      lastName,
      username,
      email,
      password,
      completed: [],
      current: [],
      futures: [],
      favorites: [],
      reviews: []
    });

    await newUser.save();
    res.status(201).send('Account created successfully');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error creating account');
  }
});

// Login endpoint
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    if (!user) return res.status(401).send('Invalid username or password');

    if (password !== user.password) return res.status(401).send('Invalid username or password');

    const user_token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '3h' });
    res.json({ user_token });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error logging in');
  }
});

module.exports = router;





