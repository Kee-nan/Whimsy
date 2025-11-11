// backend/routes/listRoutes.js
const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/authenticateToken');
const User = require('../models/user');

// Unified route to fetch all lists
router.get('/lists', authenticateToken, async (req, res) => {
  const userId = req.user._id;

  try {
    const user = await User.findById(userId);
    if (!user) return res.sendStatus(404);

    user.lists = user.lists.filter(item => item != null);

    // Return all lists at once
    res.json({
      completed: user.lists.filter(item => item && item.listType === 'completed'),
      futures: user.lists.filter(item => item && item.listType === 'futures'),
      current: user.lists.filter(item => item && item.listType === 'current'),
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching lists');
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

    user.lists = user.lists.filter(item => item != null);

    const exists = user.lists.some(item => item.id === media.id && item.listType === listName);
    if (exists) {
      return res.status(400).json({ message: 'Media already in this list' });
    }

    user.lists.push(media);
    await user.save();

    res.status(200).json({ message: `${media.title} added to lists with value ${listName}` });
  } catch (error) {
    res.status(500).json({ message: 'Failed to add media to list', error });
  }
});

// Upsert media (add new or update existing listType)
router.post('/upsert', authenticateToken, async (req, res) => {
  const { media } = req.body;
  const userId = req.user._id;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).send('User not found');

    user.lists = user.lists.filter(item => item != null);

    const existing = user.lists.find(item => item.id === media.id);
    if (existing) {
      existing.listType = media.listType;
    } else {
      user.lists.push(media);
    }

    await user.save();
    res.status(200).json({ message: 'List updated' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to update list' });
  }
});

// Delete media from list
router.delete('/delete', authenticateToken, async (req, res) => {
  const { mediaId } = req.body;
  const userId = req.user._id;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).send('User not found');

    user.lists = user.lists.filter(item => item.id !== mediaId);
    await user.save();

    res.status(200).json({ message: 'Media removed from list' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to delete media from list' });
  }
});

// Get current list
router.get('/reviews', authenticateToken, async (req, res) => {
  const userId = req.user._id;
  try {
    const user = await User.findById(userId);
    if (!user) return res.sendStatus(404);
    res.json(user.reviews);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching current list');
  }
});


module.exports = router;


