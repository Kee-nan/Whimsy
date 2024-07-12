// src/pages/searchs/DetailPage.js
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import AppNavbar from '../../components/Navbar';
import DetailCard from '../../components/DetailCard';
import UserReviewCard from '../../components/userReviewCard';

const DetailPage = ({ fetchDetails, extractDetails, mediaType, tokenRequired }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [details, setDetails] = useState(null);
  const [review, setReview] = useState(null);
  const { searchKey, searchResults } = location.state || { searchKey: "", searchResults: [] };

  // Use Effect hook to go fetch assocaited media details with the object they clicked on
  useEffect(() => {

    const fetchMediaDetails = async () => {
      // Block to Fetch the Details of the media object
      try {
        const token = tokenRequired ? localStorage.getItem('spotifyToken') : null;
        const response = await fetchDetails(id, token);
        setDetails(extractDetails(response.data));
      } catch (error) {
        console.error(`Error fetching ${mediaType} details:`, error);
      }

      // Block to fetch review from backend
      try {
        const userToken = localStorage.getItem('user_token');
        const reviewResponse = await fetch(`http://localhost:5000/api/review/get?mediaType=${mediaType}&id=${id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${userToken}`
          }
        });
  
        if (reviewResponse.ok) {
          const data = await reviewResponse.json();
          setReview(data.review);
        } else {
          console.error(`Error fetching ${mediaType} review:`, await reviewResponse.text());
        }
      } catch (error) {
        console.error(`Error fetching ${mediaType} review:`, error);
      }
    };

    // Call the funciton in the hook
    fetchMediaDetails();
  }, [id, fetchDetails, extractDetails, mediaType, tokenRequired]);


  // Function to Add the media object on the page to the database in the User's List
  const addToCompleted = () => handleAddToList('completed');
  const addToFutures = () => handleAddToList('futures');

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


  // Navigate to the Leave Review Page if the Review button is hit with associated Details
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


  // Function to handle deleting a review if the button o
  const handleDelete = () => {
    const reviews = JSON.parse(localStorage.getItem('reviews')) || {};
    delete reviews[`${mediaType}/${id}`];
    localStorage.setItem('reviews', JSON.stringify(reviews));
    setReview(null);
  };


  // Back button to navigate back to the search page with the same query results
  const handleBack = () => {
    navigate(`/${mediaType}`, { state: { searchKey, searchResults } });
  };


  // Loading bar while we wait for details to be fetched
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



