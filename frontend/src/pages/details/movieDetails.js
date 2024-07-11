
// src/pages/details/MovieDetail.js
import React from 'react';
import axios from 'axios';
import DetailPage from '../templates/DetailPage';

// Function to fetch movie details (no token needed)
const fetchMovieDetails = async (id) => {
  return await axios.get(`/api/movies/${id}`);
};

// Function to extract movie details
const extractMovieDetails = (data) => {
  const movie = data;
  return {
    image: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
    title: movie.title, // Ensure title is included
    details: (
      <>
        <p><strong>Release Date:</strong> {movie.release_date}</p>
        <p><strong>Genres:</strong> {movie.genres?.map(genre => genre.name).join(', ')}</p>
        <p><strong>Overview:</strong> {movie.overview}</p>
      </>
    )
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






