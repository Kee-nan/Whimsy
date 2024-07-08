// // src/pages/searchs/movieDetails.js
// import React, { useEffect, useState } from 'react';
// import { useParams, useNavigate, useLocation } from 'react-router-dom';
// import axios from 'axios';
// import AppNavbar from '../../components/Navbar';
// import DetailCard from '../../components/DetailCard';
// import UserReviewCard from '../../components/userReviewCard'; // Import the new component

// const MovieDetail = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const location = useLocation();
//   const [movie, setMovie] = useState(null);
//   const [review, setReview] = useState(null); // State for storing review

//   useEffect(() => {
//     const fetchMovieDetails = async () => {
//       try {
//         const response = await axios.get(`/api/movies/${id}`);
//         setMovie(response.data);
        
//         // Retrieve the review data from local storage
//         const reviews = JSON.parse(localStorage.getItem('reviews')) || {};
//         const reviewData = reviews[`movies/${id}`];
//         setReview(reviewData);
//       } catch (error) {
//         console.error("Error fetching movie details:", error);
//       }
//     };

//     fetchMovieDetails();
//   }, [id]);

//   const handleAddToList = (listName) => {
//     const list = JSON.parse(localStorage.getItem(listName)) || [];
//     const movieItem = {
//       url: `movies/${id}`,
//       media: 'Movie',
//       title: movie.title,
//       image: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
//     };
//     localStorage.setItem(listName, JSON.stringify([...list, movieItem]));
//   };

//   const addToCompleted = () => handleAddToList('completedList');
//   const addToFutures = () => handleAddToList('futuresList');

//   const handleDelete = () => {
//     const reviews = JSON.parse(localStorage.getItem('reviews')) || {};
//     delete reviews[`movies/${id}`];
//     localStorage.setItem('reviews', JSON.stringify(reviews));
//     setReview(null); // Update the state to reflect the deletion
//   };

//   const handleEdit = () => {
//     navigate('/leaveReview', {
//       state: {
//         mediaDetails: {
//           url: `movies/${id}`,
//           title: movie.title,
//           image: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
//           review,
//         },
//       },
//     });
//   };

//   const handleBack = () => {
//     navigate('/movies', {
//       state: {
//         searchKey: location.state?.searchKey,
//         searchResults: location.state?.searchResults
//       }
//     });
//   };

//   if (!movie) return <p>Loading...</p>;

//   return (
//     <>
//       <AppNavbar />
//       <button onClick={handleBack}>Back to Results</button>
//       <DetailCard
//         image={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
//         title={movie.title}
//         details={
//           <>
//             <p><strong>Release Date:</strong> {movie.release_date}</p>
//             <p><strong>Genres:</strong> {movie.genres?.map(genre => genre.name).join(', ')}</p>
//             <p><strong>Overview:</strong> {movie.overview}</p>
//           </>
//         }
//         onAddToCompleted={addToCompleted}
//         onAddToFutures={addToFutures}
//       />
//       {review && <UserReviewCard review={review} onDelete={handleDelete} onEdit={handleEdit} />}
//     </>
//   );
// };

// export default MovieDetail;

// src/pages/details/MovieDetail.js
import React from 'react';
import axios from 'axios';
import DetailPage from '../templates/DetailPage';

// Function to fetch movie details (no token needed)
const fetchMovieDetails = async (id) => {
  return await axios.get(`/api/movies/${id}`);
};

// Function to extract movie details
const extractMovieDetails = (data) => {
  const movie = data;
  return {
    image: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
    title: movie.title, // Ensure title is included
    details: (
      <>
        <p><strong>Release Date:</strong> {movie.release_date}</p>
        <p><strong>Genres:</strong> {movie.genres?.map(genre => genre.name).join(', ')}</p>
        <p><strong>Overview:</strong> {movie.overview}</p>
      </>
    )
  };
};

const MovieDetail = () => {
  return (
    <DetailPage
      fetchDetails={fetchMovieDetails}
      extractDetails={extractMovieDetails}
      mediaType="movie"
      tokenRequired={false} // No token required for movies
    />
  );
};

export default MovieDetail;






