// DetailPage.js
import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import AppNavbar from '../../components/Navbar';
import DetailCard from '../../components/details/DetailCard';
import ReviewModal from '../../components/details/ReviewModal'; 

const DetailPage = ({ fetchDetails, extractDetails, mediaType, tokenRequired }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  // API data Initialization
  const [details, setDetails] = useState(null);
  const [review, setReview] = useState(null);
  const [userLists, setUserLists] = useState([]);

  // State to manage modal visibility
  const [modalVisible, setModalVisible] = useState(false); 

  // restore search/list context
  const {
    searchKey = "",
    searchResults = [],
    currentList = "current",
    currentMedia = "All",
    searchTerm = "",
    origin
  } = location.state || {};

  // fetch the user’s lists so DetailCard can show the correct default
  const fetchUserLists = async () => {
    const token = localStorage.getItem('user_token');
    const res = await fetch('http://localhost:5000/api/list/lists', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (res.ok) {
      setUserLists(await res.json());
    } 
  };

  // fetch the media details + any existing review
  const fetchMediaDetails = useCallback(async () => {
    try {
      const token = tokenRequired ? localStorage.getItem('spotifyToken') : null;
      const response = await fetchDetails(id, token);
      setDetails(extractDetails(response.data));
    } catch (error) {
      console.error(`Error fetching ${mediaType} details:`, error);
    }

    try {
      const userToken = localStorage.getItem('user_token');
      const rev = await fetch(`http://localhost:5000/api/review/get?mediaType=${mediaType}&id=${id}`, {
        headers: {
          'Content-Type':'application/json',
          'Authorization': `Bearer ${userToken}`
        }
      });
      if (rev.ok) {
        const { review } = await rev.json();
        setReview(review);
      }
    } catch (err) {
      console.error('Error fetching review:', err);
    }
  }, [id, fetchDetails, extractDetails, mediaType, tokenRequired]);

  // initial load
  useEffect(() => {
    fetchMediaDetails();
    fetchUserLists();
  }, [fetchMediaDetails]);


  // handle dropdown changes from DetailCard
  const handleAddToList = async (listType, mediaId, mediaObj) => {
    const token = localStorage.getItem('user_token');
    const headers = {
      'Content-Type':'application/json',
      'Authorization': `Bearer ${token}`
    };

    if (listType === 'none') {
      await fetch('http://localhost:5000/api/list/delete', {
        method: 'DELETE', headers,
        body: JSON.stringify({ mediaId })
      });
    } else {
      await fetch('http://localhost:5000/api/list/upsert', {
        method: 'POST', headers,
        body: JSON.stringify({ media: mediaObj })
      });
    }

    // re‑load so dropdown default updates
    fetchUserLists();
  };


  /** 
   * REVIEW DETAILS
   */
  const handleReview = () => setModalVisible(true); // Open the modal
  const handleCloseModal = () => setModalVisible(false); // Close the modal

  const handleReviewSubmit = () => {
    setModalVisible(false); // Close the modal after submission
    // Re-fetch reviews to update the UI if needed
    fetchMediaDetails();
  };

  // Delete a given review for a piece of media
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

  // Loading value
  if (!details) return <p>Loading...</p>;

  // Handle back button navigation based on route origin
  const handleBack = () => {
    if (location.state?.origin === 'search') {
      navigate(`/${mediaType}`, { state: { searchKey, searchResults, origin } });
    } else if (location.state?.origin === 'list') {
      navigate('/lists', { state: { currentList, currentMedia, searchTerm, origin } });
    } else {
      navigate(-1); // Fallback to browser history
    }
  };

  return (
    <>
      <AppNavbar />

      <DetailCard
        image={details.image}
        title={details.title}
        details={details.details}
        summary={details.summary}
        type={mediaType}
        onAddToList={handleAddToList}
        onReview={handleReview}
        mediaId={`${mediaType}/${id}`}
        userLists={userLists}
        onBack={handleBack}
        review={review}
        onEdit={handleReview}
        onDelete={handleDelete}
      />

      <ReviewModal
        show={modalVisible}
        onClose={handleCloseModal}
        mediaDetails={{
          id: `${mediaType}/${id}`,
          title: details.title,
          image: details.image,
          review,
        }}
        onSubmit={handleReviewSubmit}
      />
    </>
  );
};

export default DetailPage;






