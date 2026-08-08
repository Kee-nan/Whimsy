import SearchPage from '../templates/SearchPage';
import { Card } from 'react-bootstrap';
import { createSearchFunction } from '../../utils/mediaSearch';

const searchMovies = createSearchFunction('movie');

const renderMovieCard = (item) => (
  <>
    <Card.Img src={`https://image.tmdb.org/t/p/w500${item.poster_path}`} alt={item.title} className="grid-card-image poster" />
    <Card.Body>
      <Card.Title className="grid-card-title" style={{ color: 'white' }}>{item.title}</Card.Title>
    </Card.Body>
  </>
);

const MovieSearch = () => (
  <SearchPage searchFunction={searchMovies} renderCard={renderMovieCard} placeholder="Movie" extractId={(item) => item.id} />
);
export default MovieSearch;


