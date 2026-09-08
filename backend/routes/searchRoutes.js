const express = require('express');
const router = express.Router();
const searchService = require('../services/search/searchService');
const mediaItemsQ = require('../db/queries/mediaItems');
const extractBasicInfo = require('../services/external/extractBasicInfo');
const { normalizeExternalRating } = require('../services/external/normalizeRating');

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
    console.error(`Error searching ${mediaType}:`, error.message);
    // Propagate the real status when we have one (e.g. upstream 4xx),
    // otherwise use 502 Bad Gateway — accurately says "the upstream
    // service failed," which is distinct from "our server crashed."
    const status = error.status || (error.response?.status && error.response.status < 500 ? error.response.status : 502);
    res.status(status).json({ message: `Failed to search ${mediaType}. The upstream service may be temporarily unavailable.` });
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

    // Best-effort caching of title/image/normalized external rating —
    // this is what populates the Global leaderboard's Source Rating
    // column over time. A failure here must never break the detail
    // page itself.
    try {
      const basic = extractBasicInfo(mediaType, data);
      if (basic?.title) {
        const rawForRating = (mediaType === 'anime' || mediaType === 'manga') ? data.data : data;
        const { externalRating, externalRatingCount } = normalizeExternalRating(mediaType, rawForRating);
        await mediaItemsQ.upsertMediaItem({
          mediaType, externalId: id, title: basic.title, imageUrl: basic.image,
          externalRating, externalRatingCount,
        });
      }
    } catch (cacheErr) {
      console.error('Non-fatal: failed to cache media item / external rating:', cacheErr.message);
    }

    res.json(data);
  } catch (error) {
    const status = error.status || 502;
    console.error(`Error fetching ${mediaType} ${id}:`, error.message);
    res.status(status).json({ message: `Failed to fetch ${mediaType} details` });
  }
});

module.exports = router;

