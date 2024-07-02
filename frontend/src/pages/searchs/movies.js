import React, { useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';
import AppNavbar from '../../components/Navbar';
import SearchBar from '../../components/SearchBar';
import GridCard from '../../components/GridCard';
import { Card } from 'react-bootstrap';

const Movies = () => {
  const [searchKey, setSearchKey] = useState("");
  const [movies, setMovies] = useState([]);
  const navigate = useNavigate();

  const searchMovies = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.get('/api/movies/search', {
        params: { q: searchKey }
      });
      setMovies(response.data.results || []);
    } catch (error) {
      console.error("Error fetching movies:", error);
      setMovies([]);
    }
  };

  const clearMovies = () => {
    setMovies([]);
  };

  const handleCardClick = (id) => {
    navigate(`/movies/${id}`);
  };

  const renderMovieCard = (movie) => (
    <>
      <Card.Img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={movie.title} />
      <Card.Body>
        <Card.Title>{movie.title}</Card.Title>
      </Card.Body>
    </>
  );

  return (
    <>
      <AppNavbar />
      <SearchBar
        placeholder="Search for Movies..."
        searchFunction={searchMovies}
        clearFunction={clearMovies}
        searchKey={searchKey}
        setSearchKey={setSearchKey}
      />
      <GridCard
        items={movies}
        renderItem={renderMovieCard}
        onCardClick={handleCardClick}
      />
    </>
  );
};

export default Movies;


