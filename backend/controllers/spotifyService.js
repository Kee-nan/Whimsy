// backend/spotifyService.js
const axios = require('axios');

// Caching the token and its expiration time to avoid requesting it on every API call
let cachedToken = null;
let tokenExpiresAt = null;


// fetches an app-level access token using Spotify's Client Credentials Flow.
// The token is cached until it expires to reduce the number of auth requests.
async function getAppAccessToken() {
  const now = Date.now();
  if (cachedToken && tokenExpiresAt && now < tokenExpiresAt) {
    return cachedToken;
  }

  // Make POST request to Spotify API to get a new token
  const response = await axios.post('https://accounts.spotify.com/api/token', null, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Basic ' + Buffer.from(`${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`).toString('base64'),
    },
    params: {
      grant_type: 'client_credentials',
    },
  });

  // Save token and calculate expiration timestamp
  cachedToken = response.data.access_token;
  tokenExpiresAt = now + response.data.expires_in * 1000;

  return cachedToken;
}


// Given a query string it searches albums on spotify
async function searchAlbums(query) {
  const token = await getAppAccessToken();
  const response = await axios.get('https://api.spotify.com/v1/search', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params: {
      q: query, // entered query from the searchbar
      type: 'album', // only return type album
    },
  });
  return response.data;
}


// Fetches full album details including a separate request for track list.
async function getAlbumDetails(albumId) {
  const accessToken = await getAppAccessToken(); // however you fetch the token

  // Fetch album metadata
  const albumResponse = await axios.get(`https://api.spotify.com/v1/albums/${albumId}`, {
    headers: { Authorization: `Bearer ${accessToken}` }
  });
  const album = albumResponse.data;

  // Fetch tracks separately to ensure `items` is present
  const tracksResponse = await axios.get(`https://api.spotify.com/v1/albums/${albumId}/tracks?limit=50`, {
    headers: { Authorization: `Bearer ${accessToken}` }
  });

  // Combine track data into the album object
  album.tracks.items = tracksResponse.data.items;

  return album;
};

// Export the service functions
module.exports = {
  searchAlbums,
  getAlbumDetails
};
