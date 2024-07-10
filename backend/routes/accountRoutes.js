// backend/routes/accountRoutes.js
const express = require('express');
const router = express.Router();
const User = require('../models/user'); 

// Account creation endpoint
router.post('/create', async (req, res) => {
  try {
    const { firstName, lastName, username, email, password } = req.body;

    // Create a new user instance
    const newUser = new User({
      firstName,
      lastName,
      username,
      email,
      password, // Store plaintext password for now
      completed: [],  
      current: [],    
      futures: [],    
      favorites: [],  
      reviews: []     
    });

    // Save the user to the database
    await newUser.save();

    res.status(201).send('Account created successfully');
  } catch (error) {
    console.error(error);  // Log the error for debugging
    res.status(500).send('Error creating account');
  }
});

// Login endpoint
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Find the user by username
    const user = await User.findOne({ username });

    if (!user) {
      // User not found
      return res.status(401).send('Invalid username or password');
    }

    // Compare the provided password with the stored password
    if (user.password === password) {
      // Passwords match
      res.status(200).send('Login successful');
    } else {
      // Passwords don't match
      res.status(401).send('Invalid username or password');
    }
  } catch (error) {
    console.error(error);  // Log the error for debugging
    res.status(500).send('Error logging in');
  }
});

module.exports = router;


