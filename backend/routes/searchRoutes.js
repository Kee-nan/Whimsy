const express = require('express');
const axios = require('axios');
const spotifyService = require('../controllers/spotifyService');
const router = express.Router();

// Load environment variables
require('dotenv').config();

/**
 *  Searching for Movies
 */
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

/**
 *  Get movies by ID for details
 */
router.get('/movies/:id', async (req, res) => {
  const movieId = req.params.id;
  const apiKey = process.env.TMDB_API_KEY;

  try {
    const response = await axios.get(`https://api.themoviedb.org/3/movie/${movieId}`, {
      params: { api_key: apiKey }
    });

    res.json(response.data); 
    console.log(response.data)
  } catch (error) {
    console.error('Error fetching movie details:', error.message);
    res.status(500).json({ error: 'An error occurred while fetching movie details' });
  }
});



/**
 *  Search for games query
 */
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

/**
 *  Get games by ID details
 */
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

/**
 * Route: GET /api/spotify/search?q={query}
 * Description: Searches for albums on Spotify based on query string.
 */
router.get('/albums', async (req, res) => {
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
router.get('/albums/:id', async (req, res) => {
  const albumId = req.params.id;
  console.log(`Fetching album details for ID: ${albumId}`);
  try {
    const album = await spotifyService.getAlbumDetails(req.params.id);
    console.log("Fetched album from Spotify:", album.id);
    res.json(album);
  } catch (err) {
    console.error('Detail error:', err);
    res.status(500).json({ error: 'Failed to fetch album details' });
  }
});


module.exports = router;

