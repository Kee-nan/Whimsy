import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Button, Navbar, Nav, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';

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
      <Navbar bg="dark" variant="dark" expand="lg">
        <Container>
          <Navbar.Brand as={Link} to="/">Whimsy</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link as={Link} to="/profile">Profile</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

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







