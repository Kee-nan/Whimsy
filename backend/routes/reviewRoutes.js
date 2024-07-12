const express = require('express');
const router = express.Router();
const User = require('../models/user');
const authenticateToken = require('../middleware/authenticateToken');

// Add a new review
router.post('/add', authenticateToken, async (req, res) => {
  const { reviewData } = req.body;
  const userId = req.user._id; // Assuming you attach user object in authenticateToken

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if a review with the same id already exists
    const reviewIndex = user.reviews.findIndex(review => review.id === reviewData.id);
    if (reviewIndex !== -1) {
      // If it exists, remove the old review
      user.reviews.splice(reviewIndex, 1);
    }

    // Add the new review
    user.reviews.push(reviewData);
    await user.save();

    res.status(200).json({ message: 'Review added/updated successfully!' });
  } catch (error) {
    console.error('Error adding/updating review:', error); // Log the error for debugging
    res.status(500).json({ message: 'Error adding/updating review', error });
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

// In your routes/review.js
router.delete('/delete', authenticateToken, async (req, res) => {
  const userId = req.user._id; // Assuming you attach user object in authenticateToken
  const { mediaType, id } = req.query;
  const mediaId = `${mediaType}/${id}`;

  console.log('Deleting review for mediaId:', mediaId);

  try {
    const user = await User.findById(userId);
    if (!user) {
      console.log('User not found');
      return res.status(404).json({ message: 'User not found' });
    }

    const initialReviewCount = user.reviews.length;
    user.reviews = user.reviews.filter(review => review.id !== mediaId);

    if (user.reviews.length === initialReviewCount) {
      console.log('No review found to delete for mediaId:', mediaId);
      return res.status(404).json({ message: 'Review not found' });
    }

    await user.save();
    console.log('Review deleted successfully for mediaId:', mediaId);
    res.status(200).json({ message: 'Review deleted successfully' });
  } catch (error) {
    console.error('Error deleting review:', error);
    res.status(500).json({ message: 'Error deleting review', error });
  }
});



    

module.exports = router;