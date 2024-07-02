// src/pages/searchs/albums.js
import React, { useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import AppNavbar from '../../components/Navbar';
import SearchBar from '../../components/SearchBar';
import GridCard from '../../components/GridCard';
import { Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const Albums = () => {
  const [searchKey, setSearchKey] = useState("");
  const [albums, setAlbums] = useState([]);
  const navigate = useNavigate();

  // Function to search albums using the Spotify API
  const searchAlbums = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('spotifyToken');
      const { data } = await axios.get("https://api.spotify.com/v1/search", {
        headers: {
          Authorization: `Bearer ${token}`
        },
        params: {
          q: searchKey,
          type: "album"
        }
      });
      setAlbums(data.albums.items);
    } catch (error) {
      console.error("Error fetching albums:", error);
      setAlbums([]);
    }
  };

  // Function to clear the list of albums
  const clearAlbums = () => {
    setAlbums([]);
  };

  // Handle card click and navigate to album detail page
  const handleCardClick = (id) => {
    navigate(`/albums/${id}`);
  };

  // Render function for each album item
  const renderAlbumCard = (album) => (
    <>
      <Card.Img src={album.images[0]?.url || 'placeholder.jpg'} alt={album.name} />
      <Card.Body>
        <Card.Title>{album.name}</Card.Title>
        <Card.Text>{album.artists.map(artist => artist.name).join(', ')}</Card.Text>
      </Card.Body>
    </>
  );

  return (
    <>
      <AppNavbar />
      <SearchBar
        placeholder="Search for Albums..."
        searchFunction={searchAlbums}
        clearFunction={clearAlbums}
        searchKey={searchKey}
        setSearchKey={setSearchKey}
      />
      <GridCard
        items={albums}
        renderItem={renderAlbumCard}
        onCardClick={handleCardClick} // Pass handleCardClick function
      />
    </>
  );
};

export default Albums;


