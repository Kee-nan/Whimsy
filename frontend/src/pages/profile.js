import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Button, Card } from 'react-bootstrap';
import AppNavbar from '../components/Navbar';
import AccountDetailsCard from '../components/AccountDetailsCard';
import UserProfileCard from '../components/ProfileCard';

const Profile = () => {
  const [spotifyToken, setSpotifyToken] = useState('');
  const [spotifyConnected, setSpotifyConnected] = useState(false);
  const [user, setUser] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    bio: '',
    profilePicture: '',
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

    //Get User Details from Database to use to Load on page
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

        <UserProfileCard user={user} setUser={setUser} />

        <AccountDetailsCard user={user} />

        <Card className="profile-card account-details-card mb-4">
          <Card.Body>
            <Card.Title>Spotify</Card.Title>
            <Button className='primaryButton' href="http://localhost:5000/auth/spotify">Connect to Spotify</Button>
            <p>Status: {spotifyConnected ? <span style={{ color: 'green' }}>Connected</span> : <span style={{ color: 'darkred' }}>Not Connected</span>}</p>
          </Card.Body>
        </Card>

      </Container>
    </>
  );
};

export default Profile;



