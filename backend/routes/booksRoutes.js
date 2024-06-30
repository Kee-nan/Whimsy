const express = require('express');
const axios = require('axios');
const router = express.Router();

// Load environment variables
require('dotenv').config();

// GET /api/books/search
router.get('/search', async (req, res) => {
  const searchKey = req.query.q;
  const apiKey = process.env.GOOGLE_BOOKS_API_KEY;

  if (!searchKey) {
    return res.status(400).json({ error: 'Missing search query parameter' });
  }

  try {
    const response = await axios.get('https://www.googleapis.com/books/v1/volumes', {
      params: {
        q: searchKey,
        key: apiKey
      }
    });

    res.json(response.data);
  } catch (error) {
    console.error('Error fetching books:', error);
    res.status(500).json({ error: 'An error occurred while fetching books' });
  }
});

module.exports = router;
