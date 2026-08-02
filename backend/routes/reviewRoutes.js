const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/authenticateToken');
const reviewsQ = require('../db/queries/reviews');
const mediaItemsQ = require('../db/queries/mediaItems');

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