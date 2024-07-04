// src/pages/details/MangaDetail.js
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import AppNavbar from '../../components/Navbar';
import DetailCard from '../../components/DetailCard';
import { Button } from 'react-bootstrap';

const MangaDetail = () => {
  const { id } = useParams();
  const [manga, setManga] = useState(null);

  useEffect(() => {
    const fetchMangaDetails = async () => {
      try {
        const response = await axios.get(`https://api.jikan.moe/v4/manga/${id}/full`);
        setManga(response.data.data);
      } catch (error) {
        console.error("Error fetching manga details:", error);
      }
    };

    fetchMangaDetails();
  }, [id]);

  const addToWatchlist = () => {
    const watchlist = JSON.parse(localStorage.getItem('watchlist')) || [];
    const mangaItem = {
      url: `manga/${id}`,
      title: manga.title,
      image: manga.images.jpg.image_url,
    };
    localStorage.setItem('watchlist', JSON.stringify([...watchlist, mangaItem]));
  };

  if (!manga) return <p>Loading...</p>;

  return (
    <>
      <AppNavbar />
      <DetailCard
        image={manga.images.jpg.image_url}
        title={manga.title}
        details={
          <>
          <p><strong>Author: </strong> {manga.authors[0].name} </p>  
          <p><strong>Background: </strong> {manga.background}</p>
          <p><strong>Demographic: </strong> {manga.demographics[0].name} </p>  
          <p><strong>Status: </strong> {manga.status}</p>
          <p><strong>Genres: </strong> {manga.genres?.map(genre => genre.name).join(', ')}</p>
          <p><strong>Plot:</strong> {manga.synopsis} </p>
          </>
        }
        buttons={<Button variant="success" onClick={addToWatchlist}>Add to Watchlist</Button>}
      />
    </>
  );
};

export default MangaDetail;


