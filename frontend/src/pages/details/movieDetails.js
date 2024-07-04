// src/pages/details/MovieDetail.js
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import AppNavbar from '../../components/Navbar';
import DetailCard from '../../components/DetailCard';


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

  const addToList = (listName) => {
    const list = JSON.parse(localStorage.getItem(listName)) || [];
    const movieItem = {
      url: `movies/${id}`,
      title: movie.title,
      image: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
    };
    localStorage.setItem(listName, JSON.stringify([...list, movieItem]));
  };

  
  const addToCompleted = () => addToList('completedList');
  const addToFutures = () => addToList('futuresList');
  const review = () => {
    // Review functionality will be added later
    alert('Review functionality not yet implemented');
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
        onAddToCompleted={addToCompleted}
        onAddToFutures={addToFutures}
        onReview={review}
      />
    </>
  );
};

export default MovieDetail;




