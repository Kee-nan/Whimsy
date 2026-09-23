// backend/services/external/tmdbService.js

const axios = require('axios');

const BASE_URL = 'https://api.themoviedb.org/3';

/**
 * Search TMDB for movies matching a query.
 * @param {string} query - search text
 * @param {number} page - 1-indexed page number
 * @returns {Promise<{ results: object[], page: number, totalPages: number, totalResults: number }>}
 */
async function search(query, page = 1) {
  const response = await axios.get(`${BASE_URL}/search/movie`, {
    params: { query, api_key: process.env.TMDB_API_KEY, page },
  });
  return {
    results: response.data.results || [],
    page: response.data.page,
    totalPages: response.data.total_pages,
    totalResults: response.data.total_results,
  };
}

/**
 * Fetch full details for a single movie by TMDB id.
 * @param {string} id - TMDB movie id
 */
async function getById(id) {
  const response = await axios.get(`${BASE_URL}/movie/${id}`, {
    params: { api_key: process.env.TMDB_API_KEY },
  });
  return response.data;
}

module.exports = { search, getById };