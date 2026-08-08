// frontend/src/pages/details/animeDetails.js
import DetailPage from '../templates/DetailPage';
import { createFetchDetails } from '../../utils/mediaSearch';

const fetchAnimeDetails = createFetchDetails('anime');

const extractAnimeDetails = (data) => {
  const anime = data.data;
  return {
    image: anime.images.jpg.image_url || 'placeholder.jpg',
    title: anime.title,
    details: [
      <p><strong>Episodes:</strong> {anime.episodes}</p>,
      <p><strong>Status:</strong> {anime.status}</p>,
      <p><strong>Released in:</strong> {anime.year}</p>,
      <p><strong>Genres/Themes:</strong> {anime.genres?.map(g => g.name).join(', ')} {anime.themes?.map(t => t.name).join(', ')}</p>,
    ],
    summary: <p>{anime.background} {anime.synopsis}</p>,
  };
};

const AnimeDetail = () => (
  <DetailPage fetchDetails={fetchAnimeDetails} extractDetails={extractAnimeDetails} mediaType="anime" tokenRequired={false} />
);
export default AnimeDetail;
