// src/pages/searchs/DetailPage.js
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import AppNavbar from '../../components/Navbar';
import DetailCard from '../../components/DetailCard';
import UserReviewCard from '../../components/userReviewCard';
import axios from 'axios';

const DetailPage = ({ fetchDetails, extractDetails, mediaType, tokenRequired }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [details, setDetails] = useState(null);
  const [review, setReview] = useState(null);
  const { searchKey, searchResults } = location.state || { searchKey: "", searchResults: [] };

  useEffect(() => {
    const fetchMediaDetails = async () => {
      try {
        const token = tokenRequired ? localStorage.getItem('spotifyToken') : null;
        const response = await fetchDetails(id, token);
        setDetails(extractDetails(response.data));

        const reviews = JSON.parse(localStorage.getItem('reviews')) || {};
        const reviewData = reviews[`${mediaType}/${id}`];
        setReview(reviewData);
      } catch (error) {
        console.error(`Error fetching ${mediaType} details:`, error);
      }
    };

    fetchMediaDetails();
  }, [id, fetchDetails, extractDetails, mediaType, tokenRequired]);

  const handleAddToList = async (listName) => {
    const media = {
      id: `${mediaType}/${id}`,
      media: mediaType,
      title: details.title,
      image: details.image,
    };
  
    try {
      const response = await fetch('http://localhost:5000/api/list/add', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('user_token')}`
        },
        body: JSON.stringify({ listName, media })
    });
      console.log(response.data.message);
    } catch (error) {
      console.error(`Error adding to ${listName}:`, error);
    }
  };
  

  const addToCompleted = () => handleAddToList('completed');
  const addToFutures = () => handleAddToList('futures');

  const handleReview = () => navigate('/leaveReview', {
    state: {
      mediaDetails: {
        url: `${mediaType}/${id}`,
        title: details.title,
        image: details.image,
        review,
      },
    },
  });

  const handleDelete = () => {
    const reviews = JSON.parse(localStorage.getItem('reviews')) || {};
    delete reviews[`${mediaType}/${id}`];
    localStorage.setItem('reviews', JSON.stringify(reviews));
    setReview(null);
  };

  const handleBack = () => {
    navigate(`/${mediaType}`, { state: { searchKey, searchResults } });
  };

  if (!details) return <p>Loading...</p>;

  return (
    <>
      <AppNavbar />
      <button onClick={handleBack}>Back</button>
      <DetailCard
        image={details.image}
        title={details.title}
        details={details.details}
        onAddToCompleted={addToCompleted}
        onAddToFutures={addToFutures}
        onReview={handleReview}
        type={mediaType}
      />
      {review && <UserReviewCard review={review} onDelete={handleDelete} />}
    </>
  );
};

export default DetailPage;



