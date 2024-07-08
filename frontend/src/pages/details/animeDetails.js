// // src/pages/searchs/animeDetails.js
// import React, { useEffect, useState } from 'react';
// import { useParams, useNavigate, useLocation } from 'react-router-dom';
// import axios from 'axios';
// import AppNavbar from '../../components/Navbar';
// import DetailCard from '../../components/DetailCard';
// import UserReviewCard from '../../components/userReviewCard'; // Import the new component

// const AnimeDetail = () => {
//   const { id } = useParams(); 
//   const navigate = useNavigate();
//   const location = useLocation();
//   const [anime, setAnime] = useState(null);
//   const [review, setReview] = useState(null); // State for storing review

//   // One block for use Effect
//   useEffect(() => {
//     const fetchAnimeDetails = async () => {
//       try {
//         const response = await axios.get(`https://api.jikan.moe/v4/anime/${id}/full`);
//         setAnime(response.data.data);
        
//         // Retrieve the review data from local storage
//         const reviews = JSON.parse(localStorage.getItem('reviews')) || {};
//         const reviewData = reviews[`anime/${id}`];
//         setReview(reviewData);
//       } catch (error) {
//         console.error("Error fetching anime details:", error);
//       }
//     };

//     fetchAnimeDetails();
//   }, [id]);

//   // Function to Add Card details into a list
//   const handleAddToList = (listName) => {
//     const list = JSON.parse(localStorage.getItem(listName)) || [];
//     const animeItem = {
//       url: `anime/${id}`,
//       media: 'Anime',
//       title: anime.title,
//       image: anime.images.jpg.image_url,
//     };
//     localStorage.setItem(listName, JSON.stringify([...list, animeItem]));
//   };

//   const addToCompleted = () => handleAddToList('completedList');
//   const addToFutures = () => handleAddToList('futuresList');

//   const handleDelete = (title) => {
//     const reviews = JSON.parse(localStorage.getItem('reviews')) || {};
//     delete reviews[`anime/${id}`];
//     localStorage.setItem('reviews', JSON.stringify(reviews));
//     setReview(null); // Update the state to reflect the deletion
//   };

//   const handleEdit = () => {
//     navigate('/leaveReview', {
//       state: {
//         mediaDetails: {
//           url: `anime/${id}`,
//           title: anime.title,
//           image: anime.images.jpg.image_url,
//           review,
//         },
//       },
//     });
//   };

//   // Back Button that Sends you back to the search page
//   const handleBack = () => {
//     navigate('/anime', {
//       state: {
//         searchKey: location.state?.searchKey,
//         searchResults: location.state?.searchResults
//       }
//     });
//   };

//   // Loading Signal if no Data Recieved yet
//   if (!anime) return <p>Loading...</p>;


//   // Page Structure: 
//   return (
//     <>
//       <AppNavbar />
//       <button onClick={handleBack}>Back</button>
//       <DetailCard
//         image={anime.images.jpg.image_url}
//         title={anime.title}
//         details={
//           <>
//             <p><strong>Background:</strong> {anime.background}</p>
//             <p><strong>Episodes:</strong> {anime.episodes}</p>
//             <p><strong>Status:</strong> {anime.status}</p>
//             <p><strong>Year:</strong> {anime.year}</p>
//             <p><strong>Plot:</strong> {anime.synopsis}</p>
//           </>
//         }
//         onAddToCompleted={addToCompleted}
//         onAddToFutures={addToFutures}
//       />
//       {review && <UserReviewCard review={review} onDelete={handleDelete} onEdit={handleEdit} />}
//     </>
//   );
// };

// export default AnimeDetail;
// src/pages/searchs/AnimeDetail.js
import React from 'react';
import axios from 'axios';
import DetailPage from '../templates/DetailPage';

const fetchAnimeDetails = async (id) => {
  return await axios.get(`https://api.jikan.moe/v4/anime/${id}/full`);
};

const extractAnimeDetails = (data) => {
  const anime = data.data;
  return {
    image: anime.images.jpg.image_url || 'placeholder.jpg',
    title: anime.title, // Ensure title is included
    details: (
      <>
        <p><strong>Background:</strong> {anime.background}</p>
        <p><strong>Episodes:</strong> {anime.episodes}</p>
        <p><strong>Status:</strong> {anime.status}</p>
        <p><strong>Year:</strong> {anime.year}</p>
        <p><strong>Plot:</strong> {anime.synopsis}</p>
      </>
    )
  };
};

const AnimeDetail = () => {
  return (
    <DetailPage
      fetchDetails={fetchAnimeDetails}
      extractDetails={extractAnimeDetails} // Corrected prop name
      mediaType="anime"
      tokenRequired={false} // No token required
    />
  );
};

export default AnimeDetail;
