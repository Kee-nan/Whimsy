const express = require('express');
const axios = require('axios');
const router = express.Router();

// Load environment variables
require('dotenv').config();

// Movies search route 
router.get('/movies', async (req, res) => {
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

    // Ensure data is returned in a structure with `results` array
    res.json({ results: response.data.results || [] });
  } catch (error) {
    console.error('Error fetching movies:', error);
    res.status(500).json({ error: 'An error occurred while fetching movies' });
  }
});

// GET /api/movies/:id
router.get('/movie/:id', async (req, res) => {
  const movieId = req.params.id;
  const apiKey = process.env.TMDB_API_KEY;

  try {
    const response = await axios.get(`https://api.themoviedb.org/3/movie/${movieId}`, {
      params: { api_key: apiKey }
    });

    res.send(response);
  } catch (error) {
    console.error('Error fetching movie details:', error);
    res.status(500).json({ error: 'An error occurred while fetching movie details' });
  }
});

router.get('/games', async (req, res) => {
  const searchKey = req.query.q;
  const apiKey = process.env.RAWG_API_KEY;

  if (!searchKey) {
    return res.status(400).json({ error: 'Missing search query parameter' });
  }

  try {
    const response = await axios.get('https://api.rawg.io/api/games', {
      params: {
        key: apiKey,
        search: searchKey
      }
    });

    // Ensure data is returned in a structure with `results` array
    res.json({ results: response.data.results || [] });
  } catch (error) {
    console.error('Error fetching games:', error);
    res.status(500).json({ error: 'An error occurred while fetching games' });
  }
});

router.get('/games/:id', async (req, res) => {
  const gameId = req.params.id;
  const apiKey = process.env.RAWG_API_KEY; // Ensure you have this in your .env file

  try {
    const response = await axios.get(`https://api.rawg.io/api/games/${gameId}`, {
      params: { key: apiKey }
    });

    res.send(response.data);
  } catch (error) {
    console.error('Error fetching game details:', error);
    res.status(500).json({ error: 'An error occurred while fetching game details' });
  }
});


module.exports = router;

