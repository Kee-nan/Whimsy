import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate, useLocation } from 'react-router-dom';
import AppNavbar from '../../components/Navbar';
import SearchBar from '../../components/SearchBar';
import GridCard from '../../components/GridCard';
import { Card } from 'react-bootstrap';

const Manga = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchKey, setSearchKey] = useState(location.state?.searchKey || "");
  const [manga, setManga] = useState(location.state?.searchResults || []);

  useEffect(() => {
    if (location.state?.searchKey) {
      searchManga(location.state.searchKey);
    }
  }, [location.state]);

  const searchManga = async (key) => {
    try {
      const response = await axios.get('https://api.jikan.moe/v4/manga', {
        params: { q: key, sfw: true }
      });
      setManga(response.data.data || []);
    } catch (error) {
      console.error("Error fetching Manga:", error);
      setManga([]);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    searchManga(searchKey);
  };

  const clearManga = () => {
    setManga([]);
  };

  const handleCardClick = (id) => {
    const currentState = {
      searchKey,
      searchResults: manga
    };
    navigate(`/manga/${id}`, { state: currentState });
  };

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
        searchFunction={handleSearch}
        clearFunction={clearManga}
        searchKey={searchKey}
        setSearchKey={setSearchKey}
      />
      <GridCard
        items={manga.map(m => ({ ...m, id: m.mal_id }))}
        renderItem={renderMangaCard}
        onCardClick={handleCardClick}
      />
    </>
  );
};

export default Manga;


