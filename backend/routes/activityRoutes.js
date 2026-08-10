const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/authenticateToken');
const activityLogQ = require('../db/queries/activityLog');
const friendshipsQ = require('../db/queries/friendships');

function shapeActivity(rows, includeUser = false) {
  return rows.map(r => ({
    actionType: r.action_type,
    detail: r.detail,
    createdAt: r.created_at,
    media: r.media_type ? {
      id: `${r.media_type}/${r.external_id}`,
      media: r.media_type,
      title: r.title,
      image: r.image_url,
    } : null,
    ...(includeUser ? { username: r.username, userId: r.user_id, profilePicture: r.profile_picture_url } : {}),
  }));
}

/** GET /api/activity/me — the logged-in user's own last 5 actions. */
router.get('/me', authenticateToken, async (req, res) => {
  const rows = await activityLogQ.getRecentForUser(req.user.id, 5);
  res.json(shapeActivity(rows));
});

/** GET /api/activity/user/:userId — a friend's last 5 actions (must be friends). */
router.get('/user/:userId', authenticateToken, async (req, res) => {
  const targetId = parseInt(req.params.userId, 10);
  if (targetId !== req.user.id) {
    const isFriend = await friendshipsQ.areFriends(req.user.id, targetId);
    if (!isFriend) return res.status(403).json({ message: 'Not friends with this user' });
  }
  const rows = await activityLogQ.getRecentForUser(targetId, 5);
  res.json(shapeActivity(rows));
});

/** GET /api/activity/recommendations — "friends also logged" feed. */
router.get('/recommendations', authenticateToken, async (req, res) => {
  const rows = await activityLogQ.getFriendRecommendations(req.user.id, 20);
  res.json(rows.map(r => ({
    id: `${r.media_type}/${r.external_id}`,
    media: r.media_type,
    title: r.title,
    image: r.image_url,
    loggedBy: r.username,
    loggedAt: r.created_at,
  })));
});

module.exports = router;