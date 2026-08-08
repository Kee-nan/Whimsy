// frontend/src/pages/details/movieDetails.js
import DetailPage from '../templates/DetailPage';
import { createFetchDetails } from '../../utils/mediaSearch';

const fetchMovieDetails = createFetchDetails('movie');

const extractMovieDetails = (data) => {
  if (!data) return null;
  return {
    image: `https://image.tmdb.org/t/p/w500${data.poster_path}`,
    title: data.title,
    details: [
      <p key="release"><strong>Release Date:</strong> {data.release_date}</p>,
      <p key="genres"><strong>Genres:</strong> {data.genres?.map(g => g.name).join(', ')}</p>,
    ],
    summary: data.overview,
  };
};

const MovieDetail = () => (
  <DetailPage fetchDetails={fetchMovieDetails} extractDetails={extractMovieDetails} mediaType="movie" tokenRequired={false} />
);
export default MovieDetail;






