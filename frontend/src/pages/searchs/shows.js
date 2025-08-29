
import axios from 'axios';
import SearchPage from '../templates/SearchPage';
import { Card } from 'react-bootstrap';


/**
 *  Search for shows with backend call
 */
const searchShows = async (key, page = 1, pageSize = 15) => {
  try {
    const response = await axios.get('https://api.tvmaze.com/search/shows', {
      params: { q: key }
    });

    const maxResults = 75; // limit total results
    const allResults = response.data
      .slice(0, maxResults)
      .map(item => item.show);

    const totalItems = allResults.length;
    const lastVisiblePage = Math.ceil(totalItems / pageSize);

    const paginatedData = allResults.slice((page - 1) * pageSize, page * pageSize);

    return {
      data: paginatedData,
      pagination: {
        totalItems,
        page,
        pageSize,
        last_visible_page: lastVisiblePage,
        has_next_page: page < lastVisiblePage,
        has_prev_page: page > 1,
      },
    };
  } catch (error) {
    console.error("Error fetching Shows:", error);
    alert("Error fetching Shows");
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
 * Render Show card 
 */
const renderShowCard = (item) => (
  <>
    <Card.Img src={item.image?.medium || 'placeholder.jpg'} alt={item.name} className="grid-card-image poster"/>
    <Card.Body>
      <Card.Title className="grid-card-title" style={{ color: 'white' }}>{item.name}</Card.Title>
    </Card.Body>
  </>
);

/**
 *  Export the Search result to the search page template
 */
const ShowsSearch = () => (
  <SearchPage
    searchFunction={searchShows}
    renderCard={renderShowCard}
    placeholder="Show"
    extractId={(item) => item.id}
  />
);

export default ShowsSearch;




