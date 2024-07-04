// src/pages/details/MovieDetail.js
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import AppNavbar from '../../components/Navbar';
import DetailCard from '../../components/DetailCard';
import { Button } from 'react-bootstrap';

const MovieDetail = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        const response = await axios.get(`/api/movies/${id}`);
        setMovie(response.data);
      } catch (error) {
        console.error("Error fetching movie details:", error);
      }
    };

    fetchMovieDetails();
  }, [id]);

  const addToWatchlist = () => {
    const watchlist = JSON.parse(localStorage.getItem('watchlist')) || [];
    const movieItem = {
      url: `movies/${id}`,
      title: movie.title,
      image: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
    };
    localStorage.setItem('watchlist', JSON.stringify([...watchlist, movieItem]));
  };

  if (!movie) return <p>Loading...</p>;

  return (
    <>
      <AppNavbar />
      <DetailCard
        image={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
        title={movie.title}
        details={
          <>
            <p><strong>Budget:</strong> ${movie.budget.toLocaleString()}</p>
            <p><strong>Genres:</strong> {movie.genres.map(genre => genre.name).join(', ')}</p>
            <p><strong>Runtime:</strong> {movie.runtime} minutes</p>
            <p><strong>Overview:</strong> {movie.overview}</p>
          </>
        }
        buttons={<Button variant="success" onClick={addToWatchlist}>Add to Watchlist</Button>}
      />
    </>
  );
};

export default MovieDetail;



