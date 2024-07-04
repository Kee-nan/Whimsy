// src/pages/details/AlbumDetail.js
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import AppNavbar from '../../components/Navbar';
import DetailCard from '../../components/DetailCard';
import { Button } from 'react-bootstrap';

const AlbumDetail = () => {
  const { id } = useParams();
  const [album, setAlbum] = useState(null);
  const [artists, setArtists] = useState([]);
  const [tracks, setTracks] = useState([]);

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
        setTracks(response.data.tracks.items);
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
      <DetailCard
        image={album.images[0]?.url || 'placeholder.jpg'}
        title={album.name}
        details={
          <>
            <p><strong>Artist(s):</strong> {artists.map(artist => artist.name).join(', ')}</p>
            <p><strong>Release Date:</strong> {album.release_date}</p>
            <p><strong>Total Tracks:</strong> {album.total_tracks}</p>
            <p><strong>Genres:</strong> {album.genres.join(', ')}</p>
            <p><strong>Label:</strong> {album.label}</p>
            <p><strong>Spotify URL:</strong> <a href={album.external_urls.spotify} target="_blank" rel="noopener noreferrer">View on Spotify</a></p>
            <div>
              <h4>Track List:</h4>
              <ul>
                {tracks.map((track, index) => (
                  <li key={track.id}>
                    {index + 1}. {track.name} - {track.artists.map(artist => artist.name).join(', ')}
                  </li>
                ))}
              </ul>
            </div>
          </>
        }
        buttons={<Button variant="success" onClick={addToWatchlist}>Add to Watchlist</Button>}
        type="album"
      />
    </>
  );
};

export default AlbumDetail;
