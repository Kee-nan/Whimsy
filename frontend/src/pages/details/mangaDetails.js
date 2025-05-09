

// src/pages/searchs/MangaDetail.js
import React from 'react';
import axios from 'axios';
import DetailPage from '../templates/DetailPage';

const fetchMangaDetails = async (id) => {
  return await axios.get(`https://api.jikan.moe/v4/manga/${id}/full`);
};

const extractMangaDetails = (data) => {
  const manga = data.data;
  return {
    image: manga.images.jpg.image_url || 'placeholder.jpg',
    title: manga.title, // Ensure title is included
    details: [
        <p><strong>Author:</strong> {manga.authors[0].name}</p>,
        <p><strong>Demographic:</strong> {manga.demographics[0].name}</p>,
        <p><strong>Status:</strong> {manga.status}</p>,
        <p><strong>Genres/Themes:</strong> {manga.genres?.map(genre => genre.name).join(', ')} {manga.themes?.map(theme => theme.name).join(', ')} </p>,
    ],
    summary: <p>{manga.background}  {manga.synopsis}</p>
  };
};

const MangaDetail = () => {
  return (
    <DetailPage
      fetchDetails={fetchMangaDetails}
      extractDetails={extractMangaDetails} // Corrected prop name
      mediaType="manga"
      tokenRequired={false} // No token required
    />
  );
};

export default MangaDetail;




