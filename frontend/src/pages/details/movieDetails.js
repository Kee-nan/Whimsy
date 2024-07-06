
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import AppNavbar from '../../components/Navbar';
import DetailCard from '../../components/DetailCard';
import UserReviewCard from '../../components/userReviewCard'; // Import the new component

const MovieDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [review, setReview] = useState(null); // State for storing review

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        const response = await axios.get(`/api/movies/${id}`);
        setMovie(response.data);
        
        // Retrieve the review data from local storage
        const reviews = JSON.parse(localStorage.getItem('reviews')) || {};
        const reviewData = reviews[`movies/${id}`];
        setReview(reviewData);
      } catch (error) {
        console.error("Error fetching movie details:", error);
      }
    };

    fetchMovieDetails();
  }, [id]);

  const handleAddToList = (listName) => {
    const list = JSON.parse(localStorage.getItem(listName)) || [];
    const movieItem = {
      url: `movies/${id}`,
      title: movie.title,
      image: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
    };
    localStorage.setItem(listName, JSON.stringify([...list, movieItem]));
  };

  const addToCompleted = () => handleAddToList('completedList');
  const addToFutures = () => handleAddToList('futuresList');

  const handleDelete = () => {
    const reviews = JSON.parse(localStorage.getItem('reviews')) || {};
    delete reviews[`movies/${id}`];
    localStorage.setItem('reviews', JSON.stringify(reviews));
    setReview(null); // Update the state to reflect the deletion
  };

  const handleEdit = () => {
    navigate('/leaveReview', {
      state: {
        mediaDetails: {
          url: `movies/${id}`,
          title: movie.title,
          image: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
          review,
        },
      },
    });
  };

  

  if (!movie) return <p>Loading...</p>;

  return (
    <>
      <AppNavbar />
      <DetailCard
        image={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
        title={movie.title}
        details={
          <>
            <p><strong>Release Date:</strong> {movie.release_date}</p>
            <p><strong>Genres:</strong> {movie.genres?.map(genre => genre.name).join(', ')}</p>
            <p><strong>Overview:</strong> {movie.overview}</p>
          </>
        }
        onAddToCompleted={addToCompleted}
        onAddToFutures={addToFutures}
      />
      {review && <UserReviewCard review={review} onDelete={handleDelete} onEdit={handleEdit} />}
    </>
  );
};

export default MovieDetail;



// import React from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import AppNavbar from '../../components/Navbar';
// import DetailCard from '../../components/DetailCard';
// import UserReviewCard from '../../components/userReviewCard';
// import useMediaDetail from '../../hooks/useMediaDetail';

// const transformMovieData = (data) => data; // Adjust according to your backend API response structure

// const MovieDetail = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const { media: movie, review, addToCompleted, addToFutures, handleReview, handleDelete } = useMediaDetail(
//     id,
//     `/api/movies/${id}`,
//     'movie',
//     transformMovieData
//   );

//   if (!movie) return <p>Loading...</p>;

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

//   return (
//     <>
//       <AppNavbar />
//       <DetailCard
//         image={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
//         title={movie.title}
//         details={
//           <>
//             <p><strong>Release Date:</strong> {movie.release_date || 'N/A'}</p>
//             <p><strong>Genres:</strong> {movie.genres?.map(genre => genre.name).join(', ') || 'N/A'}</p>
//             <p><strong>Overview:</strong> {movie.overview || 'N/A'}</p>
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


