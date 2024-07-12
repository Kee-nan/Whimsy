const express = require('express');
const router = express.Router();
const User = require('../models/user');
const authenticateToken = require('../middleware/authenticateToken');

// Add a new review
router.post('/add', authenticateToken, async (req, res) => {
  const { reviewData } = req.body;
  const userId = req.user._id; // Assuming you attach user object in authenticateToken

  console.log(reviewData)
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.reviews.push(reviewData);
    await user.save();

    res.status(200).json({ message: 'Review added successfully!' });
  } catch (error) {
    console.error('Error adding review:', error); // Log the error for debugging
    res.status(500).json({ message: 'Error adding review', error });
  }
});

// Get reviews for a specific media item (using GET with query parameters)
router.get('/get', authenticateToken, async (req, res) => {
  console.log('Received GET request for review with query:', req.query);
  const { mediaType, id } = req.query;
  const mediaId = `${mediaType}/${id}`;
  const userId = req.user._id; // Assuming you attach user object in authenticateToken
  console.log(mediaId)

  try {
    const user = await User.findById(userId);
    if (!user) {
      console.log('User not found');
      return res.status(404).json({ message: 'User not found' });
    }

    const review = user.reviews.find(review => review.id === mediaId);
    if (!review) {
      console.log('Review not found for mediaId:', mediaId);
      return res.status(404).json({ message: 'Review not found' });
    }

    res.status(200).json({ review });
  } catch (error) {
    console.error('Error fetching review:', error);
    res.status(500).json({ message: 'Error fetching review', error });
  }
});


    

module.exports = router;