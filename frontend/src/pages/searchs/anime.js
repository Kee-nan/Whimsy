import SearchPage from '../templates/SearchPage';
import { Card } from 'react-bootstrap';
import { createSearchFunction } from '../../utils/mediaSearch';

const searchAnime = createSearchFunction('anime');

const renderAnimeCard = (item) => (
  <>
    <Card.Img src={item.images.jpg.image_url} alt={item.title} className="grid-card-image poster" />
    <Card.Body>
      <Card.Title className="grid-card-title" style={{ color: 'white' }}>{item.title}</Card.Title>
    </Card.Body>
  </>
);

const AnimeSearch = () => (
  <SearchPage searchFunction={searchAnime} renderCard={renderAnimeCard} placeholder="Anime" extractId={(item) => item.mal_id} />
);
export default AnimeSearch;

