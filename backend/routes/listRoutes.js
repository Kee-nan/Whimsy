// backend/routes/listRoutes.js
const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/authenticateToken');
const User = require('../models/user');

// Get completed list
router.get('/completed', authenticateToken, async (req, res) => {
  const userId = req.user._id;
  try {
    const user = await User.findById(userId);
    if (!user) return res.sendStatus(404);
    res.json(user.completed);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching completed list');
  }
});

// Get futures list
router.get('/futures', authenticateToken, async (req, res) => {
  const userId = req.user._id;
  try {
    const user = await User.findById(userId);
    if (!user) return res.sendStatus(404);
    res.json(user.futures);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching futures list');
  }
});

// Add media to user's list (completed, futures, current)
router.post('/add', authenticateToken, async (req, res) => {
  const { listName, media } = req.body;
  const userId = req.user._id;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user[listName].push(media);
    await user.save();

    res.status(200).json({ message: `${media.title} added to ${listName}` });
  } catch (error) {
    res.status(500).json({ message: 'Failed to add media to list', error });
  }
});

module.exports = router;


