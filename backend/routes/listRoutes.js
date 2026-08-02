// backend/routes/listRoutes.js
const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/authenticateToken');
const listEntriesQ = require('../db/queries/listEntries');
const mediaItemsQ = require('../db/queries/mediaItems');
const reviewsQ = require('../db/queries/reviews');

router.get('/lists', authenticateToken, async (req, res) => {
  try {
    const rows = await listEntriesQ.getAllForUser(req.user.id);
    const shaped = (status) => rows
      .filter(r => r.status === status)
      .map(r => ({ id: r.media_item_id, media: r.media_type, title: r.title, image: r.image_url }));
    res.json({
      completed: shaped('completed'),
      current: shaped('current'),
      futures: shaped('futures'),
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching lists');
  }
});

// Replaces both /add and /upsert from the old Mongo version — Postgres's ON CONFLICT
// makes the "does it already exist" branch unnecessary.
router.post('/upsert', authenticateToken, async (req, res) => {
  try {
    const { media } = req.body; // { id: externalId, media: mediaType, title, image, listType }
    const mediaItem = await mediaItemsQ.upsertMediaItem({
      mediaType: media.media, externalId: media.id, title: media.title, imageUrl: media.image,
    });
    await listEntriesQ.upsertEntry(req.user.id, mediaItem.id, media.listType);
    res.status(200).json({ message: 'List updated' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to update list' });
  }
});

router.delete('/delete', authenticateToken, async (req, res) => {
  try {
    const { mediaId, mediaType } = req.body; // needs both now — see frontend note below
    const mediaItem = await mediaItemsQ.findByTypeAndExternalId(mediaType, mediaId);
    if (mediaItem) await listEntriesQ.deleteEntry(req.user.id, mediaItem.id);
    res.status(200).json({ message: 'Media removed from list' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to delete media from list' });
  }
});

router.get('/reviews', authenticateToken, async (req, res) => {
  try {
    const rows = await reviewsQ.getAllForUser(req.user.id);
    res.json(rows.map(r => ({
      id: r.media_item_id, image: r.image_url, rating: r.rating, review: r.review_text, title: r.title,
    })));
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching current list');
  }
});

module.exports = router;


