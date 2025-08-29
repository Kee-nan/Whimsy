
// src/pages/search/BookSearch.js
import axios from 'axios';
import SearchPage from '../templates/SearchPage';
import { Card } from 'react-bootstrap';

/**
 *  Search for Books with backend call
 */
const searchBooks = async (key, page = 1, pageSize = 15) => {
  try {
    const maxPages = 5; // maximum pages to fetch
    const cappedPage = Math.min(page, maxPages);
    const startIndex = (cappedPage - 1) * pageSize;

    const response = await axios.get("https://www.googleapis.com/books/v1/volumes", {
      params: {
        q: key,
        startIndex,
        maxResults: pageSize,
      },
    });

    // totalItems cannot exceed pageSize * maxPages
    const totalItems = Math.min(response.data.totalItems || 0, maxPages * pageSize);
    const lastVisiblePage = Math.ceil(totalItems / pageSize);

    return {
      data: response.data.items || [],
      pagination: {
        totalItems,
        page: cappedPage,
        pageSize,
        last_visible_page: lastVisiblePage,
        has_next_page: cappedPage < lastVisiblePage,
        has_prev_page: cappedPage > 1,
      },
    };
  } catch (error) {
    console.error("Error fetching Books:", error);
    alert("Error fetching Books");
    return {
      data: [],
      pagination: {
        totalItems: 0,
        page: 1,
        pageSize,
        last_visible_page: 1,
        has_next_page: false,
        has_prev_page: false,
      },
    };
  }
};



/**
 * Render Book card 
 */
const renderBookCard = (item) => (
  <>
    <Card.Img src={item.volumeInfo.imageLinks?.thumbnail || 'placeholder.jpg'} alt={item.volumeInfo.title} className="grid-card-image poster"/>
    <Card.Body>
      <Card.Title className="grid-card-title" style={{ color: 'white' }}>{item.volumeInfo.title}</Card.Title>
    </Card.Body>
  </>
);

/**
 *  Export the Search result to the search page template
 */
const BookSearch = () => (
  <SearchPage
    searchFunction={searchBooks}
    renderCard={renderBookCard}
    placeholder="Book"
    extractId={(item) => item.id}
  />
);

export default BookSearch;






