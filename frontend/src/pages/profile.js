import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Button, Card } from 'react-bootstrap';
import AppNavbar from '../components/Navbar';

const Profile = () => {
  const [spotifyToken, setSpotifyToken] = useState('');
  const [spotifyConnected, setSpotifyConnected] = useState(false);

  useEffect(() => {
    const fetchToken = async () => {
      const code = new URLSearchParams(window.location.search).get('code');
      if (code) {
        try {
          const { data } = await axios.post('http://localhost:5000/auth/spotify/callback', { code });
          localStorage.setItem('spotifyToken', data.access_token);
          setSpotifyToken(data.access_token);
          setSpotifyConnected(true); // Set connected state to true
          window.history.replaceState({}, document.title, '/profile'); // Remove the code from the URL
        } catch (error) {
          console.error(error);
        }
      } else {
        const token = localStorage.getItem('spotifyToken');
        if (token) {
          setSpotifyToken(token);
          setSpotifyConnected(true); // Set connected state to true if token exists
        }
      }
    };

    fetchToken();
  }, []);

  return (
    <>
      <AppNavbar />

      <Container>
        <h1>Profile Page</h1>
        <Card>
          <Card.Body>
            <Card.Title>Spotify</Card.Title>
            <Button href="http://localhost:5000/auth/spotify">Connect to Spotify</Button>
            <p>Status: {spotifyConnected ? <span style={{ color: 'green' }}>Connected</span> : <span style={{ color: 'darkred' }}>Not Connected</span>}</p>
          </Card.Body>
        </Card>
        {/* Other application cards */}
      </Container>
    </>
  );
};

export default Profile;







