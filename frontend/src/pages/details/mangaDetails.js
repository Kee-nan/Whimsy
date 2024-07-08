// // src/pages/searchs/mangaDetails.js
// import React, { useEffect, useState } from 'react';
// import { useParams, useNavigate, useLocation } from 'react-router-dom';
// import axios from 'axios';
// import AppNavbar from '../../components/Navbar';
// import DetailCard from '../../components/DetailCard';
// import UserReviewCard from '../../components/userReviewCard'; // Import the new component

// const MangaDetail = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const location = useLocation();
//   const [manga, setManga] = useState(null);
//   const [review, setReview] = useState(null); // State for storing review

//   useEffect(() => {
//     const fetchMangaDetails = async () => {
//       try {
//         const response = await axios.get(`https://api.jikan.moe/v4/manga/${id}/full`);
//         setManga(response.data.data);
        
//         // Retrieve the review data from local storage
//         const reviews = JSON.parse(localStorage.getItem('reviews')) || {};
//         const reviewData = reviews[`manga/${id}`];
//         setReview(reviewData);
//       } catch (error) {
//         console.error("Error fetching manga details:", error);
//       }
//     };

//     fetchMangaDetails();
//   }, [id]);

//   const handleAddToList = (listName) => {
//     const list = JSON.parse(localStorage.getItem(listName)) || [];
//     const mangaItem = {
//       url: `manga/${id}`,
//       media: 'Manga',
//       title: manga.title,
//       image: manga.images.jpg.image_url,
//     };
//     localStorage.setItem(listName, JSON.stringify([...list, mangaItem]));
//   };

//   const addToCompleted = () => handleAddToList('completedList');
//   const addToFutures = () => handleAddToList('futuresList');

//   const handleDelete = () => {
//     const reviews = JSON.parse(localStorage.getItem('reviews')) || {};
//     delete reviews[`manga/${id}`];
//     localStorage.setItem('reviews', JSON.stringify(reviews));
//     setReview(null); // Update the state to reflect the deletion
//   };

//   const handleEdit = () => {
//     navigate('/leaveReview', {
//       state: {
//         mediaDetails: {
//           url: `manga/${id}`,
//           title: manga.title,
//           image: manga.images.jpg.image_url,
//           review,
//         },
//       },
//     });
//   };

//   const handleBack = () => {
//     navigate('/manga', {
//       state: {
//         searchKey: location.state?.searchKey,
//         searchResults: location.state?.searchResults
//       }
//     });
//   };

//   if (!manga) return <p>Loading...</p>;

//   return (
//     <>
//       <AppNavbar />
//       <button onClick={handleBack}>Back</button>
//       <DetailCard
//         image={manga.images.jpg.image_url}
//         title={manga.title}
//         details={
//           <>
//             <p><strong>Author:</strong> {manga.authors[0].name}</p>
//             <p><strong>Background:</strong> {manga.background}</p>
//             <p><strong>Demographic:</strong> {manga.demographics[0].name}</p>
//             <p><strong>Status:</strong> {manga.status}</p>
//             <p><strong>Genres:</strong> {manga.genres?.map(genre => genre.name).join(', ')}</p>
//             <p><strong>Plot:</strong> {manga.synopsis}</p>
//           </>
//         }
//         onAddToCompleted={addToCompleted}
//         onAddToFutures={addToFutures}
//       />
//       {review && <UserReviewCard review={review} onDelete={handleDelete} onEdit={handleEdit} />}
//     </>
//   );
// };

// export default MangaDetail;

// src/pages/searchs/MangaDetail.js
import React from 'react';
import axios from 'axios';
import DetailPage from '../templates/DetailPage';

const fetchMangaDetails = async (id) => {
  return await axios.get(`https://api.jikan.moe/v4/manga/${id}/full`);
};

const extractMangaDetails = (data) => {
  const manga = data.data;
  return {
    image: manga.images.jpg.image_url || 'placeholder.jpg',
    title: manga.title, // Ensure title is included
    details: (
      <>
        <p><strong>Author:</strong> {manga.authors[0].name}</p>
        <p><strong>Background:</strong> {manga.background}</p>
        <p><strong>Demographic:</strong> {manga.demographics[0].name}</p>
        <p><strong>Status:</strong> {manga.status}</p>
        <p><strong>Genres:</strong> {manga.genres?.map(genre => genre.name).join(', ')}</p>
        <p><strong>Plot:</strong> {manga.synopsis}</p>
      </>
    )
  };
};

const MangaDetail = () => {
  return (
    <DetailPage
      fetchDetails={fetchMangaDetails}
      extractDetails={extractMangaDetails} // Corrected prop name
      mediaType="manga"
      tokenRequired={false} // No token required
    />
  );
};

export default MangaDetail;




