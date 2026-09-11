const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/authenticateToken');
const globalStatsQ = require('../db/queries/globalStats');

router.get('/top-rated', authenticateToken, async (req, res) => {
  try {
    const { mediaType, sortBy = 'whimsy' } = req.query;
    const rows = await globalStatsQ.getTopRated({ limit: 100, mediaType: mediaType || null, sortBy, userId: req.user.id });
    res.json(rows.map((r, idx) => ({
      rank: idx + 1,
      id: `${r.media_type}/${r.external_id}`,
      media: r.media_type, title: r.title, image: r.image_url,
      whimsyRating: r.whimsy_rating != null ? parseFloat(r.whimsy_rating) : null,
      whimsyRatingCount: parseInt(r.whimsy_rating_count || 0, 10),
      externalRating: r.external_rating != null ? parseFloat(r.external_rating) : null,
      userRating: r.user_rating,
      friendRating: r.friend_rating != null ? parseFloat(r.friend_rating) : null,
      friendContributors: r.friend_contributors || [],
    })));
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch global rankings' });
  }
});

module.exports = router;