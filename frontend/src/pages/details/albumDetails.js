// albumDetails.js
import React from 'react';
import axios from 'axios';
import DetailPage from '../templates/DetailPage';


// Fetch album from our backend
const fetchAlbumDetails = async (id) => {
  const response = await axios.get(`/api/spotify/album/${id}`);
  console.log("Album Details Response:", response);
  return response;
};

// Function to extract album details
const extractAlbumDetails = (album) => {
  if (!album) {
    console.error("Album is undefined in extractAlbumDetails!");
    return { title: 'Unknown Album', image: 'placeholder.jpg', details: <p>Error loading album.</p> };
  }

  console.log("Extracting album details from:", album);

  // Html structure of the information about the album I want to display:
  return {
    image: album.images?.[0]?.url || 'placeholder.jpg',
    title: album.name || 'Untitled',
    details: (
      <>
        <p><strong>Artist(s):</strong> {album.artists?.map(artist => artist.name).join(', ')}</p>
        <p><strong>Release Date:</strong> {album.release_date}</p>
        <p><strong>Total Tracks:</strong> {album.total_tracks}</p>
        <p><strong>Genres:</strong> {album.genres?.join(', ') || 'N/A'}</p>
        <p><strong>Label:</strong> {album.label}</p>
        <p><strong>Spotify URL:</strong> <a href={album.external_urls?.spotify} target="_blank" rel="noopener noreferrer">View on Spotify</a></p>
        <div>
          <h4>Track List:</h4>
          <ul>
            {(album.tracks?.items || []).map((track, index) => (
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

// Page function that calls template
const AlbumDetail = () => {
  
  return (
    <DetailPage
      fetchDetails={fetchAlbumDetails}
      extractDetails={extractAlbumDetails}
      mediaType="album"
      tokenRequired={false} 
    />
  );
};

export default AlbumDetail;





