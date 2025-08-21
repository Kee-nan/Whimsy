// frontend/src/pages/ViewFriendLists.js

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Modal, Button } from 'react-bootstrap';
import AppNavbar from '../components/Navbar';
import FriendListCard from '../components/friends/FriendListCard';
import FriendSearchAndDropdowns from '../components/FriendListFilter';
import FriendProfileCard from '../components/friends/FriendProfileCard';
import { Spinner } from 'react-bootstrap';

/**
 *  Main homepage
 *  Just has basic information about all of the media and details about the website.
 */

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

  const [loading, setLoading] = useState(true);

  const { id } = useParams();
  const navigate = useNavigate();

  const [isTableView, setIsTableView] = useState(false);

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
        // Subdivide the lists
        setCompletedList(data.lists.filter(item => item.listType ==='completed'));
        setCurrentListData(data.lists.filter(item => item.listType === 'current'));
        setFuturesList(data.lists.filter(item => item.listType === 'futures'));
        setReviews(data.reviews || []);
        setBio(data.bio || []);
        setUsername(data.username || []);
        setIsTableView(data.view_setting === 'table');

      } catch (error) {
        console.error('Error fetching friend data:', error);
      } finally {
      setLoading(false);
      }
    };

    fetchFriendData();
  }, [id]);




  // List searching details
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
        <Col md={4} className="mb-4" key={index}>
          <FriendListCard item={item} reviewData={reviews} onCardClick={() => handleCardClick(item)} />
        </Col>
      ))}
    </Row>
  );

  const renderTable = (list) => (
    <div className="whimsy-table-container">
      <div className="whimsy-table-wrapper">
        <table className="table whimsy-table table-striped table-hover">
          <thead>
            <tr>
              <th>Image</th>
              <th>Title</th>
              <th>Media Type</th>
              <th>User Rating</th>
              <th>ID</th>
            </tr>
          </thead>
          <tbody>
            {filterList(list).map((item, index) => {
              const review = reviews.find(r => r.id === `${item.id}`);
              return (
                <tr key={index} onClick={() => handleCardClick(item)}>
                  <td><img src={item.image} alt={item.title} /></td>
                  <td>{item.title}</td>
                  <td>{item.media}</td>
                  <td>{review ? review.rating : '—'}</td>
                  <td>{item.id}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
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

      <Container>

          <FriendProfileCard
            friendBio={bio}
            friendUsername={username}
            friendCompletedList={completedList}
            friendCurrentList={currentListData}
            friendFuturesList={futuresList}
          />

        <FriendSearchAndDropdowns
          currentList={currentList}
          currentMedia={currentMedia}
          searchTerm={searchTerm}
          onListChange={handleSelectList}
          onMediaChange={handleSelectMedia}
          onSearchChange={handleSearchChange}
          capitalizeFirstLetter={capitalizeFirstLetter}
          isTableView={isTableView}
          setIsTableView={setIsTableView}
        />

        <Container className="mt-5">
        <div style={{ minHeight: '300px', position: 'relative' }}>
          { loading ? (
            <div className="d-flex justify-content-center align-items-center h-100">
              <Spinner animation="border" variant="primary" />
            </div>
          ) : isTableView ? (
            renderTable(
              currentList === 'completed'
                ? completedList
                : currentList === 'futures'
                  ? futuresList
                  : currentListData
            )
          ) : (
            renderList(
              currentList === 'completed'
                ? completedList
                : currentList === 'futures'
                  ? futuresList
                  : currentListData
            )
          )}
        </div>
      </Container>

        <Modal show={showModal} onHide={handleCloseModal} className="custom-modal">

        
        <Modal.Header closeButton>
          <Modal.Title>{selectedItem?.title}</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <div className="container-fluid">
            <div className="row">
              {/* Left Column: Image */}
              <div className="col-md-4 d-flex align-items-center justify-content-center">
                <img
                  src={selectedItem?.image}
                  alt={selectedItem?.title}
                  className="review-modal-card-img"
                />
              </div>

              {/* Right Column: Title, Rating, Review */}
              <div className="col-md-8">
                <div className="review-modal-card-title">
                  {selectedItem?.title}
                </div>
                {selectedReview ? (
                  <>
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <span className="review-modal-label">Rating:</span>
                      <span className="review-modal-input">{selectedReview.rating}</span>
                    </div>
                    <div>
                      <span className="review-modal-label">Review:</span>
                      <p className="review-modal-input">{selectedReview.review}</p>
                    </div>
                  </>
                ) : (
                  <p>No review available</p>
                )}
              </div>
            </div>
          </div>
        </Modal.Body>

        <Modal.Footer>
          <button className="secondaryButton" onClick={handleCloseModal}>
            Close
          </button>
          <button className="primaryButton" onClick={handleNavigateToDetails}>
            Details
          </button>
        </Modal.Footer>
      </Modal>

    </Container>
    </>
  );
};

export default ViewFriendLists;





