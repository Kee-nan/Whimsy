import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import AppNavbar from '../../components/Navbar';
import DetailCard from '../../components/DetailCard';
import UserReviewCard from '../../components/userReviewCard';
import ReviewModal from '../../components/ReviewModal'; // Import the new modal component

const DetailPage = ({ fetchDetails, extractDetails, mediaType, tokenRequired }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [details, setDetails] = useState(null);
  const [review, setReview] = useState(null);
  const [modalVisible, setModalVisible] = useState(false); // State to manage modal visibility
  const { searchKey, searchResults } = location.state || { searchKey: "", searchResults: [] };

  const [currentList, setCurrentList] = useState('Completed');
  const [currentMedia, setCurrentMedia] = useState('anime');
  const [searchTerm, setSearchTerm] = useState('');

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
  }, [id, fetchDetails, extractDetails, mediaType, tokenRequired]);

  useEffect(() => {
    fetchMediaDetails();
  }, [fetchMediaDetails]);

  const addToCompleted = () => handleAddToList('completed');
  const addToFutures = () => handleAddToList('futures');
  const addToCurrent = () => handleAddToList('current');

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

  const handleReview = () => setModalVisible(true); // Open the modal

  const handleCloseModal = () => setModalVisible(false); // Close the modal

  const handleReviewSubmit = () => {
    setModalVisible(false); // Close the modal after submission
    // Re-fetch reviews to update the UI if needed
    fetchMediaDetails();
  };

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

  const handleBack = () => {
    if (location.state?.origin === 'search') {
      navigate(`/${mediaType}`, { state: { searchKey, searchResults } });
    } else if (location.state?.origin === 'list') {
      navigate('/lists', { state: { currentList, currentMedia, searchTerm } });
    } else {
      navigate(-1); // Fallback to browser history
    }
  };

  if (!details) return <p>Loading...</p>;

  return (
    <>
      <AppNavbar />
      <button onClick={handleBack} className="secondaryButton">Back</button>
      <DetailCard
        image={details.image}
        title={details.title}
        details={details.details}
        onAddToCompleted={addToCompleted}
        onAddToCurrent={addToCurrent}
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






