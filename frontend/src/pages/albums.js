import React, { useState } from 'react'; 
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import AppNavbar from '../components/Navbar';
import SearchBar from '../components/SearchBar';
import GridCard from '../components/GridCard';
import { Card } from 'react-bootstrap';

const Albums = () => {
  const [searchKey, setSearchKey] = useState("");
  const [albums, setAlbums] = useState([]);

  const searchAlbums = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('spotifyToken');
      const { data } = await axios.get("https://api.spotify.com/v1/search", {
        headers: {
          Authorization: `Bearer ${token}`
        },
        params: {
          q: searchKey,
          type: "album"
        }
      });
      setAlbums(data.albums.items);
    } catch (error) {
      console.error(error);
    }
  };

  const clearAlbums = () => {
    setAlbums([]);
  };

  const renderAlbumCard = (album) => (
    <>
      <Card.Img src={album.images[0].url} />
      <Card.Body>
        <Card.Title>{album.name}</Card.Title>
      </Card.Body>
    </>
  );

  return (
    <>
      <AppNavbar />
      <SearchBar
        placeholder="Search for Albums..."
        searchFunction={searchAlbums}
        clearFunction={clearAlbums}
        searchKey={searchKey}
        setSearchKey={setSearchKey}
      />
      <GridCard
        items={albums}
        renderItem={renderAlbumCard}
      />
    </>
  );
};

export default Albums;

