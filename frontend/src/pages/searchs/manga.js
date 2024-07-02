// src/pages/searchs/manga.js
import React, { useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';
import AppNavbar from '../../components/Navbar';
import SearchBar from '../../components/SearchBar';
import GridCard from '../../components/GridCard';
import { Card } from 'react-bootstrap';

const Manga = () => {
  const [searchKey, setSearchKey] = useState("");
  const [manga, setManga] = useState([]);
  const navigate = useNavigate();

  // Function to search Manga using the Jikan API
  const searchManga = async (e) => {
    e.preventDefault(); // Prevent the default form submission behavior
    try {
      const response = await axios.get('https://api.jikan.moe/v4/manga', {
        params: { q: searchKey, sfw: true } // Use the search key as a query parameter
      });
      const responseJson = response.data;

      if (responseJson.data) {
        setManga(responseJson.data); // Update the state with the search results
      } else {
        setManga([]); // Clear the Manga if no results are found
      }
    } catch (error) {
      console.error("Error fetching Manga:", error);
      setManga([]); // Clear the Manga in case of an error
    }
  };

  // Function to clear the list of manga
  const clearManga = () => {
    setManga([]);
  };

  const handleCardClick = (id) => {
    navigate(`/manga/${id}`);
  };

  // Render function for each manga item
  const renderMangaCard = (item) => (
    <>
      <Card.Img src={item.images.jpg.image_url} alt={item.title} />
      <Card.Body>
        <Card.Title>{item.title}</Card.Title>
      </Card.Body>
    </>
  );

  return (
    <>
      <AppNavbar />
      <SearchBar
        placeholder="Search for Manga..."
        searchFunction={searchManga}
        clearFunction={clearManga}
        searchKey={searchKey}
        setSearchKey={setSearchKey}
      />
      <GridCard
        items={manga.map(m => ({ ...m, id: m.mal_id }))}
        renderItem={renderMangaCard}
        onCardClick={handleCardClick} // Pass handleCardClick function
      />
    </>
  );
};

export default Manga;
