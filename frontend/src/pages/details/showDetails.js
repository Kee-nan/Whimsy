// frontend/src/pages/details/showDetails.js
import DetailPage from '../templates/DetailPage';
import { createFetchDetails } from '../../utils/mediaSearch';

const fetchShowDetails = createFetchDetails('show');

const extractShowDetails = (data) => {
  const show = data;
  const stripHtmlTags = (html) => {
    const div = document.createElement('div');
    div.innerHTML = html;
    return div.innerText;
  };
  return {
    image: show.image?.original || 'placeholder.jpg',
    title: show.name,
    details: [
      <p><strong>Language:</strong> {show.language}</p>,
      <p><strong>Status:</strong> {show.status}</p>,
      <p><strong>Genres:</strong> {show.genres.join(', ')}</p>,
      <p><strong>Premiered on:</strong> {show.premiered} and <strong>ended on</strong> {show.ended}</p>,
    ],
    summary: stripHtmlTags(show.summary),
  };
};

const ShowDetail = () => (
  <DetailPage fetchDetails={fetchShowDetails} extractDetails={extractShowDetails} mediaType="show" tokenRequired={false} />
);
export default ShowDetail;











