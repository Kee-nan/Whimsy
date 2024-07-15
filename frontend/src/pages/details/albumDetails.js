
import React from 'react';
import axios from 'axios';
import DetailPage from '../templates/DetailPage';

// Function to fetch album details (token required)
const fetchAlbumDetails = async (id, token) => {
  return await axios.get(`https://api.spotify.com/v1/albums/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// Function to extract album details
const extractAlbumDetails = (data) => {
  const album = data;
  return {
    image: album.images[0]?.url || 'placeholder.jpg',
    title: album.name, // Ensure title is included
    details: (
      <>
        <p><strong>Artist(s):</strong> {album.artists.map(artist => artist.name).join(', ')}</p>
        <p><strong>Release Date:</strong> {album.release_date}</p>
        <p><strong>Total Tracks:</strong> {album.total_tracks}</p>
        <p><strong>Genres:</strong> {album.genres.join(', ')}</p>
        <p><strong>Label:</strong> {album.label}</p>
        <p><strong>Spotify URL:</strong> <a href={album.external_urls.spotify} target="_blank" rel="noopener noreferrer">View on Spotify</a></p>
        <div>
          <h4>Track List:</h4>
          <ul>
            {album.tracks.items.map((track, index) => (
              <li key={track.id}>
                {index + 1}. {track.name} - {track.artists.map(artist => artist.name).join(', ')}
              </li>
            ))}
          </ul>
        </div>
      </>
    )
  };
};

const AlbumDetail = () => {
  const token = localStorage.getItem('spotifyToken'); // Retrieve the token from local storage

  return (
    <DetailPage
      fetchDetails={fetchAlbumDetails}
      extractDetails={extractAlbumDetails}
      mediaType="album"
      tokenRequired={true} // Token required for albums
    />
  );
};

export default AlbumDetail;





