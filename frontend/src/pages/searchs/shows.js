// src/pages/searchs/shows.js
import React, { useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';
import AppNavbar from '../../components/Navbar';
import SearchBar from '../../components/SearchBar';
import GridCard from '../../components/GridCard';
import { Card } from 'react-bootstrap';

const Shows = () => {
  const [searchKey, setSearchKey] = useState("");
  const [shows, setShows] = useState([]);
  const navigate = useNavigate();

  // Function to search TV shows using the TVMaze API
  const searchShows = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.get(`https://api.tvmaze.com/search/shows?q=${searchKey}`);
      setShows(response.data.map(item => item.show)); // TVMaze API response structure
    } catch (error) {
      console.error("Error fetching Shows:", error);
      setShows([]);
    }
  };

  // Function to clear the list of shows
  const clearShows = () => {
    setShows([]);
  };

  // Handle card click and navigate to show detail page
  const handleCardClick = (id) => {
    navigate(`/shows/${id}`);
  };

  // Render function for each show item
  const renderShowCard = (item) => (
    <>
      <Card.Img src={item.image?.medium || 'placeholder.jpg'} alt={item.name} />
      <Card.Body>
        <Card.Title>{item.name}</Card.Title>
      </Card.Body>
    </>
  );

  return (
    <>
      <AppNavbar />
      <SearchBar
        placeholder="Search for Shows..."
        searchFunction={searchShows}
        clearFunction={clearShows}
        searchKey={searchKey}
        setSearchKey={setSearchKey}
      />
      <GridCard
        items={shows.map(show => ({ ...show, id: show.id }))}
        renderItem={renderShowCard}
        onCardClick={handleCardClick} // Pass handleCardClick function
      />
    </>
  );
};

export default Shows;

