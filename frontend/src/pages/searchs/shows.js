
import React from 'react';
import axios from 'axios';
import SearchPage from '../templates/SearchPage';
import { Card } from 'react-bootstrap';

const searchShows = async (key) => {
  try {
    const response = await axios.get('https://api.tvmaze.com/search/shows', {
      params: { q: key }
    });
    return { data: response.data.map(item => item.show) };
  } catch (error) {
    console.error("Error fetching Shows:", error);
    alert("Error fetching Shows");
    return [];
  }
};

const renderShowCard = (item) => (
  <>
    <Card.Img src={item.image?.medium || 'placeholder.jpg'} alt={item.name} className="grid-card-image poster"/>
    <Card.Body>
      <Card.Title className="grid-card-title">{item.name}</Card.Title>
    </Card.Body>
  </>
);

const ShowsSearch = () => (
  <SearchPage
    searchFunction={searchShows}
    renderCard={renderShowCard}
    placeholder="Show"
    extractId={(item) => item.id}
  />
);

export default ShowsSearch;




