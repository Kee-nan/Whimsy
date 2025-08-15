
import axios from 'axios';
import SearchPage from '../templates/SearchPage';
import { Card } from 'react-bootstrap';


/**
 *  Search for shows with backend call
 */
const searchShows = async (key) => {
  try {
    const response = await axios.get('https://api.tvmaze.com/search/shows', {
      params: { q: key }
    });
    return { data: response.data.map(item => item.show) };
  } catch (error) {
    console.error("Error fetching Shows:", error);
    alert("Error fetching Shows");
    return [];
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




