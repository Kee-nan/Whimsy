// frontend/src/pages/details/gameDetails.js
import DetailPage from '../templates/DetailPage';
import { createFetchDetails } from '../../utils/mediaSearch';

const fetchGameDetails = createFetchDetails('game');

const extractGameDetails = (game) => ({
  image: game.background_image,
  title: game.name,
  details: [
    <p><strong>Release Date:</strong> {game.released}</p>,
    <p><strong>Genres:</strong> {game.genres?.map(g => g.name).join(', ')}</p>,
    <p><strong>Website:</strong> {game.website}</p>,
    <p><strong>Playtime:</strong> {game.playtime} hours</p>,
  ],
  summary: game.description_raw,
});

const GameDetail = () => (
  <DetailPage fetchDetails={fetchGameDetails} extractDetails={extractGameDetails} mediaType="game" tokenRequired={false} />
);
export default GameDetail;
