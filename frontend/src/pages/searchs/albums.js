// albums.js
import axios from 'axios';
import SearchPage from '../templates/SearchPage';
import { Card } from 'react-bootstrap';


/**
 * Search for Albums with backend call
 */
const searchAlbums = async (key, page = 1, limit = 15) => {
  try {
    const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/search/albums`, {
      params: { q: key, page, limit },
    });

    const total = response.data.total || 0;
    const totalPages = Math.ceil(total / limit);

    return {
      data: response.data.results || [],
      pagination: {
        current_page: response.data.page || 1,
        last_visible_page: totalPages || 1,
        items: {
          count: total,
          per_page: limit,
        },
        has_next_page: !!response.data.next,
      },
    };
  } catch (error) {
    console.error("Error fetching Albums:", error);
    alert("Error fetching Albums");
    return { data: [], pagination: {} };
  }
};


/**
 * Render Album card 
 */
const renderAlbumCard = (album) => (
  <>
    <Card.Img src={album.images[0]?.url || 'placeholder.jpg'} alt={album.name} className="grid-card-image album"/>
    <Card.Body>
      <Card.Title  className="grid-card-title" style={{ color: 'white' }}>{album.name}</Card.Title>
      <Card.Text className="grid-card-creator" style={{ color: 'white' }}>{album.artists.map(artist => artist.name).join(', ')}</Card.Text>
    </Card.Body>
  </>
);

/**
 *  Export the Search result to the search page template
 */
const Albums = () => (
  <SearchPage
    searchFunction={searchAlbums}
    renderCard={renderAlbumCard}
    placeholder="Album"
    requiresToken={true}
    extractId={(item) => item.id}
  />
);

export default Albums;





