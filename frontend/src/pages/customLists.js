import React, { useEffect, useState } from 'react';
import { Container, Modal, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import AppNavbar from '../components/Navbar';

const authHeaders = () => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${localStorage.getItem('user_token')}`,
});

const visibilityLabel = (v) => (
  v === 'public'
    ? 'Public'
    : v === 'friends'
      ? 'Friends Only'
      : 'Private'
);

const CustomLists = () => {
  const [lists, setLists] = useState([]);
  const [showCreate, setShowCreate] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isRanked, setIsRanked] = useState(false);
  const [visibility, setVisibility] = useState('public');
  const [search, setSearch] = useState('');

  const navigate = useNavigate();

  const filteredLists = lists.filter((l) =>
    l.name.toLowerCase().includes(search.toLowerCase())
  );

  const fetchLists = async () => {
    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/api/custom-lists`,
        {
          headers: authHeaders(),
        }
      );

      if (res.ok) {
        setLists(await res.json());
      }
    } catch (err) {
      console.error('Failed to fetch custom lists:', err);
    }
  };

  useEffect(() => {
    fetchLists();
  }, []);

  const handleCreate = async () => {
    if (!name.trim()) return;

    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/api/custom-lists`,
        {
          method: 'POST',
          headers: authHeaders(),
          body: JSON.stringify({
            name,
            description,
            isRanked,
            visibility,
          }),
        }
      );

      if (res.ok) {
        setShowCreate(false);
        setName('');
        setDescription('');
        setIsRanked(false);
        setVisibility('public');

        fetchLists();
      }
    } catch (err) {
      console.error('Failed to create custom list:', err);
    }
  };

  return (
    <>
      <AppNavbar />

      <div className="whimsy-search-bar py-3">
          <Container>
            <Form className="whimsy-search-form d-flex align-items-center gap-2 flex-wrap">
              <h4
                style={{
                  color: 'white',
                  margin: 0,
                  whiteSpace: 'nowrap',
                }}
              >
                Custom List Tags
              </h4>

              <Form.Control
                className="whimsy-form-control"
                placeholder="Search tags..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />

              <button
                type="button"
                className="whimsy-btn"
                onClick={() => setShowCreate(true)}
              >
                + New List
              </button>
            </Form>
          </Container>
        </div>

      <Container className="mt-5">
        <div className="whimsy-table-container">
          <div className="whimsy-table-wrapper">
            <table className="table whimsy-table table-striped table-hover">
              <thead>
                <tr>
                  <th>Tag Title</th>
                  <th>Type</th>
                  <th>Visibility</th>
                  <th># Items</th>
                  <th>Description</th>
                  <th>Created</th>
                  <th>Last Edited</th>
                </tr>
              </thead>

              <tbody>
                {filteredLists.map((list) => (
                  <tr
                    key={list.id}
                    onClick={() => navigate(`/lists/custom/${list.id}`)}
                    style={{ cursor: 'pointer' }}
                  >
                    <td
                      style={{
                        textAlign: 'left',
                        fontWeight: 'bold',
                      }}
                    >
                      {list.name}
                    </td>

                    <td>
                      {list.is_ranked ? 'Ranked' : 'Unranked'}
                    </td>

                    <td>
                      {visibilityLabel(list.visibility)}
                    </td>

                    <td>
                      {list.item_count}
                    </td>

                    <td
                      style={{
                        textAlign: 'left',
                        color: '#bbb',
                      }}
                    >
                      {list.description || '—'}
                    </td>

                    <td>
                      {new Date(list.created_at).toLocaleDateString()}
                    </td>

                    <td>
                      {new Date(list.updated_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredLists.length === 0 && (
            <p
              style={{
                color: '#999',
                textAlign: 'center',
                padding: '2rem',
              }}
            >
              {search
                ? 'No lists match your search.'
                : "You haven't created any lists yet."}
            </p>
          )}
        </div>
      </Container>

      <Modal
        show={showCreate}
        onHide={() => setShowCreate(false)}
        centered
        className="custom-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title>New List</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label className="review-modal-label">
              Name
            </Form.Label>

            <Form.Control
              className="review-modal-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label className="review-modal-label">
              Description
            </Form.Label>

            <Form.Control
              as="textarea"
              rows={3}
              className="review-modal-input"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Check
              type="checkbox"
              label="Ranked list (order matters)"
              checked={isRanked}
              onChange={(e) => setIsRanked(e.target.checked)}
            />
          </Form.Group>

          <Form.Group>
            <Form.Label className="review-modal-label">
              Visibility
            </Form.Label>

            <Form.Select
              className="review-modal-input"
              value={visibility}
              onChange={(e) => setVisibility(e.target.value)}
            >
              <option value="public">Public</option>
              <option value="friends">Friends Only</option>
              <option value="private">Private</option>
            </Form.Select>
          </Form.Group>
        </Modal.Body>

        <Modal.Footer>
          <button
            type="button"
            className="whimsy-btn whimsy-btn-ghost"
            onClick={() => setShowCreate(false)}
          >
            Cancel
          </button>

          <button
            type="button"
            className="whimsy-btn"
            onClick={handleCreate}
          >
            Create
          </button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default CustomLists;

