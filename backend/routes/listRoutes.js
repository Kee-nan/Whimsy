const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/authenticateToken');
const listEntriesQ = require('../db/queries/listEntries');
const mediaItemsQ = require('../db/queries/mediaItems');
const reviewsQ = require('../db/queries/reviews');
const activityLogQ = require('../db/queries/activityLog');
const {splitMediaId} = require('../utils/mediaId');

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
        loggedAt: r.logged_at,
      }));
    res.json({ completed: shaped('completed'), current: shaped('current'), futures: shaped('futures') });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching lists' });
  }
});

/**
 * GET /api/list/lists/detailed
 * Powers the data-focused table view on the Lists page: ratings from
 * every source, friend activity, and site-wide counts. Separate from
 * /lists since this query is meaningfully more expensive.
 */
router.get('/lists/detailed', authenticateToken, async (req, res) => {
  try {
    const rows = await listEntriesQ.getAllForUserWithStats(req.user.id);
    res.json(rows.map(r => ({
      id: `${r.media_type}/${r.external_id}`,
      mediaItemId: r.media_item_id,
      media: r.media_type,
      title: r.title,
      image: r.image_url,
      status: r.status,
      loggedAt: r.logged_at,
      yourRating: r.your_rating,
      globalRating: r.global_rating != null ? parseFloat(r.global_rating) : null,
      globalRatingCount: parseInt(r.global_rating_count || 0, 10),
      friendRating: r.friend_rating != null ? parseFloat(r.friend_rating) : null,
      friendRatingCount: parseInt(r.friend_rating_count || 0, 10),
      externalRating: r.external_rating != null ? parseFloat(r.external_rating) : null,
      externalRatingCount: r.external_rating_count,
      friendsWithItem: r.friends_with_item,
      siteCompletedCount: parseInt(r.site_completed_count, 10),
      siteWatchlistCount: parseInt(r.site_watchlist_count, 10),
      siteCurrentCount: parseInt(r.site_current_count, 10),
      siteWrittenReviewCount: parseInt(r.site_written_review_count, 10),
      siteFavoritedCount: parseInt(r.site_favorited_count, 10),
    })));
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching detailed lists' });
  }
});

router.post('/upsert', authenticateToken, async (req, res) => {
  try {
    const { media } = req.body;
    const externalId = splitMediaId(media.id); // was media.id.includes(...) directly — fixed

    const mediaItem = await mediaItemsQ.upsertMediaItem({
      mediaType: media.media, externalId, title: media.title, imageUrl: media.image,
    });

    const existing = await listEntriesQ.getEntry(req.user.id, mediaItem.id);
    const bumpLoggedAt = !existing || existing.status !== media.listType;
    await listEntriesQ.upsertEntry(req.user.id, mediaItem.id, media.listType, bumpLoggedAt);

    try {
      if (!existing) {
        await activityLogQ.logActivity(req.user.id, 'list_add', mediaItem.id, { status: media.listType });
      } else if (existing.status !== media.listType) {
        await activityLogQ.logActivity(req.user.id, 'list_status_change', mediaItem.id, {
          from: existing.status, to: media.listType,
        });
      }
    } catch (activityErr) {
      console.error('Non-fatal: failed to log activity for list upsert:', activityErr.message);
    }

    res.status(200).json({ message: 'List updated' });
  } catch (error) {
    console.error('Error updating list:', error);
    res.status(500).json({ message: 'Failed to update list' });
  }
});

router.patch('/logged-at', authenticateToken, async (req, res) => {
  try {
    const { mediaId, loggedAt } = req.body;
    if (!mediaId || !loggedAt) return res.status(400).json({ message: 'mediaId and loggedAt are required' });

    const [mediaType, ...rest] = mediaId.split('/');
    const externalId = rest.join('/');
    const mediaItem = await mediaItemsQ.findByTypeAndExternalId(mediaType, externalId);
    if (!mediaItem) return res.status(404).json({ message: 'Media item not found' });

    const updated = await listEntriesQ.updateLoggedAt(req.user.id, mediaItem.id, loggedAt);
    if (!updated) return res.status(404).json({ message: 'List entry not found' });

    res.json({ loggedAt: updated.logged_at });
  } catch (error) {
    console.error('Error updating logged date:', error);
    res.status(500).json({ message: 'Failed to update logged date' });
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
