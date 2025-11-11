// src/pages/details/GameDetail.js
import DetailPage from '../templates/DetailPage';
import axios from 'axios';

/**
 *  Search for Album with backend call
 */
const fetchGameDetails = async (id) => {
  const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/search/games/${id}`);
  return response
};

/**
 *  Extract the specific details for the media
 */
const extractGameDetails = (data) => {
  const game = data;
  return {
    image: game.background_image, // Adjust if the image key is different
    title: game.name, // Ensure title is included
    details: [
        <p><strong>Release Date:</strong> {game.released}</p>,
        <p><strong>Genres:</strong> {game.genres?.map(genre => genre.name).join(', ')}</p>,
        <p><strong>Website:</strong> {game.website}</p>,
        <p><strong>Playtime:</strong> {game.playtime} hours</p>,
    ], 
    summary: game.description_raw
  };
};

/**
 *  Put out the data to then detail page
 */
const GameDetail = () => {
  return (
    <DetailPage
      fetchDetails={fetchGameDetails}
      extractDetails={extractGameDetails}
      mediaType="game"
      tokenRequired={false} // No token required for games
    />
  );
};

export default GameDetail;
