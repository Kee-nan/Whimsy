import React, { useEffect, useState } from 'react';
import { Modal, Form, Row, Col, Image } from 'react-bootstrap';

/**
 * iPhotos-style bulk selection: fetches everything the user already has
 * on their current/completed/futures lists, lets them filter/search, and
 * check multiple items at once to add to a custom list in one submit.
 */
const BulkAddModal = ({ show, onHide, listId, onDone }) => {
  const [allItems, setAllItems] = useState([]);
  const [filterMedia, setFilterMedia] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [selected, setSelected] = useState(new Set());
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!show) return;
    const fetchLists = async () => {
      const token = localStorage.getItem('user_token');
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/list/lists`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setAllItems([...data.completed, ...data.current, ...data.futures]);
      }
    };
    fetchLists();
    setSelected(new Set());
    setSearchTerm('');
    setFilterMedia('All');
  }, [show]);

  const filtered = allItems.filter((item) => {
    const matchesMedia = filterMedia === 'All' || item.media === filterMedia;
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesMedia && matchesSearch;
  });

  const toggleSelect = (id) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    const token = localStorage.getItem('user_token');
    const itemsToAdd = allItems.filter((item) => selected.has(item.id));
    await fetch(`${process.env.REACT_APP_API_URL}/api/custom-lists/${listId}/items/bulk`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ items: itemsToAdd }),
    });
    setSubmitting(false);
    onDone();
    onHide();
  };

  return (
    <Modal show={show} onHide={onHide} size="lg" className="custom-modal">
      <Modal.Header closeButton><Modal.Title>Add Items to List</Modal.Title></Modal.Header>
      <Modal.Body>
        <Row className="mb-3">
          <Col md={4}>
            <Form.Select value={filterMedia} onChange={(e) => setFilterMedia(e.target.value)}>
              <option value="All">All Types</option>
              <option value="movie">Movie</option>
              <option value="show">Show</option>
              <option value="anime">Anime</option>
              <option value="manga">Manga</option>
              <option value="book">Book</option>
              <option value="game">Game</option>
              <option value="album">Album</option>
            </Form.Select>
          </Col>
          <Col md={8}>
            <Form.Control placeholder="Search title..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          </Col>
        </Row>

        <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
          {filtered.map((item) => (
            <Row
              key={item.id}
              className="align-items-center mb-2"
              onClick={() => toggleSelect(item.id)}
              style={{ cursor: 'pointer' }}
            >
              <Col xs={1}><Form.Check type="checkbox" checked={selected.has(item.id)} readOnly /></Col>
              <Col xs={2}><Image src={item.image} style={{ width: '100%', maxHeight: '60px', objectFit: 'cover' }} /></Col>
              <Col xs={7}><span style={{ color: 'white' }}>{item.title}</span></Col>
              <Col xs={2}><span style={{ color: '#999' }}>{item.media}</span></Col>
            </Row>
          ))}
          {filtered.length === 0 && <p style={{ color: '#999' }}>No items match.</p>}
        </div>
      </Modal.Body>
      <Modal.Footer>
        <span style={{ color: '#999', marginRight: 'auto' }}>{selected.size} selected</span>
        <button className="secondaryButton" onClick={onHide}>Cancel</button>
        <button className="primaryButton" onClick={handleSubmit} disabled={selected.size === 0 || submitting}>
          {submitting ? 'Adding...' : `Add ${selected.size} Item${selected.size !== 1 ? 's' : ''}`}
        </button>
      </Modal.Footer>
    </Modal>
  );
};

export default BulkAddModal;