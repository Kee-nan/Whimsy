import SearchPage from '../templates/SearchPage';
import { Card } from 'react-bootstrap';
import { createSearchFunction } from '../../utils/mediaSearch';

const searchShows = createSearchFunction('show');

const renderShowCard = (item) => (
  <>
    <Card.Img src={item.image?.medium || 'placeholder.jpg'} alt={item.name} className="grid-card-image poster" />
    <Card.Body>
      <Card.Title className="grid-card-title" style={{ color: 'white' }}>{item.name}</Card.Title>
    </Card.Body>
  </>
);

const ShowsSearch = () => (
  <SearchPage searchFunction={searchShows} renderCard={renderShowCard} placeholder="Show" extractId={(item) => item.id} />
);
export default ShowsSearch;


