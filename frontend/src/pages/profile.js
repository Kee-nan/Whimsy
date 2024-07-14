// src/pages/Profile.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Button, Card, Image } from 'react-bootstrap';
import AppNavbar from '../components/Navbar';
import AccountDetailsCard from '../components/AccountDetailsCard';

const Profile = () => {
  const [spotifyToken, setSpotifyToken] = useState('');
  const [spotifyConnected, setSpotifyConnected] = useState(false);
  const [user, setUser] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
  });

  useEffect(() => {
    const fetchToken = async () => {
      const code = new URLSearchParams(window.location.search).get('code');
      if (code) {
        try {
          const { data } = await axios.post('http://localhost:5000/auth/spotify/callback', { code });
          localStorage.setItem('spotifyToken', data.access_token);
          setSpotifyToken(data.access_token);
          setSpotifyConnected(true);
          window.history.replaceState({}, document.title, '/profile');
        } catch (error) {
          console.error(error);
        }
      } else {
        const token = localStorage.getItem('spotifyToken');
        if (token) {
          setSpotifyToken(token);
          setSpotifyConnected(true);
        }
      }
    };

    const fetchUserDetails = async () => {
      try {
        const user_token = localStorage.getItem('user_token');
        const headers = {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user_token}`,
        };

        const response = await axios.get('http://localhost:5000/api/accounts/user', { headers });

        if (response.status !== 200) {
          throw new Error('Error fetching user details');
        }

        setUser(response.data);
      } catch (error) {
        console.error('Error fetching user details:', error);
      }
    };

    fetchToken();
    fetchUserDetails();
  }, []);

  return (
    <>
      <AppNavbar />

      <Container>
        <h1>Profile Page</h1>
        
        <Card className="mb-4">
          <Card.Body className="d-flex flex-column align-items-center">
            <Image
              src="https://via.placeholder.com/150"
              roundedCircle
              width="150"
              height="150"
              className="mb-3"
            />
            <Card.Title className="display-4">Username</Card.Title>
            <Card.Text className="text-center">
              This is a short bio about the user. It can be a couple of sentences long, giving an overview of who the user is, their interests, or anything they want to share.
            </Card.Text>
            <div className="d-flex justify-content-center mt-3">
              <Button variant="primary" className="me-2">Edit</Button>
              <Button variant="secondary">Friends</Button>
            </div>
          </Card.Body>
        </Card>

        <AccountDetailsCard user={user} />

        <Card>
          <Card.Body>
            <Card.Title>Spotify</Card.Title>
            <Button href="http://localhost:5000/auth/spotify">Connect to Spotify</Button>
            <p>Status: {spotifyConnected ? <span style={{ color: 'green' }}>Connected</span> : <span style={{ color: 'darkred' }}>Not Connected</span>}</p>
          </Card.Body>
        </Card>
        
      </Container>
    </>
  );
};

export default Profile;


