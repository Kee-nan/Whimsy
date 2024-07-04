// src/pages/details/AnimeDetail.js
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import AppNavbar from '../../components/Navbar';
import DetailCard from '../../components/DetailCard';
import { Button } from 'react-bootstrap';

const AnimeDetail = () => {
  const { id } = useParams();
  const [anime, setAnime] = useState(null);

  useEffect(() => {
    const fetchAnimeDetails = async () => {
      try {
        const response = await axios.get(`https://api.jikan.moe/v4/anime/${id}/full`);
        setAnime(response.data.data);
      } catch (error) {
        console.error("Error fetching anime details:", error);
      }
    };

    fetchAnimeDetails();
  }, [id]);

  const addToWatchlist = () => {
    const watchlist = JSON.parse(localStorage.getItem('watchlist')) || [];
    const animeItem = {
      url: `anime/${id}`,
      title: anime.title,
      image: anime.images.jpg.image_url,
    };
    localStorage.setItem('watchlist', JSON.stringify([...watchlist, animeItem]));
  };

  if (!anime) return <p>Loading...</p>;

  return (
    <>
      <AppNavbar />
      <DetailCard
        image={anime.images.jpg.image_url}
        title={anime.title}
        details={
          <>
          <p>Background: {anime.background}</p>
          <p>Episodes: {anime.episodes} </p>  
          <p>Status: {anime.status}</p>
          <p>Year: {anime.year}</p>
          <p>Plot: {anime.synopsis} </p>
          </>
        }
        buttons={<Button variant="success" onClick={addToWatchlist}>Add to Watchlist</Button>}
      />
    </>
  );
};

export default AnimeDetail;


