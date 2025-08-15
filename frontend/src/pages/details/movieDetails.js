
// src/pages/details/MovieDetail.js
import React from 'react';
import DetailPage from '../templates/DetailPage';
import axios from 'axios';

// Function to fetch movie details (no token needed)
const fetchMovieDetails = async (id) => {
  const response = await axios.get(`/api/search/movies/${id}`);
  return response
};

// Function to extract movie details
const extractMovieDetails = (data) => {
  if (!data) return null; // ⬅ guard

  return {
    image: `https://image.tmdb.org/t/p/w500${data.poster_path}`,
    title: data.title,
    details: [
      <p key="release"><strong>Release Date:</strong> {data.release_date}</p>,
      <p key="genres"><strong>Genres:</strong> {data.genres?.map(genre => genre.name).join(', ')}</p>,
    ],
    summary: data.overview
  };
};

const MovieDetail = () => {
  return (
    <DetailPage
      fetchDetails={fetchMovieDetails}
      extractDetails={extractMovieDetails}
      mediaType="movie"
      tokenRequired={false} // No token required for movies
    />
  );
};

export default MovieDetail;






