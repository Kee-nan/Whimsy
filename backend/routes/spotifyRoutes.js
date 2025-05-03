//spotifyRoutes.js

const express = require('express');
const axios = require('axios');
const router = express.Router();
const spotifyService = require('../controllers/spotifyService');

/**
 * Route: GET /api/spotify/search?q={query}
 * Description: Searches for albums on Spotify based on query string.
 */
router.get('/search', async (req, res) => {
  const { q } = req.query;
  if (!q) return res.status(400).json({ error: 'Missing query parameter' });

  try {
    const data = await spotifyService.searchAlbums(q);
    res.json(data.albums.items); // Send only items to frontend
  } catch (err) {
    console.error('Spotify Search Error:', err.message);
    res.status(500).json({ error: 'Failed to search Spotify' });
  }
});


/**
 * Route: GET /api/spotify/album/:id
 * Description: Fetches album details and full track list from Spotify.
 */
router.get('/album/:id', async (req, res) => {
  const albumId = req.params.id;
  console.log(`Fetching album details for ID: ${albumId}`);
  try {
    const album = await spotifyService.getAlbumDetails(req.params.id);
    console.log("Fetched album from Spotify:", album);
    res.json(album);
  } catch (err) {
    console.error('Detail error:', err);
    res.status(500).json({ error: 'Failed to fetch album details' });
  }
});

module.exports = router;
