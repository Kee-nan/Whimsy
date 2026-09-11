// backend/routes/friendRequests.js
const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/authenticateToken');
const friendshipsQ = require('../db/queries/friendships');
const users = require('../db/queries/users');
const listEntriesQ = require('../db/queries/listEntries');

const favoritesQ = require('../db/queries/favorites');
const reviewsQ = require('../db/queries/reviews');

router.post('/send', authenticateToken, async (req, res) => {
  try {
    const { receiverUsername } = req.body;
    const receiver = await users.findByUsername(receiverUsername);
    if (!receiver) return res.status(404).json({ message: 'User not found' });
    if (receiver.id === req.user.id) {
      return res.status(400).json({ message: "You can't send a friend request to yourself" });
    }

    const result = await friendshipsQ.sendRequest(req.user.id, receiver.id);
    if (result.alreadyFriends) return res.status(409).json({ message: 'You are already friends' });
    if (result.alreadyPending) return res.status(409).json({ message: 'A request is already pending' });

    res.status(200).json({ message: 'Friend request sent' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
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
  res.json(requests.map((r) => ({ id: r.friendship_id, username: r.username, profilePicture: r.profile_picture_url })));
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
router.get('/friend-lists/:friendId', authenticateToken, async (req, res) => {
  try {
    const friendId = parseInt(req.params.friendId, 10);
    const isFriend = await friendshipsQ.areFriends(req.user.id, friendId);
    if (!isFriend) return res.status(403).json({ message: 'Not friends with this user' });

    const friend = await users.findById(friendId);
    if (!friend) return res.status(404).json({ message: 'User not found' });

    const listRows = await listEntriesQ.getAllForUser(friendId);
    const lists = listRows.map((r) => ({
      id: `${r.media_type}/${r.external_id}`, media: r.media_type, title: r.title, image: r.image_url, listType: r.status,
    }));

    const favRows = await favoritesQ.getForUser(friendId);
    const favorites = favRows.map((r) => ({
      id: `${r.media_type}/${r.external_id}`, media: r.media_type, title: r.title, image: r.image_url,
    }));

    res.json({ username: friend.username, bio: friend.bio, view_setting: friend.view_setting, lists, favorites });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching friend lists' });
  }
});

router.get('/:friendId/lists/detailed', authenticateToken, async (req, res) => {
  try {
    const friendId = parseInt(req.params.friendId, 10);
    const isFriend = await friendshipsQ.areFriends(req.user.id, friendId);
    if (!isFriend) return res.status(403).json({ message: 'Not friends with this user' });

    const friend = await users.findById(friendId);
    if (!friend) return res.status(404).json({ message: 'User not found' });

    const rows = await listEntriesQ.getDetailedForUser(friendId);
    res.json({
      username: friend.username,
      items: rows.map((r) => ({
        id: `${r.media_type}/${r.external_id}`,
        media: r.media_type, title: r.title, image: r.image_url, status: r.status,
        loggedAt: r.logged_at,
        friendRating: r.target_rating,
        globalRating: r.global_rating != null ? parseFloat(r.global_rating) : null,
        globalRatingCount: parseInt(r.global_rating_count || 0, 10),
        externalRating: r.external_rating != null ? parseFloat(r.external_rating) : null,
        tags: r.tags,
      })),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch friend list' });
  }
});

module.exports = router;
