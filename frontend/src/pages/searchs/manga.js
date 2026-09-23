import SearchPage from '../templates/SearchPage';
import { Card } from 'react-bootstrap';
import { createSearchFunction } from '../../utils/mediaSearch';

const searchManga = createSearchFunction('manga');

const renderMangaCard = (item) => (
  <>
    <Card.Img src={item.images.jpg.image_url} alt={item.title} className="grid-card-image poster" />
    <Card.Body>
      <Card.Title className="grid-card-title" style={{ color: 'white' }}>{item.title}</Card.Title>
    </Card.Body>
  </>
);

const MangaSearch = () => (
  <SearchPage searchFunction={searchManga} renderCard={renderMangaCard} placeholder="Manga" extractId={(item) => item.mal_id} />
);
export default MangaSearch;



