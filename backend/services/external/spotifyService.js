const httpClient = require('./httpClient');
const withRetry = require('./withRetry');

let cachedToken = null;
let tokenExpiresAt = null;

async function getAppAccessToken() {
  const now = Date.now();
  // 5s safety buffer so we never use a token that expires mid-request
  if (cachedToken && tokenExpiresAt && now < tokenExpiresAt - 5000) {
    return cachedToken;
  }

  if (!process.env.SPOTIFY_CLIENT_ID || !process.env.SPOTIFY_CLIENT_SECRET) {
    const err = new Error('Spotify credentials are not configured');
    err.status = 500;
    throw err;
  }

  // FIX: grant_type must be sent in the request BODY (form-urlencoded),
  // not as a query param — this was the root cause of intermittent
  // token failures.
  const response = await httpClient.post(
    'https://accounts.spotify.com/api/token',
    new URLSearchParams({ grant_type: 'client_credentials' }).toString(),
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: 'Basic ' + Buffer.from(
          `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
        ).toString('base64'),
      },
    }
  );

  cachedToken = response.data.access_token;
  tokenExpiresAt = now + response.data.expires_in * 1000;
  return cachedToken;
}

async function search(query, page = 1, limit = 15) {
  return withRetry(async () => {
    const token = await getAppAccessToken();
    const offset = (page - 1) * limit;
    const response = await httpClient.get('https://api.spotify.com/v1/search', {
      headers: { Authorization: `Bearer ${token}` },
      params: { q: query, type: 'album', limit, offset },
    });

    const albums = response.data.albums;
    // FIX: normalize to the shape every other adapter returns, instead
    // of leaking Spotify's raw response shape to the frontend.
    return {
      results: albums.items || [],
      page: Number(page),
      totalPages: Math.ceil((albums.total || 0) / limit),
      totalResults: albums.total || 0,
    };
  });
}

async function getById(albumId) {
  return withRetry(async () => {
    const token = await getAppAccessToken();
    const albumResponse = await httpClient.get(`https://api.spotify.com/v1/albums/${albumId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const album = albumResponse.data;

    const tracksResponse = await httpClient.get(
      `https://api.spotify.com/v1/albums/${albumId}/tracks?limit=50`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    album.tracks.items = tracksResponse.data.items;

    return album;
  });
}

module.exports = { search, getById };