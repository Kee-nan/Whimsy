// src/pages/details/MangaDetail.js
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import AppNavbar from '../../components/Navbar';
import { Container, Card, Button } from 'react-bootstrap';

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
      <Container className="mt-5">
        <Card>
          <Card.Img src={manga.images.jpg.image_url} alt={manga.title} />
          <Card.Body>
            <Card.Title>{manga.title}</Card.Title>
            <Card.Text>{manga.synopsis}</Card.Text>
            <Button variant="success" onClick={addToWatchlist}>Add to Watchlist</Button>
          </Card.Body>
        </Card>
      </Container>
    </>
  );
};

export default MangaDetail;

