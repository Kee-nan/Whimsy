

import React from 'react';
import SearchPage from '../templates/SearchPage';
import { Card } from 'react-bootstrap';

const searchMovies = async (key) => {
  try {
    const response = await fetch(`/api/search/movies?q=${encodeURIComponent(key)}`, {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();
    return { data: data.results || [] }; // Ensure data.results is always an array
  } catch (error) {
    console.error("Error fetching movies:", error);
    alert("Error fetching movies");
    return { data: [] }; // Return empty array if there's an error
  }
};


const renderMovieCard = (item) => (
  <>
    <Card.Img src={`https://image.tmdb.org/t/p/w500${item.poster_path}`} alt={item.title} />
    <Card.Body>
      <Card.Title>{item.title}</Card.Title>
    </Card.Body>
  </>
);

const MovieSearch = () => (
  <SearchPage
    searchFunction={searchMovies}
    renderCard={renderMovieCard}
    placeholder="Movie"
    extractId={(item) => item.id}
  />
);

export default MovieSearch;



