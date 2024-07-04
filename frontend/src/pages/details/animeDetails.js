// src/pages/details/AnimeDetail.js
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import AppNavbar from '../../components/Navbar';
import DetailCard from '../../components/DetailCard';


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

  const handleAddToList = (listName) => {
    const list = JSON.parse(localStorage.getItem(listName)) || [];
    const animeItem = {
      url: `anime/${id}`,
      title: anime.title,
      image: anime.images.jpg.image_url,
    };
    localStorage.setItem(listName, JSON.stringify([...list, animeItem]));
  };

  const addToCompleted = () => handleAddToList('completedList');
  const addToFutures = () => handleAddToList('futuresList');
  const review = () => {
    // Review functionality will be added later
    alert('Review functionality not yet implemented');
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
            <p><strong>Background:</strong> {anime.background}</p>
            <p><strong>Episodes:</strong> {anime.episodes}</p>
            <p><strong>Status:</strong> {anime.status}</p>
            <p><strong>Year:</strong> {anime.year}</p>
            <p><strong>Plot:</strong> {anime.synopsis}</p>
          </>
        }
        onAddToCompleted={addToCompleted}
        onAddToFutures={addToFutures}
        onReview={review}
      />
    </>
  );
};

export default AnimeDetail;



