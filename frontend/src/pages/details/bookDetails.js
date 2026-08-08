// frontend/src/pages/details/bookDetails.js
import DetailPage from '../templates/DetailPage';
import { createFetchDetails } from '../../utils/mediaSearch';

const fetchBookDetails = createFetchDetails('book');

const stripHtmlTags = (html) => {
  const div = document.createElement('div');
  div.innerHTML = html;
  return div.innerText;
};

const extractBookDetails = (data) => {
  const book = data.volumeInfo;
  return {
    image: book.imageLinks?.thumbnail || 'placeholder.jpg',
    title: book.title,
    details: [
      <p><strong>Author(s):</strong> {book.authors ? book.authors.join(', ') : 'Unknown Author'}</p>,
      <p><strong>Published on:</strong> {book.publishedDate} by {book.publisher}</p>,
      <p><strong>Page Count:</strong> {book.pageCount}</p>,
      <p><strong>Categories:</strong> {book.categories ? book.categories.join(', ') : 'None'}</p>,
    ],
    summary: stripHtmlTags(book.description),
  };
};

const BookDetail = () => (
  <DetailPage fetchDetails={fetchBookDetails} extractDetails={extractBookDetails} mediaType="book" tokenRequired={false} />
);
export default BookDetail;

