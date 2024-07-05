import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import AppNavbar from '../../components/Navbar';
import DetailCard from '../../components/DetailCard';
import UserReviewCard from '../../components/userReviewCard'; // Import the new component

const AnimeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [anime, setAnime] = useState(null);
  const [review, setReview] = useState(null); // State for storing review

  useEffect(() => {
    const fetchAnimeDetails = async () => {
      try {
        const response = await axios.get(`https://api.jikan.moe/v4/anime/${id}/full`);
        setAnime(response.data.data);
        
        // Retrieve the review data from local storage
        const reviews = JSON.parse(localStorage.getItem('reviews')) || {};
        const reviewData = reviews[`anime/${id}`];
        setReview(reviewData);
      } catch (error) {
        console.error("Error fetching anime details:", error);
      }
    };

    fetchAnimeDetails();
  }, [id]);

  const handleAddToList = (listName) => {
    const list = JSON.parse(localStorage.getItem(listName)) || [];
    const animeItem = {
      url: `anime/${id}`,
      title: anime.title,
      image: anime.images.jpg.image_url,
    };
    localStorage.setItem(listName, JSON.stringify([...list, animeItem]));
  };

  const addToCompleted = () => handleAddToList('completedList');
  const addToFutures = () => handleAddToList('futuresList');

  const handleDelete = (title) => {
    const reviews = JSON.parse(localStorage.getItem('reviews')) || {};
    delete reviews[`anime/${id}`];
    localStorage.setItem('reviews', JSON.stringify(reviews));
    setReview(null); // Update the state to reflect the deletion
  };

  const handleEdit = () => {
    navigate('/leaveReview', {
      state: {
        mediaDetails: {
          url: `anime/${id}`,
          title: anime.title,
          image: anime.images.jpg.image_url,
          review,
        },
      },
    });
  };

  if (!anime) return <p>Loading...</p>;

  return (
    <>
      <AppNavbar />
      <DetailCard
        image={anime.images.jpg.image_url}
        title={anime.title}
        details={
          <>
            <p><strong>Background:</strong> {anime.background}</p>
            <p><strong>Episodes:</strong> {anime.episodes}</p>
            <p><strong>Status:</strong> {anime.status}</p>
            <p><strong>Year:</strong> {anime.year}</p>
            <p><strong>Plot:</strong> {anime.synopsis}</p>
          </>
        }
        onAddToCompleted={addToCompleted}
        onAddToFutures={addToFutures}
      />
      {review && <UserReviewCard review={review} onDelete={handleDelete} onEdit={handleEdit} />}
    </>
  );
};

export default AnimeDetail;






