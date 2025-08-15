
// src/pages/search/Manga.js
import axios from 'axios';
import SearchPage from '../templates/SearchPage';
import { Card } from 'react-bootstrap';

/**
 *  Search for Manga with backend call
 */
const searchManga = async (key) => {
  try {
    const response = await axios.get('https://api.jikan.moe/v4/manga', {
      params: { q: key, sfw: true }
    });
    return { data: response.data.data || [] }; // Ensure data is always an array
  } catch (error) {
    console.error("Error fetching Manga:", error);
    alert("Error fetching Manga");
    return [];
  }
};

/**
 * Render Manga card 
 */
const renderMangaCard = (item) => (
  <>
    <Card.Img src={item.images.jpg.image_url} alt={item.title} className="grid-card-image poster"/>
    <Card.Body>
      <Card.Title className="grid-card-title" style={{ color: 'white' }}>{item.title}</Card.Title>
    </Card.Body>
  </>
);

/**
 *  Export the Search result to the search page template
 */
const MangaSearch = () => (
  <SearchPage
    searchFunction={searchManga}
    renderCard={renderMangaCard}
    placeholder="Manga"
    extractId={(item) => item.mal_id}
  />
);

export default MangaSearch;



