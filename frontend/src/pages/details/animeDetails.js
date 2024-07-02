// src/pages/details/AnimeDetail.js
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import AppNavbar from '../../components/Navbar';
import { Container, Card } from 'react-bootstrap';

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

  if (!anime) return <p>Loading...</p>;

  return (
    <>
      <AppNavbar />
      <Container className="mt-5">
        <Card>
          <Card.Img src={anime.images.jpg.image_url} alt={anime.title} />
          <Card.Body>
            <Card.Title>{anime.title}</Card.Title>
            <Card.Text>{anime.synopsis}</Card.Text>
          </Card.Body>
        </Card>
      </Container>
    </>
  );
};

export default AnimeDetail;
