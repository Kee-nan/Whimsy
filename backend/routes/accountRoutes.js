const express = require('express');
const router = express.Router();
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const bcrypt = require('bcrypt');
const authenticateToken = require('../middleware/authenticateToken');

// Environment config
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

// Account creation endpoint
router.post('/create', async (req, res) => {
  try {
    const { firstName, lastName, username, email, password } = req.body;

    // Check if username or email already exists
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });

    if (existingUser) {
      if (existingUser.username === username) {
        return res.status(400).send('Error Creating Account: Username already exists');
      }
      if (existingUser.email === email) {
        return res.status(400).send('Error Creating Account: Email already exists');
      }
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Default User structure
    const newUser = new User({
      firstName,
      lastName,
      username,
      email,
      password: hashedPassword,
      completed: [],
      current: [],
      futures: [],
      favorites: [],
      reviews: [],
      bio: 'Default Bio',
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

    if (!user) return res.status(401).send('Username does not exist');

    // Compare the hashed password with the provided password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).send('Password does not match this User');

    const user_token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '3h' });
    res.json({ user_token });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error logging in');
  }
});

// Get user details endpoint
router.get('/user', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({
      firstName: user.firstName,
      lastName: user.lastName,
      username: user.username,
      email: user.email,
      bio: user.bio
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching user details' });
  }
});

// Update user details endpoint
router.put('/user', authenticateToken, async (req, res) => {
  try {
    const { firstName, lastName, username, email, bio } = req.body;

    // Check if username or email already exists for another user
    const existingUser = await User.findOne({ 
      $or: [{ username }, { email }],
      _id: { $ne: req.user._id } // Exclude the current user from the check
    });

    if (existingUser) {
      if (existingUser.username === username) {
        return res.status(400).json({ message: 'Username already exists' });
      }
      if (existingUser.email === email) {
        return res.status(400).json({ message: 'Email already exists' });
      }
    }

    const updateData = {
      firstName,
      lastName,
      username,
      email,
      bio, 
    };

    const updatedUser = await User.findByIdAndUpdate(req.user._id, updateData, { new: true });

    res.json(updatedUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating user details' });
  }
});


module.exports = router;





