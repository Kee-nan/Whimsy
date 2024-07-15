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

// Get current list
router.get('/current', authenticateToken, async (req, res) => {
  const userId = req.user._id;
  try {
    const user = await User.findById(userId);
    if (!user) return res.sendStatus(404);
    res.json(user.current);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching current list');
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

// Delete item from a list
router.delete('/delete', authenticateToken, async (req, res) => {
  const { listType, id } = req.body;
  const userId = req.user._id;

  console.log(`Delete request received for list type: ${req.body.listType} with id: ${req.body.id}`);

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send('User not found');
    }

    let updatedList;
    if (listType === 'completedList') {
      updatedList = user.completed.filter(item => item.id !== id);
      user.completed = updatedList;
    } else if (listType === 'futuresList') {
      updatedList = user.futures.filter(item => item.id !== id);
      user.futures = updatedList;
    } else if (listType == 'currentList') {
      updatedList = user.current.filter(item => item.id !== id);
      user.current = updatedList;
    } else {
      console.error('Invalid list name')
    }

    await user.save();
    res.status(200).json(updatedList);
  } catch (error) {
    console.error('Error deleting item from list:', error);
    res.status(500).send('Server error');
  }
});



module.exports = router;


