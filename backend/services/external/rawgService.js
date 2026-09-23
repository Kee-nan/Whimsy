// backend/services/external/rawgService.js

const httpClient = require('./httpClient');
const withRetry = require('./withRetry');

const BASE_URL = 'https://api.rawg.io/api';

async function search(query, page = 1, pageSize = 15) {
  return withRetry(async () => {
    const response = await httpClient.get(`${BASE_URL}/games`, {
      params: { key: process.env.RAWG_API_KEY, search: query, page, page_size: pageSize },
    });
    return {
      results: response.data.results || [],
      page: Number(page),
      totalPages: Math.ceil((response.data.count || 0) / pageSize),
      totalResults: response.data.count || 0,
    };
  });
}

async function getById(id) {
  return withRetry(async () => {
    const response = await httpClient.get(`${BASE_URL}/games/${id}`, {
      params: { key: process.env.RAWG_API_KEY },
    });
    return response.data;
  });
}

module.exports = { search, getById };