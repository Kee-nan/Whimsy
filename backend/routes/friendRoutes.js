// backend/routes/friendRequests.js
const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/authenticateToken');
const friendshipsQ = require('../db/queries/friendships');
const users = require('../db/queries/users');

router.post('/send', authenticateToken, async (req, res) => {
  try {
    const { receiverUsername } = req.body;
    const receiver = await users.findByUsername(receiverUsername);
    if (!receiver) return res.status(404).json({ message: 'User not found' });
    await friendshipsQ.sendRequest(req.user.id, receiver.id);
    res.status(200).json({ message: 'Friend request sent' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.get('/search', authenticateToken, async (req, res) => {
  const { query } = req.query;
  if (!query) return res.status(400).json({ message: 'Query is required' });
  const results = await friendshipsQ.searchUsers(query, req.user.id);
  res.json(results);
});

router.get('/pending', authenticateToken, async (req, res) => {
  const requests = await friendshipsQ.getPendingForUser(req.user.id);
  res.json(requests.map(r => ({ id: r.friendship_id, username: r.username })));
});

router.post('/acceptRequest', authenticateToken, async (req, res) => {
  const { requestId } = req.body; // this is now the friendship row id, not a user id
  const result = await friendshipsQ.accept(requestId, req.user.id);
  if (!result) return res.status(404).send('Request not found');
  res.send('Friend request accepted');
});

router.post('/declineRequest', authenticateToken, async (req, res) => {
  const { requestId } = req.body;
  const result = await friendshipsQ.decline(requestId, req.user.id);
  if (!result) return res.status(404).send('Request not found');
  res.send('Friend request declined');
});

router.get('/friends', authenticateToken, async (req, res) => {
  const friends = await friendshipsQ.getAcceptedForUser(req.user.id);
  res.json(friends);
});

router.delete('/delete/:friendId', authenticateToken, async (req, res) => {
  await friendshipsQ.remove(req.user.id, parseInt(req.params.friendId, 10));
  res.status(200).json({ message: 'Friend removed successfully' });
});

module.exports = router;
