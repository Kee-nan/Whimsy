// src/pages/searchs/shows.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate, useLocation } from 'react-router-dom';
import AppNavbar from '../../components/Navbar';
import SearchBar from '../../components/SearchBar';
import GridCard from '../../components/GridCard';
import { Card } from 'react-bootstrap';

const Shows = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchKey, setSearchKey] = useState(location.state?.searchKey || "");
  const [shows, setShows] = useState(location.state?.searchResults || []);

  useEffect(() => {
    if (location.state?.searchKey) {
      searchShows(location.state.searchKey);
    }
  }, [location.state]);

  const searchShows = async (key) => {
    try {
      const response = await axios.get(`https://api.tvmaze.com/search/shows`, {
        params: { q: key }
      });
      setShows(response.data.map(item => item.show) || []);
    } catch (error) {
      console.error("Error fetching Shows:", error);
      setShows([]);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    searchShows(searchKey);
  };

  const clearShows = () => {
    setShows([]);
  };

  const handleCardClick = (id) => {
    const currentState = {
      searchKey,
      searchResults: shows
    };
    navigate(`/show/${id}`, { state: currentState });
  };

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
        searchFunction={handleSearch}
        clearFunction={clearShows}
        searchKey={searchKey}
        setSearchKey={setSearchKey}
      />
      <GridCard
        items={shows.map(show => ({ ...show, id: show.id }))}
        renderItem={renderShowCard}
        onCardClick={handleCardClick}
      />
    </>
  );
};

export default Shows;




