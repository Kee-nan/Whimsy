
import axios from 'axios';
import SearchPage from '../templates/SearchPage';
import { Card } from 'react-bootstrap';

/**
 * Search for Games with backend call
 */
const searchGames = async (key, page = 1, pageSize = 15) => {
  try {
    const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/search/games`, {
      params: { q: key, page, page_size: pageSize },
    });

    const count = response.data.count || 0;
    const totalPages = Math.ceil(count / pageSize);

    return {
      data: response.data.results || [],
      pagination: {
        current_page: response.data.page || 1,
        last_visible_page: totalPages || 1,   // 🔹 match anime/manga format
        items: {
          count: count,
          per_page: pageSize,
        },
        has_next_page: !!response.data.next,
      },
    };
  } catch (error) {
    console.error("Error fetching games:", error);
    alert("Error fetching games");
    return { data: [], pagination: {} };
  }
};

/**
 * Render Games card 
 */
const renderGameCard = (item) => (
  <>
    <Card.Img src={item.background_image} alt={item.name} className="grid-card-image album" />
    <Card.Body>
      <Card.Title className="grid-card-title" style={{ color: 'white' }}>{item.name}</Card.Title>
    </Card.Body>
  </>
);

/**
 *  Export the Search result to the search page template
 */
const GameSearch = () => (
  <SearchPage
    searchFunction={searchGames}
    renderCard={renderGameCard}
    placeholder="Game"
    extractId={(item) => item.id}
  />
);

export default GameSearch;


