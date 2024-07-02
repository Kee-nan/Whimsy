const express = require('express');
const axios = require('axios');
const router = express.Router();

// Load environment variables
require('dotenv').config();

// GET /api/movies/search
router.get('/search', async (req, res) => {
  const searchKey = req.query.q;
  const apiKey = process.env.TMDB_API_KEY;

  if (!searchKey) {
    return res.status(400).json({ error: 'Missing search query parameter' });
  }

  try {
    const response = await axios.get('https://api.themoviedb.org/3/search/movie', {
      params: {
        query: searchKey,
        api_key: apiKey
      }
    });

    res.json(response.data);
  } catch (error) {
    console.error('Error fetching movies:', error);
    res.status(500).json({ error: 'An error occurred while fetching movies' });
  }
});

module.exports = router;