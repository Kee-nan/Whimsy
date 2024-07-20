const express = require('express');
const axios = require('axios');
const router = express.Router();

// Load environment variables
require('dotenv').config();

// Endpoint to obtain the OAuth token from Twitch for IGDB
router.post('/token', async (req, res) => {
  try {
    const response = await axios.post('https://id.twitch.tv/oauth2/token', null, {
      params: {
        client_id: process.env.IGDB_CLIENT_ID,
        client_secret: process.env.IGDB_CLIENT_SECRET,
        grant_type: 'client_credentials',
      },
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    res.json(response.data);
  } catch (error) {
    console.error('Error fetching IGDB token:', error);
    res.status(500).json({ error: 'Failed to fetch IGDB token' });
  }
});

module.exports = router;
