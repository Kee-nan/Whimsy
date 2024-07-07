import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import AppNavbar from '../../components/Navbar';
import DetailCard from '../../components/DetailCard';
import UserReviewCard from '../../components/userReviewCard';

const AlbumDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [album, setAlbum] = useState(null);
  const [review, setReview] = useState(null);
  const { searchKey, searchResults } = location.state || { searchKey: "", searchResults: [] };

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
        
        const reviews = JSON.parse(localStorage.getItem('reviews')) || {};
        const reviewData = reviews[`albums/${id}`];
        setReview(reviewData);
      } catch (error) {
        console.error("Error fetching album details:", error);
      }
    };

    fetchAlbumDetails();
  }, [id]);

  const handleAddToList = (listName) => {
    const list = JSON.parse(localStorage.getItem(listName)) || [];
    const albumItem = {
      url: `albums/${id}`,
      media: 'Album',
      title: album.name,
      image: album.images[0]?.url || 'placeholder.jpg',
    };
    localStorage.setItem(listName, JSON.stringify([...list, albumItem]));
  };

  const addToCompleted = () => handleAddToList('completedList');
  const addToFutures = () => handleAddToList('futuresList');
  const handleReview = () => navigate('/leaveReview', { state: { mediaDetails: { url: `albums/${id}`, title: album.name, image: album.images[0]?.url || 'placeholder.jpg' } } });

  const handleDelete = () => {
    const reviews = JSON.parse(localStorage.getItem('reviews')) || {};
    delete reviews[`albums/${id}`];
    localStorage.setItem('reviews', JSON.stringify(reviews));
    setReview(null);
  };

  const handleBack = () => {
    navigate('/albums', { state: { searchKey, searchResults } }); // Pass searchKey and searchResults
  };

  if (!album) return <p>Loading...</p>;

  return (
    <>
      <AppNavbar />
      <button onClick={handleBack}>Back</button>
      <DetailCard
        image={album.images[0]?.url || 'placeholder.jpg'}
        title={album.name}
        details={
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
        }
        onAddToCompleted={addToCompleted}
        onAddToFutures={addToFutures}
        onReview={handleReview}
        type="album"
      />
      {review && <UserReviewCard review={review} onDelete={handleDelete} />}
    </>
  );
};

export default AlbumDetail;




// Hook Component
// import React from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import AppNavbar from '../../components/Navbar';
// import DetailCard from '../../components/DetailCard';
// import UserReviewCard from '../../components/userReviewCard';
// import useMediaDetail from '../../hooks/useMediaDetail';

// const transformAlbumData = (data) => data; // Adjust according to Spotify API response structure

// const AlbumDetail = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const token = localStorage.getItem('spotifyToken');

//   const { media: album, review, addToCompleted, addToFutures, handleReview, handleDelete } = useMediaDetail(
//     id,
//     `https://api.spotify.com/v1/albums/${id}`,
//     'album',
//     transformAlbumData,
//     token // Pass the token here
//   );

//   if (!album) return <p>Loading...</p>;

//   const handleEdit = () => {
//     navigate('/leaveReview', {
//       state: {
//         mediaDetails: {
//           url: `albums/${id}`,
//           title: album.name,
//           image: album.images[0]?.url || 'placeholder.jpg',
//           review,
//         },
//       },
//     });
//   };

//   return (
//     <>
//       <AppNavbar />
//       <DetailCard
//         image={album.images[0]?.url || 'placeholder.jpg'}
//         title={album.name}
//         details={
//           <>
//             <p><strong>Artist(s):</strong> {album.artists.map(artist => artist.name).join(', ')}</p>
//             <p><strong>Release Date:</strong> {album.release_date}</p>
//             <p><strong>Total Tracks:</strong> {album.total_tracks}</p>
//             <p><strong>Genres:</strong> {album.genres.join(', ')}</p>
//             <p><strong>Label:</strong> {album.label}</p>
//             <p><strong>Spotify URL:</strong> <a href={album.external_urls.spotify} target="_blank" rel="noopener noreferrer">View on Spotify</a></p>
//             <div>
//               <h4>Track List:</h4>
//               <ul>
//                 {album.tracks.items.map((track, index) => (
//                   <li key={track.id}>
//                     {index + 1}. {track.name} - {track.artists.map(artist => artist.name).join(', ')}
//                   </li>
//                 ))}
//               </ul>
//             </div>
//           </>
//         }
//         onAddToCompleted={addToCompleted}
//         onAddToFutures={addToFutures}
//         onReview={handleReview}
//         type="album"
//       />
//       {review && <UserReviewCard review={review} onDelete={handleDelete} onEdit={handleEdit} />}
//     </>
//   );
// };

// export default AlbumDetail;