const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/authenticateToken');
const globalStatsQ = require('../db/queries/globalStats');

router.get('/top-rated', authenticateToken, async (req, res) => {
  try {
    const { mediaType } = req.query;
    const rows = await globalStatsQ.getGlobalTopRated(100, mediaType || null);
    res.json(rows.map((r, idx) => ({
      rank: idx + 1,
      id: `${r.media_type}/${r.external_id}`,
      media: r.media_type,
      title: r.title,
      image: r.image_url,
      averageRating: parseFloat(r.average_rating),
      reviewCount: parseInt(r.review_count, 10),
    })));
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch global rankings' });
  }
});

module.exports = router;