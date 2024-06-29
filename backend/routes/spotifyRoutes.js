const express = require('express');
const axios = require('axios');

const router = express.Router();

/**
 * Route to initiate Spotify authentication.
 * Redirects user to Spotify login for authorization.
 */
router.get('/', (req, res) => {
  const authUrl = `https://accounts.spotify.com/authorize?client_id=${process.env.SPOTIFY_CLIENT_ID}&redirect_uri=${encodeURIComponent(process.env.REDIRECT_URI)}&response_type=code&scope=user-read-private`;
  res.redirect(authUrl);
});

/**
 * Route to handle Spotify token exchange.
 * Exchanges authorization code for access token.
 */
router.post('/callback', async (req, res) => {
  const code = req.body.code;
  try {
    const response = await axios.post('https://accounts.spotify.com/api/token', null, {
      params: {
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: process.env.REDIRECT_URI,
        client_id: process.env.SPOTIFY_CLIENT_ID,
        client_secret: process.env.SPOTIFY_CLIENT_SECRET,
      },
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
