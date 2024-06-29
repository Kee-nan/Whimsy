const express = require('express');
const axios = require('axios');
const router = express.Router();

// Endpoint to search for movies
router.get('/search', async (req, res) => {
  const { query } = req;
  const { s } = query; // Extract the search key from query parameters

  try {
    // Make a request to the OMDb API
    const response = await axios.get(`http://www.omdbapi.com/?s=${searchKey}&apikey=${process.env.OMDB_API_KEY}`);
    res.json(response.data); // Send the OMDb API response back to the frontend

  // Error Handling
  } catch (error) {
    console.error("Error fetching movies:", error);
    res.status(500).json({ error: "Error fetching movies from OMDb API" });
  }
});

module.exports = router;
