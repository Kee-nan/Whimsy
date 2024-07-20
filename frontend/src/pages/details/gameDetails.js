// src/pages/details/GameDetail.js
import React from 'react';
import DetailPage from '../templates/DetailPage';
import axios from 'axios';

// Function to fetch game details (no token needed)
const fetchGameDetails = async (id) => {
  return await axios.get(`https://api.rawg.io/api/games/${id}`, {
    params: { key: 'c9ab999c9033481ebbcf7903a8293428' }
  });
};

// Function to extract game details
const extractGameDetails = (data) => {
  const game = data;
  return {
    image: game.background_image, // Adjust if the image key is different
    title: game.name, // Ensure title is included
    details: (
      <>
        <p><strong>Release Date:</strong> {game.released}</p>
        <p><strong>Genres:</strong> {game.genres?.map(genre => genre.name).join(', ')}</p>
        <p><strong>Overview:</strong> {game.description_raw}</p>
        <p><strong>Website:</strong> {game.website}</p>
        <p><strong>Playtime:</strong> {game.playtime} hours</p>
      </>
    )
  };
};

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
