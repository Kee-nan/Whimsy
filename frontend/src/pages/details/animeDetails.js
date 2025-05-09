
// src/pages/searchs/AnimeDetail.js
import React from 'react';
import axios from 'axios';
import DetailPage from '../templates/DetailPage';

const fetchAnimeDetails = async (id) => {
  return await axios.get(`https://api.jikan.moe/v4/anime/${id}/full`);
};

const extractAnimeDetails = (data) => {
  const anime = data.data;
  return {
    image: anime.images.jpg.image_url || 'placeholder.jpg',
    title: anime.title, // Ensure title is included
    details: [
      <p><strong>Episodes:</strong> {anime.episodes}</p>,
      <p><strong>Status:</strong> {anime.status}</p>,
      <p><strong>Released in:</strong> {anime.year}</p>,
      <p><strong>Genres/Themes:</strong> {anime.genres?.map(genre => genre.name).join(', ')} {anime.themes?.map(theme => theme.name).join(', ')} </p>,
    ],
    summary: <p> {anime.background}  {anime.synopsis} </p>
  };
};

const AnimeDetail = () => {
  return (
    <DetailPage
      fetchDetails={fetchAnimeDetails}
      extractDetails={extractAnimeDetails} // Corrected prop name
      mediaType="anime"
      tokenRequired={false} // No token required
    />
  );
};

export default AnimeDetail;
