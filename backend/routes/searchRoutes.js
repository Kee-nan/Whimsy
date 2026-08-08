const express = require('express');
const router = express.Router();
const searchService = require('../services/search/searchService');

/**
 * GET /api/search/:mediaType?q=...&page=...&limit=...
 * Unified search endpoint for every supported media type.
 */
router.get('/:mediaType', async (req, res) => {
  const { mediaType } = req.params;
  const { q, page = 1, limit = 15 } = req.query;

  if (!q) return res.status(400).json({ message: 'Missing search query parameter (q)' });

  try {
    const data = await searchService.search(mediaType, q, Number(page), Number(limit));
    res.json(data);
  } catch (error) {
    const status = error.status || 500;
    console.error(`Error searching ${mediaType}:`, error.message);
    res.status(status).json({ message: `Failed to search ${mediaType}` });
  }
});

/**
 * GET /api/search/:mediaType/:id
 * Unified detail-fetch endpoint for every supported media type.
 */
router.get('/:mediaType/:id', async (req, res) => {
  const { mediaType, id } = req.params;

  try {
    const data = await searchService.getById(mediaType, id);
    res.json(data);
  } catch (error) {
    const status = error.status || 500;
    console.error(`Error fetching ${mediaType} ${id}:`, error.message);
    res.status(status).json({ message: `Failed to fetch ${mediaType} details` });
  }
});

module.exports = router;

