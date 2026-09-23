import SearchPage from '../templates/SearchPage';
import { Card } from 'react-bootstrap';
import { createSearchFunction } from '../../utils/mediaSearch';

const searchAlbums = createSearchFunction('album');

const renderAlbumCard = (album) => (
  <>
    <Card.Img src={album.images?.[0]?.url || 'placeholder.jpg'} alt={album.name} className="grid-card-image album" />
    <Card.Body>
      <Card.Title className="grid-card-title" style={{ color: 'white' }}>{album.name}</Card.Title>
      <Card.Text className="grid-card-creator" style={{ color: 'white' }}>{album.artists.map(a => a.name).join(', ')}</Card.Text>
    </Card.Body>
  </>
);

const Albums = () => (
  <SearchPage searchFunction={searchAlbums} renderCard={renderAlbumCard} placeholder="Album" extractId={(item) => item.id} />
);
export default Albums;




