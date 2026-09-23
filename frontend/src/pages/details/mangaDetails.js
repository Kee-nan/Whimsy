// frontend/src/pages/details/mangaDetails.js
import DetailPage from '../templates/DetailPage';
import { createFetchDetails } from '../../utils/mediaSearch';

const fetchMangaDetails = createFetchDetails('manga');

const extractMangaDetails = (data) => {
  const manga = data.data;
  return {
    image: manga.images.jpg.image_url || 'placeholder.jpg',
    title: manga.title,
    details: [
      <p><strong>Author:</strong> {manga.authors[0]?.name}</p>,
      <p><strong>Demographic:</strong> {manga.demographics[0]?.name}</p>,
      <p><strong>Status:</strong> {manga.status}</p>,
      <p><strong>Genres/Themes:</strong> {manga.genres?.map(g => g.name).join(', ')} {manga.themes?.map(t => t.name).join(', ')}</p>,
    ],
    summary: <p>{manga.background} {manga.synopsis}</p>,
  };
};

const MangaDetail = () => (
  <DetailPage fetchDetails={fetchMangaDetails} extractDetails={extractMangaDetails} mediaType="manga" tokenRequired={false} />
);
export default MangaDetail;


