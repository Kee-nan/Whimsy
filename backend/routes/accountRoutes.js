const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const users = require('../db/queries/users');
const authenticateToken = require('../middleware/authenticateToken');
const { upload } = require('../middleware/upload');

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await users.findByUsername(username);
    if (!user) return res.status(401).send('Username does not exist');

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) return res.status(401).send('Password does not match this User');

    const user_token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '5h' });
    const decoded = jwt.decode(user_token);

    res.json({ user_token, expiresAt: decoded.exp * 1000 });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error logging in');
  }
});

router.post('/create', async (req, res) => {
  try {
    const { firstName, lastName, username, email, password } = req.body;

    const existing = await users.findByUsernameOrEmail(username, email);
    if (existing) {
      if (existing.username.toLowerCase() === username.toLowerCase()) {
        return res.status(400).send('Error Creating Account: Username already exists');
      }
      return res.status(400).send('Error Creating Account: Email already exists');
    }

    const passwordHash = await bcrypt.hash(password, 10);
    await users.createUser({ firstName, lastName, username, email, passwordHash });
    res.status(201).send('Account created successfully');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error creating account');
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




