const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/authenticateToken');
const reviewsQ = require('../db/queries/reviews');
const mediaItemsQ = require('../db/queries/mediaItems');
const mediaStatsQ = require('../db/queries/mediaStats');
const activityLogQ = require('../db/queries/activityLog');
const reviewLikesQ = require('../db/queries/reviewLikes');

router.post('/add', authenticateToken, async (req, res) => {
  try {
    const { reviewData } = req.body;
    const [mediaType, ...rest] = reviewData.id.split('/');
    const externalId = rest.join('/');

    const mediaItem = await mediaItemsQ.upsertMediaItem({
      mediaType, externalId, title: reviewData.title, imageUrl: reviewData.image,
    });

    const existingReview = await reviewsQ.getOne(req.user.id, mediaItem.id);
    await reviewsQ.upsertReview(req.user.id, mediaItem.id, reviewData.rating, reviewData.review);

    try {
      await activityLogQ.logActivity(
        req.user.id,
        existingReview ? 'review_update' : 'review_add',
        mediaItem.id,
        { rating: reviewData.rating }
      );
    } catch (activityErr) {
      console.error('Non-fatal: failed to log activity for review:', activityErr.message);
    }

    res.status(200).json({ message: 'Review added/updated successfully!' });
  } catch (error) {
    console.error('Error adding/updating review:', error);
    res.status(500).json({ message: 'Error adding/updating review', error: error.message });
  }
});

router.get('/list', authenticateToken, async (req, res) => {
  try {
    const { mediaType, id, page = 1, limit = 10 } = req.query;
    if (!mediaType || !id) return res.status(400).json({ message: 'mediaType and id are required' });

    const mediaItem = await mediaItemsQ.findByTypeAndExternalId(mediaType, id);
    if (!mediaItem) {
      return res.json({ reviews: [], page: 1, totalPages: 0, totalCount: 0 });
    }

    const result = await reviewsQ.getPaginatedForMedia(mediaItem.id, req.user.id, Number(page), Number(limit));
    res.json(result);
  } catch (error) {
    console.error('Error fetching review list:', error);
    res.status(500).json({ message: 'Failed to fetch reviews' });
  }
});

router.post('/:reviewId/like', authenticateToken, async (req, res) => {
  try {
    const reviewId = parseInt(req.params.reviewId, 10);
    const result = await reviewLikesQ.toggleLike(reviewId, req.user.id);
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to toggle like' });
  }
});

router.get('/get', authenticateToken, async (req, res) => {
  try {
    const { mediaType, id } = req.query;
    const mediaItem = await mediaItemsQ.findByTypeAndExternalId(mediaType, id);
    if (!mediaItem) return res.status(404).json({ message: 'Review not found' });
    const review = await reviewsQ.getOne(req.user.id, mediaItem.id);
    if (!review) return res.status(404).json({ message: 'Review not found' });
    res.status(200).json({ review: { rating: review.rating, review: review.review_text } });
  } catch (error) {
    console.error('Error fetching review:', error);
    res.status(500).json({ message: 'Error fetching review', error: error.message });
  }
});


router.delete('/delete', authenticateToken, async (req, res) => {
  try {
    const { mediaType, id } = req.query;
    const mediaItem = await mediaItemsQ.findByTypeAndExternalId(mediaType, id);
    if (!mediaItem) return res.status(404).json({ message: 'Review not found' });
    const deleted = await reviewsQ.deleteReview(req.user.id, mediaItem.id);
    if (!deleted) return res.status(404).json({ message: 'Review not found' });
    res.status(200).json({ message: 'Review deleted successfully' });
  } catch (error) {
    console.error('Error deleting review:', error);
    res.status(500).json({ message: 'Error deleting review', error: error.message });
  }
});

router.get('/distribution', authenticateToken, async (req, res) => {
  const rows = await reviewsQ.getRatingDistribution(req.user.id);
  const counts = Array(31).fill(0);
  rows.forEach((r) => { counts[r.rating] = parseInt(r.count, 10); });
  res.json(counts);
});


router.get('/stats', authenticateToken, async (req, res) => {
  try {
    const { mediaType, id } = req.query;

    if (!mediaType || !id) {
      return res.status(400).json({
        message: 'mediaType and id are required'
      });
    }

    const mediaItem = await mediaItemsQ.findByTypeAndExternalId(
      mediaType,
      id
    );

    if (!mediaItem) {
      return res.json({
        global: { average: null, count: 0 },
        friends: { average: null, count: 0 },
        external: { average: null, count: null },
        friendActivity: []
      });
    }

    const [global, friends, external, friendActivity] = await Promise.all([
      mediaStatsQ.getGlobalRating(mediaItem.id),
      mediaStatsQ.getFriendRating(mediaItem.id, req.user.id),
      mediaStatsQ.getExternalRating(mediaItem.id),
      mediaStatsQ.getFriendActivity(mediaItem.id, req.user.id),
    ]);

    res.json({
      global,
      friends,
      external,
      friendActivity
    });
  } catch (error) {
    console.error('Error fetching media stats:', error);
    res.status(500).json({
      message: 'Failed to fetch media stats'
    });
  }
});


module.exports = router;