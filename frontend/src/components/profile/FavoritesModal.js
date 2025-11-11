// src/components/profile/FavoritesModal.js
import React, { useEffect, useState } from 'react';
import { Modal, Button, Row, Col, Form, Image } from 'react-bootstrap';
import axios from 'axios';
import '../../styles/modal.css';

/**
 * Expectation:
 * - userFavorites prop should be an array of length 8 (slots A..H).
 *   Each slot is either null or an object: { id, title, image, media, ... }
 *
 * If your backend currently returns a compacted array, convert it before passing in:
 *   e.g. expandToSlots(compactedArray) => slotsArray (8 length)
 */

const SLOT_COUNT = 8;
const SLOT_LABELS = ['A','B','C','D','E','F','G','H'];

const FavoritesModal = ({ show, onHide, allLists, userFavorites, setUserFavorites }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [combinedList, setCombinedList] = useState([]);
  const [filteredList, setFilteredList] = useState([]);

  // local copy of the 8-slot favorites (array length = SLOT_COUNT)
  const [localFavorites, setLocalFavorites] = useState(Array(SLOT_COUNT).fill(null));

  // Build combined list from allLists (completed + current + futures)
  useEffect(() => {
    const arr = [
      ...(allLists.completed || []),
      ...(allLists.current || []),
      ...(allLists.futures || [])
    ]
      // dedupe by id (optional) and keep stable order
      .reduce((acc, item) => {
        if (!acc.some(x => x.id === item.id)) acc.push(item);
        return acc;
      }, []);
    setCombinedList(arr);
  }, [allLists]);

  // Filter combinedList by searchTerm
  useEffect(() => {
    const term = (searchTerm || '').toLowerCase();
    if (!term) {
      setFilteredList(combinedList);
    } else {
      setFilteredList(
        combinedList.filter(item => (item.title || '').toLowerCase().includes(term))
      );
    }
  }, [searchTerm, combinedList]);

  // Initialize localFavorites when modal opens from prop userFavorites
  useEffect(() => {
    if (show) {
      // Support two possible incoming shapes:
      // 1) Already length-8 slot array with nulls -> use as-is
      // 2) Compacted array of favorites -> place in first N slots, keep others null
      if (Array.isArray(userFavorites)) {
        if (userFavorites.length === SLOT_COUNT) {
          setLocalFavorites(userFavorites.map(slot => slot || null));
        } else {
          // compact -> expand to slots keeping original indices: fill front to back
          const fill = Array(SLOT_COUNT).fill(null);
          for (let i = 0; i < Math.min(userFavorites.length, SLOT_COUNT); i++) {
            fill[i] = userFavorites[i] || null;
          }
          setLocalFavorites(fill);
        }
      } else {
        setLocalFavorites(Array(SLOT_COUNT).fill(null));
      }
    }
  }, [show, userFavorites]);

  // helper: check if item exists anywhere in slots (by id)
  const isInSlots = (mediaObj) => {
    if (!mediaObj) return false;
    return localFavorites.some(slot => slot && slot.id === mediaObj.id);
  };

  // remove (set slot to null) by index
  const handleRemoveFavorite = (index) => {
    setLocalFavorites(prev => {
      const cp = [...prev];
      cp[index] = null;
      return cp;
    });
  };

  // add to first empty slot
  const handleAddFavorite = (mediaObj) => {
    if (!mediaObj) return;
    if (isInSlots(mediaObj)) return;

    setLocalFavorites(prev => {
      const cp = [...prev];
      const firstEmpty = cp.findIndex(x => x === null);
      if (firstEmpty === -1) return cp; // no space
      cp[firstEmpty] = mediaObj;
      return cp;
    });
  };

  // when Save clicked -> send full slots array to backend
  const handleSaveFavorites = async () => {
    try {
      const token = localStorage.getItem('user_token');
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      };

      // send full 8-slot array. If your backend expects compacted, change accordingly.
      const payload = { favorites: localFavorites };

      const res = await axios.patch(`${process.env.REACT_APP_API_URL}/api/accounts/favorites`, payload, { headers });

      // Expect res.data.favorites to be the saved slots array; if not, normalize here
      const saved = res.data.favorites;
      setUserFavorites(saved);
      onHide();
    } catch (err) {
      console.error('Error updating favorites:', err);
      alert('Could not save favorites. Please try again.');
    }
  };

  // helper: nice placeholder rendering
  const renderSlot = (slot, idx) => {
    return (
      <Row key={`slot-${idx}`} className="align-items-center mb-2">
        <Col xs={2} style={{ color: '#ccc' }}>{SLOT_LABELS[idx]}.</Col>

        <Col xs={3}>
          {slot ? (
            <Image src={slot.image || 'https://via.placeholder.com/60x80'} thumbnail style={{ height: 60, width: 45, objectFit: 'cover' }} />
          ) : (
            <div style={{ height: 60, width: 45, display: 'flex', alignItems: 'center', justifyContent: 'center', color:'#666' }}>—</div>
          )}
        </Col>

        <Col xs={5}>
          {slot ? (
            <div style={{ color: 'white', fontSize: '0.95rem' }}>{slot.title}</div>
          ) : (
            <div style={{ color: '#666' }}>—</div>
          )}
        </Col>

        <Col xs={2}>
          {slot ? (
            <Button variant="outline-danger" size="sm" onClick={() => handleRemoveFavorite(idx)}>✕</Button>
          ) : null}
        </Col>
      </Row>
    );
  };

  return (
    <Modal show={show} onHide={onHide} size="lg" centered className="custom-modal">
      <Modal.Header closeButton>
        <Modal.Title>Edit Favorites</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Row>
          {/* LEFT: fixed slots */}
          <Col md={5} style={{ borderRight: '1px solid #444', minHeight: '420px' }}>
            <h5 style={{ color: 'white', marginBottom: '1rem' }}>Your Favorites ({localFavorites.filter(Boolean).length}/{SLOT_COUNT}):</h5>

            {/* Always render all slots */}
            <div style={{ minHeight: '320px' }}>
              {localFavorites.map((slot, idx) => renderSlot(slot, idx))}
            </div>
          </Col>

          {/* RIGHT: search + results */}
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

            <div style={{ maxHeight: '400px', overflowY: 'auto', paddingRight: '0.5rem' }}>
              {filteredList.map(item => {
                const already = isInSlots(item);
                return (
                  <Row key={item.id} className="align-items-center mb-2">
                    <Col xs={3}>
                      <Image src={item.image || 'https://via.placeholder.com/50x70'} thumbnail style={{ maxHeight: '50px', objectFit: 'cover' }} />
                    </Col>
                    <Col xs={6}>
                      <span style={{ color: 'white' }}>{item.title}</span>
                    </Col>
                    <Col xs={3}>
                      <Button
                        variant={already ? "outline-secondary" : "outline-success"}
                        size="sm"
                        disabled={already || !localFavorites.some(x => x === null)}
                        onClick={() => handleAddFavorite(item)}
                      >
                        {already ? 'Added' : 'Add'}
                      </Button>
                    </Col>
                  </Row>
                );
              })}
              {filteredList.length === 0 && <p style={{ color: '#aaa', marginTop: '1rem' }}>No matching items.</p>}
            </div>
          </Col>
        </Row>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={() => { onHide(); }}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleSaveFavorites}>
          Save Favorites
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default FavoritesModal;

