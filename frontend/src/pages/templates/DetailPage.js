import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import AppNavbar from '../../components/Navbar';
import DetailCard from '../../components/details/DetailCard';
import ReviewModal from '../../components/details/ReviewModal';

const DetailPage = ({ fetchDetails, extractDetails, mediaType, tokenRequired }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [details, setDetails] = useState(null);
  const [review, setReview] = useState(null);
  const [userLists, setUserLists] = useState([]);
  const [stats, setStats] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const {
    searchKey = '', searchResults = [],
    currentList = 'current', currentMedia = 'All', searchTerm = '',
    origin,
  } = location.state || {};

  const fetchUserLists = async () => {
    const token = localStorage.getItem('user_token');
    const res = await fetch(`${process.env.REACT_APP_API_URL}/api/list/lists`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) setUserLists(await res.json());
  };

  const fetchMediaDetails = useCallback(async () => {
    try {
      const token = tokenRequired ? localStorage.getItem('spotifyToken') : null;
      const response = await fetchDetails(id, token);
      setDetails(extractDetails(response.data));
    } catch (error) {
      console.error(`Error fetching ${mediaType} details:`, error);
    }

    const userToken = localStorage.getItem('user_token');

    try {
      const rev = await fetch(
        `${process.env.REACT_APP_API_URL}/api/review/get?mediaType=${mediaType}&id=${id}`,
        { headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${userToken}` } }
      );
      if (rev.ok) {
        const { review } = await rev.json();
        setReview(review);
      } else {
        setReview(null);
      }
    } catch (err) {
      console.error('Error fetching review:', err);
    }

    try {
      const statsRes = await fetch(
        `${process.env.REACT_APP_API_URL}/api/review/stats?mediaType=${mediaType}&id=${id}`,
        { headers: { Authorization: `Bearer ${userToken}` } }
      );
      if (statsRes.ok) setStats(await statsRes.json());
    } catch (err) {
      console.error('Error fetching media stats:', err);
    }
  }, [id, fetchDetails, extractDetails, mediaType, tokenRequired]);

  useEffect(() => {
    fetchMediaDetails();
    fetchUserLists();
  }, [fetchMediaDetails]);

  const handleAddToList = async (listType, mediaId, mediaObj) => {
    const token = localStorage.getItem('user_token');
    const headers = { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` };

    try {
      let response;
      if (listType === 'none') {
        response = await fetch(`${process.env.REACT_APP_API_URL}/api/list/delete`, {
          method: 'DELETE', headers, body: JSON.stringify({ mediaId }),
        });
      } else {
        response = await fetch(`${process.env.REACT_APP_API_URL}/api/list/upsert`, {
          method: 'POST', headers, body: JSON.stringify({ media: mediaObj }),
        });
      }

      if (!response.ok) {
        const errorBody = await response.json().catch(() => ({}));
        throw new Error(errorBody.message || 'Failed to update list');
      }

      // Only resync (and thus let the dropdown re-derive its selection) once
      // we know the write actually succeeded.
      await fetchUserLists();
      return true;
    } catch (error) {
      console.error('Error updating list:', error);
      alert(`Could not update your list: ${error.message}`);
      return false;
    }
  };

  const handleReview = () => setModalVisible(true);
  const handleCloseModal = () => setModalVisible(false);
  const handleReviewSubmit = () => {
    setModalVisible(false);
    fetchMediaDetails(); // also refreshes stats after a review is added
  };

  const handleDelete = async () => {
    try {
      const userToken = localStorage.getItem('user_token');
      const deleteResponse = await fetch(
        `${process.env.REACT_APP_API_URL}/api/review/delete?mediaType=${mediaType}&id=${id}`,
        { method: 'DELETE', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${userToken}` } }
      );
      if (deleteResponse.ok) {
        setReview(null);
        fetchMediaDetails(); // refresh stats after deletion too
      }
    } catch (error) {
      console.error(`Error deleting ${mediaType} review:`, error);
    }
  };

  if (!details) return <p>Loading...</p>;

  const handleBack = () => {
    if (location.state?.origin === 'search') {
      navigate(`/${mediaType}`, { state: { searchKey, searchResults, origin } });
    } else if (location.state?.origin === 'list') {
      navigate('/lists', { state: { currentList, currentMedia, searchTerm, origin } });
    } else {
      navigate(-1);
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
        stats={stats}
      />
      <ReviewModal
        show={modalVisible}
        onClose={handleCloseModal}
        mediaDetails={{ id: `${mediaType}/${id}`, title: details.title, image: details.image, review }}
        onSubmit={handleReviewSubmit}
      />
    </>
  );
};

export default DetailPage;





