import SearchPage from '../templates/SearchPage';
import { Card } from 'react-bootstrap';
import { createSearchFunction } from '../../utils/mediaSearch';

const searchBooks = createSearchFunction('book');

const renderBookCard = (item) => (
  <>
    <Card.Img src={item.volumeInfo.imageLinks?.thumbnail || 'placeholder.jpg'} alt={item.volumeInfo.title} className="grid-card-image poster" />
    <Card.Body>
      <Card.Title className="grid-card-title" style={{ color: 'white' }}>{item.volumeInfo.title}</Card.Title>
    </Card.Body>
  </>
);

const BookSearch = () => (
  <SearchPage searchFunction={searchBooks} renderCard={renderBookCard} placeholder="Book" extractId={(item) => item.id} />
);
export default BookSearch;






