// src/components/FavoritesModal.js
import React, { useEffect, useState } from 'react';
import { Modal, Button, Row, Col, Form, Image } from 'react-bootstrap';
import axios from 'axios';
import '../../styles/modal.css';

const FavoritesModal = ({
  show,
  onHide,
  allLists,         // { completed: [...], current: [...], futures: [...] }
  userFavorites,    // [ { id, media, title, image, listType, ... }, ... ]
  setUserFavorites  // function to update parent’s favorites array
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [combinedList, setCombinedList] = useState([]); // all media items
  const [filteredList, setFilteredList] = useState([]);

  // Build a single array of all media items (completed + current + futures)
  useEffect(() => {
    const arr = [
      ...(allLists.completed || []),
      ...(allLists.current   || []),
      ...(allLists.futures   || [])
    ];
    setCombinedList(arr);
  }, [allLists]);

  // Filter combinedList by searchTerm
  useEffect(() => {
    const term = searchTerm.toLowerCase();
    const flt = combinedList.filter(item =>
      item.title.toLowerCase().includes(term)
    );
    setFilteredList(flt);
  }, [searchTerm, combinedList]);

  // LOCAL copy of favorites to allow immediate UI updates
  const [localFavorites, setLocalFavorites] = useState([]);

  // When opening, initialize localFavorites from prop
  useEffect(() => {
    if (show) {
      setLocalFavorites(userFavorites.slice()); // shallow clone
    }
  }, [show, userFavorites]);

  // Helper: Is this media object already in favorites?
  const isInFavorites = (mediaObj) => {
    return localFavorites.some(fav => fav.id === mediaObj.id);
  };

  // Handler to remove a favorite by index
  const handleRemoveFavorite = (index) => {
    const newFavs = [...localFavorites];
    newFavs.splice(index, 1);
    setLocalFavorites(newFavs);
  };

  // Handler to add a media object to favorites
  const handleAddFavorite = (mediaObj) => {
    if (localFavorites.length >= 8) return;
    // make sure it’s not already in favorites
    if (!isInFavorites(mediaObj)) {
      setLocalFavorites(prev => [...prev, mediaObj]);
    }
  };

  // Save to backend and propagate to parent
  const handleSaveFavorites = async () => {
    try {
      const token = localStorage.getItem('user_token');
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      };
      // We send the entire updated favorites array
      const response = await axios.patch(
        'http://localhost:5000/api/accounts/favorites',
        { favorites: localFavorites },
        { headers }
      );
      // On success, inform parent
      setUserFavorites(response.data.favorites);
      onHide();
    } catch (err) {
      console.error('Error updating favorites:', err);
      alert('Could not save favorites. Please try again.');
    }
  };

  return (
    <Modal show={show} onHide={onHide} size="lg" centered className="custom-modal">
      <Modal.Header closeButton>
        <Modal.Title>Edit Favorites</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Row>
          {/* LEFT PANE: Current Favorites (max 8) */}
          <Col md={5} style={{ borderRight: '1px solid #444' }}>
            <h5 style={{ color: 'white', marginBottom: '1rem' }}>Your Favorites ({localFavorites.length}/8):</h5>
            {localFavorites.length === 0 && (
              <p style={{ color: '#ccc' }}>You have no favorites yet.</p>
            )}
            <div>
              {localFavorites.map((fav, idx) => (
                <Row key={fav.id} className="align-items-center mb-3">
                  <Col xs={3}>
                    <Image
                      src={fav.image}
                      thumbnail
                      style={{ maxHeight: '60px', objectFit: 'cover' }}
                    />
                  </Col>
                  <Col xs={7}>
                    <span style={{ color: 'white' }}>{fav.title}</span>
                  </Col>
                  <Col xs={2}>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => handleRemoveFavorite(idx)}
                    >
                      ✕
                    </Button>
                  </Col>
                </Row>
              ))}
            </div>
          </Col>

          {/* RIGHT PANE: All media with search + “Add” button */}
          <Col md={7}>
            <Form.Control
              type="text"
              placeholder="Search your lists..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              style={{
                marginBottom: '1rem',
                backgroundColor: '#343334',
                border: '1px solid #555',
                color: 'white'
              }}
            />

            <div style={{
              maxHeight: '400px',
              overflowY: 'auto',
              paddingRight: '0.5rem'
            }}>
              {filteredList.map(item => {
                const already = isInFavorites(item);
                return (
                  <Row key={item.id} className="align-items-center mb-2">
                    <Col xs={3}>
                      <Image
                        src={item.image}
                        thumbnail
                        style={{ maxHeight: '50px', objectFit: 'cover' }}
                      />
                    </Col>
                    <Col xs={6}>
                      <span style={{ color: 'white' }}>{item.title}</span>
                    </Col>
                    <Col xs={3}>
                      <Button
                        variant="outline-success"
                        size="sm"
                        disabled={already || localFavorites.length >= 8}
                        onClick={() => handleAddFavorite(item)}
                      >
                        {already ? 'Added' : 'Add'}
                      </Button>
                    </Col>
                  </Row>
                );
              })}
              {filteredList.length === 0 && (
                <p style={{ color: '#aaa', marginTop: '1rem' }}>No matching items.</p>
              )}
            </div>
          </Col>
        </Row>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>Cancel</Button>
        <Button variant="primary" onClick={handleSaveFavorites} disabled={localFavorites.length === 0 && userFavorites.length === 0}>
          Save Favorites
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default FavoritesModal;
