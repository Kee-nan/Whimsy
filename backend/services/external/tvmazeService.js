const axios = require('axios');
const BASE_URL = 'https://api.tvmaze.com';

/** Search TVMaze for shows. TVMaze has no native pagination — paginate client-side (in-service). */
async function search(query, page = 1, pageSize = 15) {
  const response = await axios.get(`${BASE_URL}/search/shows`, { params: { q: query } });
  const allResults = response.data.map(item => item.show).slice(0, 75); // cap total results
  const totalItems = allResults.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const results = allResults.slice((page - 1) * pageSize, page * pageSize);
  return { results, page, totalPages, totalResults: totalItems };
}

/** Fetch full details for a single show by TVMaze id. */
async function getById(id) {
  const response = await axios.get(`${BASE_URL}/shows/${id}`);
  return response.data;
}

module.exports = { search, getById };