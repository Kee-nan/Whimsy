import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Button } from 'react-bootstrap';

const Profile = () => {
  const [token, setToken] = useState('');

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const { data } = await axios.post('http://localhost:5000/auth/spotify/callback', {
          code: new URLSearchParams(window.location.search).get('code'),
        });
        setToken(data.access_token);
      } catch (error) {
        console.error(error);
      }
    };

    fetchToken();
  }, []);

  return (
    <Container>
      <h1>Profile Page</h1>
      <Button href="http://localhost:5000/auth/spotify">Connect to Spotify</Button>
      {token && <p>Spotify Token: {token}</p>}
    </Container>
  );
};

export default Profile;
