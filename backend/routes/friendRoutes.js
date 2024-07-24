// backend/routes/friendRequests.js
const express = require('express');
const router = express.Router();
const User = require('../models/user');  // Adjust the path as necessary
const authenticateToken = require('../middleware/authenticateToken');

// Send friend request
router.post('/send', authenticateToken, async (req, res) => {
  const senderId = req.user._id;
  const { receiverUsername } = req.body;

  try {
    const receiver = await User.findOne({ username: receiverUsername });

    if (!receiver) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Add senderId to receiver's friendRequests array if not already present
    if (!receiver.friendRequests.includes(senderId)) {
      receiver.friendRequests.push(senderId);
      await receiver.save();
    }

    res.status(200).json({ message: 'Friend request sent' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// Get pending friend requests
router.get('/pending', authenticateToken, async (req, res) => {
  const userId = req.user._id;
  try {
    const user = await User.findById(userId).populate('friendRequests', 'username');
    if (!user) return res.sendStatus(404);
    res.json(user.friendRequests.map(friend => ({ id: friend._id, username: friend.username })));
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching friend requests');
  }
});

// Accept friend request
router.post('/acceptRequest', authenticateToken, async (req, res) => {
  const userId = req.user._id;
  const { requestId } = req.body;
  try {
    const user = await User.findById(userId);
    const requester = await User.findById(requestId);

    if (!user || !requester) return res.status(404).send('User not found');

    user.friends.push(requestId);
    requester.friends.push(userId);

    user.friendRequests = user.friendRequests.filter(id => id.toString() !== requestId);
    await user.save();
    await requester.save();

    res.send('Friend request accepted');
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Decline friend request
router.post('/declineRequest', authenticateToken, async (req, res) => {
  const userId = req.user._id;
  const { requestId } = req.body;
  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).send('User not found');

    user.friendRequests = user.friendRequests.filter(id => id.toString() !== requestId);
    await user.save();

    res.send('Friend request declined');
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Get friends list
router.get('/friends', authenticateToken, async (req, res) => {
  const userId = req.user._id;
  try {
    const user = await User.findById(userId).populate('friends', 'username');
    if (!user) return res.sendStatus(404);
    res.json(user.friends.map(friend => ({ id: friend._id, username: friend.username })));
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching friends list');
  }
});

// Route to get a friend's lists
router.get('/friend-lists/:friendId', authenticateToken, async (req, res) => {
  try {
    const userId = req.user._id; // Authenticated user's ID from the token
    const friendId = req.params.friendId;
    console.log('Ids:', friendId, userId); // Debugging line

    // Find the authenticated user
    const user = await User.findById(userId);
    console.log('User:', user); // Debugging line

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if the friendId is in the user's friends list
    if (!user.friends || !user.friends.includes(friendId)) {
      return res.status(403).json({ message: 'You are not friends with this user' });
    }

    // Find the friend's user document
    const friend = await User.findById(friendId);
    if (!friend) {
      return res.status(404).json({ message: 'Friend not found' });
    }

    // Fetch the friend's lists (assuming they are stored on the user document)
    const { current, futures, completed, reviews, username, bio } = friend;

    // Send the lists back to the client
    res.json({ current, futures, completed, reviews, username, bio });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
