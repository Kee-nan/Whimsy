import axios from 'axios';

/**
 * Builds a SearchPage-compatible searchFunction for a given media type.
 * Every backend search adapter (backend/services/external/*) returns a
 * consistent { results, page, totalPages, totalResults } shape, so one
 * function now covers all seven media types — no more per-type fetch
 * logic scattered across the frontend.
 */
export const createSearchFunction = (mediaType) => async (key, page = 1, limit = 15) => {
  try {
    const response = await axios.get(
      `${process.env.REACT_APP_API_URL}/api/search/${mediaType}`,
      { params: { q: key, page, limit } }
    );
    const { results, totalPages } = response.data;
    return {
      data: results || [],
      pagination: { last_visible_page: totalPages || 1 },
    };
  } catch (error) {
    console.error(`Error fetching ${mediaType}:`, error);
    return { data: [], pagination: { last_visible_page: 1 } };
  }
};

/**
 * Builds a DetailPage-compatible fetchDetails function for a given media
 * type. Returns the raw axios response — each extractDetails function
 * already expects response.data to be the upstream API's native shape,
 * and the backend proxy preserves that shape untouched.
 */
export const createFetchDetails = (mediaType) => async (id) => {
  return axios.get(`${process.env.REACT_APP_API_URL}/api/search/${mediaType}/${id}`);
};