import SearchPage from '../templates/SearchPage';
import { Card } from 'react-bootstrap';
import { createSearchFunction } from '../../utils/mediaSearch';

const searchGames = createSearchFunction('game');

const renderGameCard = (item) => (
  <>
    <Card.Img src={item.background_image} alt={item.name} className="grid-card-image album" />
    <Card.Body>
      <Card.Title className="grid-card-title" style={{ color: 'white' }}>{item.name}</Card.Title>
    </Card.Body>
  </>
);

const GameSearch = () => (
  <SearchPage searchFunction={searchGames} renderCard={renderGameCard} placeholder="Game" extractId={(item) => item.id} />
);
export default GameSearch;


