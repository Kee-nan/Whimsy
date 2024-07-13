
// src/pages/details/MovieDetail.js
import React from 'react';
import DetailPage from '../templates/DetailPage';
import axios from 'axios';




// Function to fetch movie details (no token needed)
const fetchMovieDetails = async (id) => {
  return await axios.get(`https://api.themoviedb.org/3/movie/${id}`, {
    params: { api_key: '670e04ce75f540ad139cadd217bad472' }
  });
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






