// frontend/src/pages/ViewFriendLists.js
// frontend/src/pages/ViewFriendLists.js

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Modal, Button } from 'react-bootstrap';
import AppNavbar from '../components/Navbar';
import FriendListCard from '../components/friends/FriendListCard';
import SearchAndDropdowns from '../components/ListFilter';
import FriendProfileCard from '../components/friends/FriendProfileCard';

const ViewFriendLists = () => {
  const [completedList, setCompletedList] = useState([]);
  const [futuresList, setFuturesList] = useState([]);
  const [currentListData, setCurrentListData] = useState([]);
  const [reviews, setReviews] = useState([]);

  const[bio, setBio] = useState('')
  const[username, setUsername] = useState('')

  const [currentList, setCurrentList] = useState('current');
  const [currentMedia, setCurrentMedia] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  const [showModal, setShowModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedReview, setSelectedReview] = useState(null);

  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFriendData = async () => {
      const userToken = localStorage.getItem('user_token');
      if (!userToken) {
        console.error('No user token found');
        return;
      }

      try {
        const response = await fetch(`http://localhost:5000/api/friends/friend-lists/${id}`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${userToken}`,
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch friend data: ${response.statusText}`);
        }

        const data = await response.json();
        setCompletedList(data.completed || []);
        setFuturesList(data.futures || []);
        setCurrentListData(data.current || []);
        setReviews(data.reviews || []);
        setBio(data.bio || []);
        setUsername(data.username || []);

      } catch (error) {
        console.error('Error fetching friend data:', error);
      }
    };

    fetchFriendData();
  }, [id]);

  const handleSelectList = (list) => setCurrentList(list);
  const handleSelectMedia = (media) => setCurrentMedia(media);
  const handleSearchChange = (event) => setSearchTerm(event.target.value);

  const filterList = (list) => {
    return list.filter(item =>
      item.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const renderList = (list, key) => (
    <Row key={key}>
      {filterList(list).map((item, index) => (
        <Col md={3} className="mb-4" key={index}>
          <FriendListCard item={item} reviewData={reviews} onCardClick={() => handleCardClick(item)} />
        </Col>
      ))}
    </Row>
  );

  const handleCardClick = (item) => {
    const review = reviews.find(r => r.id === `${item.id}`);
    setSelectedItem(item);
    setSelectedReview(review);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedItem(null);
    setSelectedReview(null);
  };

  const handleNavigateToDetails = () => {
    if (selectedItem) {
      navigate(`/${selectedItem.id}`);
    }
  };

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  return (
    <>
      <AppNavbar />

      <FriendProfileCard
        friendBio={bio}
        friendUsername={username}
      />

      <SearchAndDropdowns
        currentList={currentList}
        currentMedia={currentMedia}
        searchTerm={searchTerm}
        onListChange={handleSelectList}
        onMediaChange={handleSelectMedia}
        onSearchChange={handleSearchChange}
        capitalizeFirstLetter={capitalizeFirstLetter}
      />

      <Container className="mt-5">
        {currentList === 'completed'
          ? renderList(completedList, 'completedList')
          : currentList === 'futures'
          ? renderList(futuresList, 'futuresList')
          : renderList(currentListData, 'currentList')}
      </Container>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>{selectedItem?.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <img src={selectedItem?.image} alt={selectedItem?.title} style={{ width: '100%' }} />
          {selectedReview ? (
            <>
              <p>Rating: {selectedReview.rating}</p>
              <p>Review: {selectedReview.review}</p>
            </>
          ) : (
            <p>No review available</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
          <Button variant="primary" onClick={handleNavigateToDetails}>
            Details
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ViewFriendLists;





