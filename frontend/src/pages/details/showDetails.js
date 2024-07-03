// src/pages/details/ShowDetail.js
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import AppNavbar from '../../components/Navbar';
import { Container, Card, Button } from 'react-bootstrap';

const ShowDetail = () => {
  const { id } = useParams();
  const [show, setShow] = useState(null);

  useEffect(() => {
    const fetchShowDetails = async () => {
      try {
        const response = await axios.get(`https://api.tvmaze.com/shows/${id}`);
        setShow(response.data);
      } catch (error) {
        console.error("Error fetching show details:", error);
      }
    };

    fetchShowDetails();
  }, [id]);

  const addToWatchlist = () => {
    const watchlist = JSON.parse(localStorage.getItem('watchlist')) || [];
    const showItem = {
      url: `shows/${id}`,
      title: show.name,
      image: show.image?.original || 'placeholder.jpg',
    };
    localStorage.setItem('watchlist', JSON.stringify([...watchlist, showItem]));
  };

  if (!show) return <p>Loading...</p>;

  return (
    <>
      <AppNavbar />
      <Container className="mt-5">
        <Card>
          <Card.Img src={show.image?.original || 'placeholder.jpg'} alt={show.name} />
          <Card.Body>
            <Card.Title>{show.name}</Card.Title>
            <Card.Text dangerouslySetInnerHTML={{ __html: show.summary }} />
            <Button variant="success" onClick={addToWatchlist}>Add to Watchlist</Button>
          </Card.Body>
        </Card>
      </Container>
    </>
  );
};

export default ShowDetail;

