// backend/routes/listRoutes.js
const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/authenticateToken');
const listEntriesQ = require('../db/queries/listEntries');
const mediaItemsQ = require('../db/queries/mediaItems');
const reviewsQ = require('../db/queries/reviews');
const activityLogQ = require('../db/queries/activityLog');

router.get('/lists', authenticateToken, async (req, res) => {
  try {
    const rows = await listEntriesQ.getAllForUser(req.user.id);
    const shaped = (status) => rows
      .filter(r => r.status === status)
      .map(r => ({
        id: `${r.media_type}/${r.external_id}`,
        mediaItemId: r.media_item_id,
        media: r.media_type,
        title: r.title,
        image: r.image_url,
      }));
    res.json({ completed: shaped('completed'), current: shaped('current'), futures: shaped('futures') });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching lists' });
  }
});

router.post('/upsert', authenticateToken, async (req, res) => {
  try {
    const { media } = req.body;
    const externalId = media.id.includes('/')
      ? media.id.split('/').slice(1).join('/')
      : media.id;

    const mediaItem = await mediaItemsQ.upsertMediaItem({
      mediaType: media.media, externalId, title: media.title, imageUrl: media.image,
    });

    const existing = await listEntriesQ.getEntry(req.user.id, mediaItem.id);
    await listEntriesQ.upsertEntry(req.user.id, mediaItem.id, media.listType);

    if (!existing) {
      await activityLogQ.logActivity(req.user.id, 'list_add', mediaItem.id, { status: media.listType });
    } else if (existing.status !== media.listType) {
      await activityLogQ.logActivity(req.user.id, 'list_status_change', mediaItem.id, {
        from: existing.status, to: media.listType,
      });
    }

    res.status(200).json({ message: 'List updated' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to update list' });
  }
});

router.delete('/delete', authenticateToken, async (req, res) => {
  try {
    const { mediaId } = req.body;
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
      image: r.image_url, rating: r.rating, review: r.review_text, title: r.title,
    })));
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching reviews' });
  }
});

module.exports = router;
