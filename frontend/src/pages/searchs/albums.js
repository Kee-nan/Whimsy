// albums.js
import React from 'react';
import axios from 'axios';
import SearchPage from '../templates/SearchPage';
import { Card } from 'react-bootstrap';

// Function to search for albums from spotify and return json of search
const searchAlbums = async (key) => {
  const response = await axios.get(`/api/spotify/search`, {
    params: { q: key }
  });
  return { data: response.data };
};

// Function to load the details of the album onto the card
const renderAlbumCard = (album) => (
  <>
    <Card.Img src={album.images[0]?.url || 'placeholder.jpg'} alt={album.name} className="grid-card-image album"/>
    <Card.Body>
      <Card.Title  className="grid-card-title" style={{ color: 'white' }}>{album.name}</Card.Title>
      <Card.Text className="grid-card-creator" style={{ color: 'white' }}>{album.artists.map(artist => artist.name).join(', ')}</Card.Text>
    </Card.Body>
  </>
);

// Page load of the template
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





