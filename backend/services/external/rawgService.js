// backend/services/external/rawgService.js

const axios = require('axios');
const BASE_URL = 'https://api.rawg.io/api';

/** Search RAWG for games matching a query. */
async function search(query, page = 1, pageSize = 15) {
  const response = await axios.get(`${BASE_URL}/games`, {
    params: { key: process.env.RAWG_API_KEY, search: query, page, page_size: pageSize },
  });
  return {
    results: response.data.results || [],
    page: Number(page),
    totalPages: Math.ceil((response.data.count || 0) / pageSize),
    totalResults: response.data.count || 0,
  };
}

/** Fetch full details for a single game by RAWG id. */
async function getById(id) {
  const response = await axios.get(`${BASE_URL}/games/${id}`, {
    params: { key: process.env.RAWG_API_KEY },
  });
  return response.data;
}

module.exports = { search, getById };