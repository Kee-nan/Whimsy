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
      .map(r => ({
        id: `${r.media_type}/${r.external_id}`,   // composite — matches routing convention
        mediaItemId: r.media_item_id,              // internal PK, for future backend joins
        media: r.media_type,
        title: r.title,
        image: r.image_url,
      }));
    res.json({
      completed: shaped('completed'),
      current: shaped('current'),
      futures: shaped('futures'),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching lists' });
  }
});

// Replaces both /add and /upsert from the old Mongo version — Postgres's ON CONFLICT
// makes the "does it already exist" branch unnecessary.
router.post('/upsert', authenticateToken, async (req, res) => {
  try {
    const { media } = req.body;
    // Handles both conventions in the wild: composite "movie/12345" (DetailCard flow)
    // and raw "12345" (CSV import flow) — split only if a slash is present.
    const externalId = media.id.includes('/')
      ? media.id.split('/').slice(1).join('/')
      : media.id;

    const mediaItem = await mediaItemsQ.upsertMediaItem({
      mediaType: media.media,
      externalId,
      title: media.title,
      imageUrl: media.image,
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
    const { mediaId } = req.body; // composite "mediaType/externalId", as the frontend already sends
    const [mediaType, ...rest] = mediaId.split('/');
    const externalId = rest.join('/');
    const mediaItem = await mediaItemsQ.findByTypeAndExternalId(mediaType, externalId);
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
      id: `${r.media_type}/${r.external_id}`,
      mediaItemId: r.media_item_id,
      image: r.image_url,
      rating: r.rating,
      review: r.review_text,
      title: r.title,
    })));
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching reviews' });
  }
});

module.exports = router;


