import axios from 'axios';
import SearchPage from '../templates/SearchPage';
import { Card } from 'react-bootstrap';


/**
 *  Search for Anime with backend call
 */
const searchAnime = async (key) => {
  try {
    const response = await axios.get('https://api.jikan.moe/v4/anime', {
      params: { q: key, sfw: true }
    });
    // Ensure that the data array is extracted properly
    return { data:response.data.data || [] };
  } catch (error) {
    console.error("Error fetching Anime:", error);
    alert("Error fetching Anime")
    return [];
  }
};

/**
 * Render Anime card 
 */
const renderAnimeCard = (item) => (
  <>
    <Card.Img src={item.images.jpg.image_url} alt={item.title} className="grid-card-image poster" />
    <Card.Body>
      <Card.Title className="grid-card-title" style={{ color: 'white' }}>{item.title}</Card.Title>
    </Card.Body>
  </>
);

/**
 *  Export the Search result to the search page template
 */
const AnimeSearch = () => (
  <SearchPage
    searchFunction={searchAnime}
    renderCard={renderAnimeCard}
    placeholder="Anime"
    extractId={(item) => item.mal_id}
  />
);

export default AnimeSearch;

