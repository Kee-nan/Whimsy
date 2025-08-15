
import axios from 'axios';
import SearchPage from '../templates/SearchPage';
import { Card } from 'react-bootstrap';

/**
 *  Search for Games with backend call
 */
const searchGames = async (key) => {
  try {
    const response = await axios.get(`/api/search/games?q=${encodeURIComponent(key)}`);
    return { data: response.data.results || [] }; // Ensure data.results is always an array
  } catch (error) {
    console.error("Error fetching games:", error);
    alert("Error fetching games");
    return { data: [] }; // Return empty array if there's an error
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


