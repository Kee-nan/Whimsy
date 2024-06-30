import React, { useState } from 'react'; 
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import AppNavbar from '../components/Navbar';
import SearchBar from '../components/SearchBar';
import GridCard from '../components/GridCard';
import { Card } from 'react-bootstrap';

const Shows = () => {
  const [searchKey, setSearchKey] = useState("");
  const [shows, setShows] = useState([]);

  const searchShows = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.get('https://api.tvmaze.com/search/shows', {
        params: { q: searchKey }
      });
      setShows(response.data || []);
    } catch (error) {
      console.error("Error fetching shows:", error);
      setShows([]);
    }
  };

  const clearShows = () => {
    setShows([]);
  };

  const renderShowCard = (item) => (
    <>
      <Card.Img src={item.show.image ? item.show.image.medium : 'https://via.placeholder.com/210x295'} alt={item.show.name} />
      <Card.Body>
        <Card.Title>{item.show.name}</Card.Title>
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
        items={shows}
        renderItem={renderShowCard}
      />
    </>
  );
};

export default Shows;

