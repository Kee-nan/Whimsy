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
      alert("Item Successfully added to list")
    } catch (error) {
      console.error(`Error adding to ${listName}:`, error);
    }
  };


  // Navigate to the Leave Review Page if the Review button is hit with associated Details
  const handleReview = () => navigate('/leaveReview', {
    state: {
      mediaDetails: {
        id: `${mediaType}/${id}`,
        title: details.title,
        image: details.image,
        review,
      },
    },
  });


  // Function to handle deleting a review if the button is clicked
  const handleDelete = async () => {
    try {
      const userToken = localStorage.getItem('user_token');
      console.log(`Deleting review for mediaType: ${mediaType}, id: ${id}`);
      const deleteResponse = await fetch(`http://localhost:5000/api/review/delete?mediaType=${mediaType}&id=${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userToken}`
        }
      });

      console.log('Delete response status:', deleteResponse.status);
      const responseText = await deleteResponse.text();
      console.log('Delete response text:', responseText);

      if (deleteResponse.ok) {
        console.log('Review deleted successfully');
        setReview(null);
      } else {
        console.error(`Error deleting ${mediaType} review:`, responseText);
      }
    } catch (error) {
      console.error(`Error deleting ${mediaType} review:`, error);
    }
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

      {review && (
        <UserReviewCard
          review={review}
          onDelete={handleDelete}
          onEdit={handleReview} // Pass handleReview as onEdit
        />
      )}
      
    </>
  );
};

export default DetailPage;



