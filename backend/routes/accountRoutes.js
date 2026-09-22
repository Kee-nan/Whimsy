const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const users = require('../db/queries/users');
const authTokensQ = require('../db/queries/authTokens');
const authenticateToken = require('../middleware/authenticateToken');
const { authLimiter } = require('../middleware/rateLimiters');
const { generateToken, hashToken } = require('../utils/tokens');
const { upload } = require('../middleware/upload');

const ACCESS_TOKEN_TTL = '15m';
const REFRESH_TOKEN_TTL_MS = 30 * 24 * 60 * 60 * 1000; // 30 days
const REFRESH_COOKIE_OPTS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production', // requires HTTPS in prod; fine as false over local http
  sameSite: 'lax',
  path: '/api/accounts',
  maxAge: REFRESH_TOKEN_TTL_MS,
};

function issueAccessToken(userId) {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: ACCESS_TOKEN_TTL });
  const { exp } = jwt.decode(token);
  return { token, expiresAt: exp * 1000 };
}

async function issueRefreshToken(res, userId) {
  const raw = generateToken();
  const expiresAt = new Date(Date.now() + REFRESH_TOKEN_TTL_MS);
  await authTokensQ.createRefreshToken(userId, hashToken(raw), expiresAt);
  res.cookie('refresh_token', raw, REFRESH_COOKIE_OPTS);
}

router.post('/login', authLimiter, async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ message: 'Username and password are required.' });

    const user = await users.findByUsername(username);
    if (!user) return res.status(401).json({ message: 'Username does not exist.' });

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) return res.status(401).json({ message: 'Incorrect password.' });

    const { token: user_token, expiresAt } = issueAccessToken(user.id);
    await issueRefreshToken(res, user.id);

    res.json({ user_token, expiresAt });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error logging in.' });
  }
});

/**
 * POST /api/accounts/refresh
 * Rotation with reuse detection: the refresh cookie is single-use. Each
 * call issues a brand-new refresh token and revokes the old one. If a
 * refresh token that's ALREADY revoked is ever presented again, that's a
 * strong signal it was stolen and used by someone else before the
 * legitimate owner — so every refresh token for that user is revoked
 * immediately, forcing a fresh login everywhere.
 */
router.post('/refresh', async (req, res) => {
  try {
    const raw = req.cookies?.refresh_token;
    if (!raw) return res.status(401).json({ message: 'No refresh token provided.' });

    const tokenHash = hashToken(raw);
    const existing = await authTokensQ.findRefreshToken(tokenHash);

    if (!existing) return res.status(401).json({ message: 'Invalid refresh token.' });

    if (existing.revoked_at) {
      // Reuse of an already-rotated token — treat as compromise.
      await authTokensQ.revokeAllRefreshTokensForUser(existing.user_id);
      res.clearCookie('refresh_token', { path: '/api/accounts' });
      return res.status(401).json({ message: 'Session invalidated. Please log in again.' });
    }

    if (new Date(existing.expires_at) < new Date()) {
      return res.status(401).json({ message: 'Refresh token expired. Please log in again.' });
    }

    await authTokensQ.revokeRefreshToken(existing.id);
    const { token: user_token, expiresAt } = issueAccessToken(existing.user_id);
    await issueRefreshToken(res, existing.user_id);

    res.json({ user_token, expiresAt });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error refreshing session.' });
  }
});

router.post('/logout', async (req, res) => {
  try {
    const raw = req.cookies?.refresh_token;
    if (raw) {
      const existing = await authTokensQ.findRefreshToken(hashToken(raw));
      if (existing && !existing.revoked_at) await authTokensQ.revokeRefreshToken(existing.id);
    }
    res.clearCookie('refresh_token', { path: '/api/accounts' });
    res.json({ message: 'Logged out.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error logging out.' });
  }
});

router.post('/create', authLimiter, async (req, res) => {
  try {
    const { firstName, lastName, username, email, password } = req.body;

    if (!firstName || !lastName || !username || !email || !password) {
      return res.status(400).json({ message: 'All fields are required.' });
    }
    if (password.length < 8) {
      return res.status(400).json({ message: 'Password must be at least 8 characters.' });
    }
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      return res.status(400).json({ message: 'Please enter a valid email address.' });
    }

    const existing = await users.findByUsernameOrEmail(username, email);
    if (existing) {
      if (existing.username.toLowerCase() === username.toLowerCase()) {
        return res.status(400).json({ message: 'Username already exists.' });
      }
      return res.status(400).json({ message: 'Email already exists.' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    await users.createUser({ firstName, lastName, username, email, passwordHash });
    res.status(201).json({ message: 'Account created successfully.' });
  } catch (error) {
    if (error.code === '23505') {
      return res.status(400).json({ message: 'That username or email is already taken.' });
    }
    console.error(error);
    res.status(500).json({ message: 'Error creating account.' });
  }
});

router.get('/user', authenticateToken, async (req, res) => {
  const user = await users.findById(req.user.id);
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.json({
    firstName: user.first_name,
    lastName: user.last_name,
    username: user.username,
    email: user.email,
    view_setting: user.view_setting,
    bio: user.bio,
    profilePicture: user.profile_picture_url
  });
});

router.put('/user', authenticateToken, async (req, res) => {
  try {
    const { firstName, lastName, username, email, bio } = req.body;
    const collision = await users.findUsernameOrEmailCollision(username, email, req.user.id);
    if (collision) {
      if (collision.username.toLowerCase() === username.toLowerCase()) {
        return res.status(400).json({ message: 'Username already exists' });
      }
      return res.status(400).json({ message: 'Email already exists' });
    }
    const updated = await users.updateProfile(req.user.id, { firstName, lastName, username, email, bio });
    res.json(updated);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating user details' });
  }
});

router.patch('/user/view-setting', authenticateToken, async (req, res) => {
  const { view_setting } = req.body;
  if (!['card', 'table'].includes(view_setting)) {
    return res.status(400).json({ message: 'Invalid view_setting value' });
  }
  const updated = await users.updateViewSetting(req.user.id, view_setting);
  res.json({ message: 'View setting updated', view_setting: updated.view_setting });
});

const favoritesQ = require('../db/queries/favorites');
const mediaItemsQ = require('../db/queries/mediaItems');

router.get('/favorites', authenticateToken, async (req, res) => {
  const rows = await favoritesQ.getForUser(req.user.id);
  const slots = Array(8).fill(null);
  for (const row of rows) {
    slots[row.slot_index] = {
      id: `${row.media_type}/${row.external_id}`,
      mediaItemId: row.media_item_id,
      media: row.media_type,
      title: row.title,
      image: row.image_url,
    };
  }
  res.json(slots);
});

router.patch('/favorites', authenticateToken, async (req, res) => {
  try {
    const incoming = req.body.favorites; // array of length 8, entries are media objects or null
    if (!Array.isArray(incoming) || incoming.length > 8) {
      return res.status(400).json({ message: 'Favorites must be an array of at most 8 items.' });
    }
    const slotIds = [];
    for (const item of incoming) {
      if (!item) { slotIds.push(null); continue; }
      const mediaItem = await mediaItemsQ.upsertMediaItem({
        mediaType: item.media, externalId: item.id, title: item.title, imageUrl: item.image,
      });
      slotIds.push(mediaItem.id);
    }
    await favoritesQ.replaceAll(req.user.id, slotIds);
    const rows = await favoritesQ.getForUser(req.user.id);
    res.json({ favorites: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error updating favorites' });
  }
});

router.patch('/bio', authenticateToken, async (req, res) => {
  try {
    const { bio } = req.body;
    const updated = await users.updateBio(req.user.id, bio ?? '');
    res.json({ bio: updated.bio });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating bio' });
  }
});

router.post('/profile-picture', authenticateToken, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No image file provided' });
    const relativeUrl = `/uploads/profile-pictures/${req.file.filename}`;
    const updated = await users.updateProfilePicture(req.user.id, relativeUrl);
    res.json({ profilePicture: updated.profile_picture_url });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error uploading profile picture' });
  }
});

module.exports = router;




