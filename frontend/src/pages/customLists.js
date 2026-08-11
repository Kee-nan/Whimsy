import React, { useEffect, useState } from 'react';
import { Container, Modal, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import AppNavbar from '../components/Navbar';

const authHeaders = () => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${localStorage.getItem('user_token')}`,
});

const CustomLists = () => {
  const [lists, setLists] = useState([]);
  const [showCreate, setShowCreate] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const navigate = useNavigate();

  const fetchLists = async () => {
    const res = await fetch(`${process.env.REACT_APP_API_URL}/api/custom-lists`, { headers: authHeaders() });
    if (res.ok) setLists(await res.json());
  };

  useEffect(() => { fetchLists(); }, []);

  const handleCreate = async () => {
    if (!name.trim()) return;
    const res = await fetch(`${process.env.REACT_APP_API_URL}/api/custom-lists`, {
      method: 'POST', headers: authHeaders(),
      body: JSON.stringify({ name, description, isPublic: true }),
    });
    if (res.ok) {
      setShowCreate(false);
      setName(''); setDescription('');
      fetchLists();
    }
  };

  return (
    <>
      <AppNavbar />
      <Container className="mt-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 style={{ color: 'white' }}>My Lists</h2>
          <button className="primaryButton" onClick={() => setShowCreate(true)}>+ New List</button>
        </div>

        <div className="row">
          {lists.map((list) => (
            <div className="col-md-4 mb-4" key={list.id}>
              <div
                className="homepage-card"
                style={{ cursor: 'pointer', padding: '1.5rem' }}
                onClick={() => navigate(`/lists/custom/${list.id}`)}
              >
                <h4 style={{ color: 'white' }}>{list.name}</h4>
                <p style={{ color: '#ccc' }}>{list.description || 'No description'}</p>
                <p style={{ color: '#999', margin: 0 }}>{list.item_count} item{list.item_count !== '1' ? 's' : ''}</p>
              </div>
            </div>
          ))}
          {lists.length === 0 && <p style={{ color: '#999' }}>You haven't created any lists yet.</p>}
        </div>
      </Container>

      <Modal show={showCreate} onHide={() => setShowCreate(false)} centered className="custom-modal">
        <Modal.Header closeButton><Modal.Title>New List</Modal.Title></Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label className="review-modal-label">Name</Form.Label>
            <Form.Control className="review-modal-input" value={name} onChange={(e) => setName(e.target.value)} />
          </Form.Group>
          <Form.Group>
            <Form.Label className="review-modal-label">Description</Form.Label>
            <Form.Control as="textarea" rows={3} className="review-modal-input" value={description} onChange={(e) => setDescription(e.target.value)} />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <button className="secondaryButton" onClick={() => setShowCreate(false)}>Cancel</button>
          <button className="primaryButton" onClick={handleCreate}>Create</button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default CustomLists;