// albums.js
import axios from 'axios';
import SearchPage from '../templates/SearchPage';
import { Card } from 'react-bootstrap';

/**
 *  Search for Album with backend call
 */
const searchAlbums = async (key) => {
  const response = await axios.get(`/api/search/albums`, {
    params: { q: key }
  });
  return { data: response.data };
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





