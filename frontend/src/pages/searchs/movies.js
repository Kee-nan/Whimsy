// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import { useNavigate, useLocation } from 'react-router-dom';
// import AppNavbar from '../../components/Navbar';
// import SearchBar from '../../components/SearchBar';
// import GridCard from '../../components/GridCard';
// import { Card } from 'react-bootstrap';

// const Movies = () => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const [searchKey, setSearchKey] = useState(location.state?.searchKey || "");
//   const [movies, setMovies] = useState(location.state?.searchResults || []);

//   useEffect(() => {
//     if (location.state?.searchKey) {
//       searchMovies(location.state.searchKey);
//     }
//   }, [location.state]);

//   const searchMovies = async (key) => {
//     try {
//       const response = await axios.get('/api/movies/search', {
//         params: { q: key }
//       });
//       setMovies(response.data.results || []);
//     } catch (error) {
//       console.error("Error fetching movies:", error);
//       setMovies([]);
//     }
//   };

//   const handleSearch = (e) => {
//     e.preventDefault();
//     searchMovies(searchKey);
//   };

//   const clearMovies = () => {
//     setMovies([]);
//   };

//   const handleCardClick = (id) => {
//     navigate(`/movie/${id}`, {
//       state: {
//         searchKey,
//         searchResults: movies
//       }
//     });
//   };

//   const renderMovieCard = (movie) => (
//     <>
//       <Card.Img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={movie.title} />
//       <Card.Body>
//         <Card.Title>{movie.title}</Card.Title>
//       </Card.Body>
//     </>
//   );

//   return (
//     <>
//       <AppNavbar />
//       <SearchBar
//         placeholder="Search for Movies..."
//         searchFunction={handleSearch}
//         clearFunction={clearMovies}
//         searchKey={searchKey}
//         setSearchKey={setSearchKey}
//       />
//       <GridCard
//         items={movies}
//         renderItem={renderMovieCard}
//         onCardClick={handleCardClick}
//       />
//     </>
//   );
// };

// export default Movies;


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



