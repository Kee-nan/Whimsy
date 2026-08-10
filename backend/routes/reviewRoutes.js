const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/authenticateToken');
const reviewsQ = require('../db/queries/reviews');
const mediaItemsQ = require('../db/queries/mediaItems');
const mediaStatsQ = require('../db/queries/mediaStats');

/**
 * GET /api/review/stats?mediaType=movie&id=12345
 * Returns global rating, friend-only rating, and the list of friends
 * who have this item logged (for the "Friends' Activity" section).
 */
router.get('/stats', authenticateToken, async (req, res) => {
  try {
    const { mediaType, id } = req.query;
    const mediaItem = await mediaItemsQ.findByTypeAndExternalId(mediaType, id);

    // Item has never been added/reviewed by anyone yet — return empty stats
    // rather than erroring, since "no one has logged this yet" is a valid state.
    if (!mediaItem) {
      return res.json({
        global: { average: null, count: 0 },
        friends: { average: null, count: 0 },
        friendActivity: [],
      });
    }

    const [global, friends, friendActivity] = await Promise.all([
      mediaStatsQ.getGlobalRating(mediaItem.id),
      mediaStatsQ.getFriendRating(mediaItem.id, req.user.id),
      mediaStatsQ.getFriendActivity(mediaItem.id, req.user.id),
    ]);

    res.json({ global, friends, friendActivity });
  } catch (error) {
    console.error('Error fetching media stats:', error);
    res.status(500).json({ message: 'Error fetching media stats' });
  }
});

router.post('/add', authenticateToken, async (req, res) => {
  try {
    const { reviewData } = req.body; // { id, image, rating, review, title } — id is "mediaType/externalId"
    const [mediaType, externalId] = reviewData.id.split('/');
    const mediaItem = await mediaItemsQ.upsertMediaItem({
      mediaType, externalId, title: reviewData.title, imageUrl: reviewData.image,
    });
    await reviewsQ.upsertReview(req.user.id, mediaItem.id, reviewData.rating, reviewData.review);
    res.status(200).json({ message: 'Review added/updated successfully!' });
  } catch (error) {
    console.error('Error adding/updating review:', error);
    res.status(500).json({ message: 'Error adding/updating review', error: error.message });
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

module.exports = router;