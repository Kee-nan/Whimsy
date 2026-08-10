const httpClient = require('./httpClient');
const withRetry = require('./withRetry');

const BASE_URL = 'https://www.googleapis.com/books/v1';

async function search(query, page = 1, pageSize = 15) {
  return withRetry(async () => {
    const maxPages = 5;
    const cappedPage = Math.min(page, maxPages);
    const startIndex = (cappedPage - 1) * pageSize;
    const response = await httpClient.get(`${BASE_URL}/volumes`, {
      params: { q: query, startIndex, maxResults: pageSize, key: process.env.GOOGLE_BOOKS_KEY },
    });
    const totalItems = Math.min(response.data.totalItems || 0, maxPages * pageSize);
    return {
      results: response.data.items || [],
      page: cappedPage,
      totalPages: Math.ceil(totalItems / pageSize),
      totalResults: totalItems,
    };
  });
}

async function getById(id) {
  return withRetry(async () => {
    const response = await httpClient.get(`${BASE_URL}/volumes/${id}`, {
      params: { key: process.env.GOOGLE_BOOKS_KEY },
    });
    return response.data;
  });
}

module.exports = { search, getById };