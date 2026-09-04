const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/authenticateToken');
const globalStatsQ = require('../db/queries/globalStats');

// backend/routes/globalRoutes.js
router.get('/top-rated', authenticateToken, async (req, res) => {
  try {
    const { mediaType, source = 'whimsy' } = req.query; // 'whimsy' or 'external'
    const rows = source === 'external'
      ? await globalStatsQ.getExternalTopRated(100, mediaType || null)
      : await globalStatsQ.getGlobalTopRated(100, mediaType || null);
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch global rankings' });
  }
});

module.exports = router;