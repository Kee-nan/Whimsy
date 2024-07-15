
import React from 'react';
import axios from 'axios';
import SearchPage from '../templates/SearchPage';
import { Card } from 'react-bootstrap';

const searchAnime = async (key) => {
  try {
    const response = await axios.get('https://api.jikan.moe/v4/anime', {
      params: { q: key, sfw: true }
    });
    // Ensure that the data array is extracted properly
    return { data:response.data.data || [] };
  } catch (error) {
    console.error("Error fetching Anime:", error);
    alert("Error fetching Anime")
    return [];
  }
};

const renderAnimeCard = (item) => (
  <>
    <Card.Img src={item.images.jpg.image_url} alt={item.title} />
    <Card.Body>
      <Card.Title>{item.title}</Card.Title>
    </Card.Body>
  </>
);

const AnimeSearch = () => (
  <SearchPage
    searchFunction={searchAnime}
    renderCard={renderAnimeCard}
    placeholder="Anime"
    extractId={(item) => item.mal_id}
  />
);

export default AnimeSearch;

