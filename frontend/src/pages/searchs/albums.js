

import React from 'react';
import axios from 'axios';
import SearchPage from '../templates/SearchPage';
import { Card } from 'react-bootstrap';

const searchAlbums = async (key) => {
  const token = localStorage.getItem('spotifyToken');
  const response = await axios.get('https://api.spotify.com/v1/search', {
    headers: {
      Authorization: `Bearer ${token}`
    },
    params: {
      q: key,
      type: 'album'
    }
  });
  return { data: response.data.albums.items };
};

const renderAlbumCard = (album) => (
  <>
    <Card.Img src={album.images[0]?.url || 'placeholder.jpg'} alt={album.name} className="grid-card-image album"/>
    <Card.Body>
      <Card.Title  className="grid-card-title">{album.name}</Card.Title>
      <Card.Text className="grid-card-creator">{album.artists.map(artist => artist.name).join(', ')}</Card.Text>
    </Card.Body>
  </>
);

const Albums = () => (
  <SearchPage
    searchFunction={searchAlbums}
    renderCard={renderAlbumCard}
    placeholder="Album"
    requiresToken={true}
    extractId={(item) => item.id}
  />
);

export default Albums;





