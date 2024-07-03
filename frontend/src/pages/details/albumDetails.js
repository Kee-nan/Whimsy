// src/pages/details/AlbumDetail.js
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import AppNavbar from '../../components/Navbar';
import { Container, Card, Button } from 'react-bootstrap';

const AlbumDetail = () => {
  const { id } = useParams();
  const [album, setAlbum] = useState(null);
  const [artists, setArtists] = useState([]);

  useEffect(() => {
    const fetchAlbumDetails = async () => {
      try {
        const token = localStorage.getItem('spotifyToken');
        const response = await axios.get(`https://api.spotify.com/v1/albums/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setAlbum(response.data);
        setArtists(response.data.artists);
      } catch (error) {
        console.error("Error fetching album details:", error);
      }
    };

    fetchAlbumDetails();
  }, [id]);

  const addToWatchlist = () => {
    const watchlist = JSON.parse(localStorage.getItem('watchlist')) || [];
    const albumItem = {
      url: `albums/${id}`,
      title: album.name,
      image: album.images[0]?.url || 'placeholder.jpg',
    };
    localStorage.setItem('watchlist', JSON.stringify([...watchlist, albumItem]));
  };

  if (!album) return <p>Loading...</p>;

  return (
    <>
      <AppNavbar />
      <Container className="mt-5">
        <Card>
          <Card.Img src={album.images[0]?.url || 'placeholder.jpg'} alt={album.name} />
          <Card.Body>
            <Card.Title>{album.name}</Card.Title>
            <Card.Text><strong>Artists:</strong> {artists.map(artist => artist.name).join(', ')}</Card.Text>
            <Card.Text><strong>Release Date:</strong> {album.release_date}</Card.Text>
            <Card.Text><strong>Total Tracks:</strong> {album.total_tracks}</Card.Text>
            <Card.Text><strong>Available Markets:</strong> {album.available_markets.join(', ')}</Card.Text>
            <Card.Text><strong>Spotify URL:</strong> <a href={album.external_urls.spotify} target="_blank" rel="noopener noreferrer">View on Spotify</a></Card.Text>
            <Button variant="success" onClick={addToWatchlist}>Add to Watchlist</Button>
          </Card.Body>
        </Card>
      </Container>
    </>
  );
};

export default AlbumDetail;

