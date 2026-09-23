import React, { useState, useMemo } from 'react';
import { Modal, Form } from 'react-bootstrap';

const authHeaders = () => ({ 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('user_token')}` });
const aspectClass = (media) => (media === 'album' ? 'square' : media === 'game' ? 'landscape' : 'portrait');

const FavoritesModal = ({ show, onHide, allLists, userFavorites, setUserFavorites }) => {
  const [draft, setDraft] = useState(userFavorites);
  const [search, setSearch] = useState('');

  const allItems = useMemo(() => [
    ...(allLists.completed || []), ...(allLists.current || []), ...(allLists.futures || []),
  ], [allLists]);

  const searchResults = allItems.filter((item) =>
    !draft.some((f) => f?.id === item.id) && (!search || item.title.toLowerCase().includes(search.toLowerCase()))
  );

  const handleAdd = (item) => {
    const emptyIndex = draft.findIndex((s) => !s);
    if (emptyIndex === -1) return alert('Favorites are full (8/8). Remove one first.');
    const next = [...draft];
    next[emptyIndex] = item;
    setDraft(next);
  };

  const handleRemove = (index) => {
    const next = [...draft];
    next[index] = null;
    setDraft(next);
  };

  const handleSave = async () => {
    const slots = draft.map((item) => (item ? item.id : null)); // resolved to media_item_id server-side via upsert
    await fetch(`${process.env.REACT_APP_API_URL}/api/accounts/favorites`, {
      method: 'PATCH', headers: authHeaders(), body: JSON.stringify({ favorites: draft }),
    });
    setUserFavorites(draft.filter(Boolean));
    onHide();
  };

  const filledCount = draft.filter(Boolean).length;

  return (
    <Modal show={show} onHide={onHide} size="lg" centered className="custom-modal">
      <Modal.Header closeButton><Modal.Title>Edit Favorites</Modal.Title></Modal.Header>
      <Modal.Body>
        <div className="favorites-modal-columns">
          <div className="favorites-modal-col">
            <h5>Your Favorites ({filledCount}/8):</h5>
            <div className="favorites-modal-scroll">
              {draft.map((item, index) => (
                <div key={index} className="favorites-modal-row">
                  <span className="favorites-modal-letter">{String.fromCharCode(65 + index)}.</span>
                  {item ? (
                    <>
                      <img src={item.image} alt={item.title} className={`fav-modal-thumb ${aspectClass(item.media)}`} />
                      <span className="favorites-modal-title">{item.title}</span>
                      <button className="whimsy-btn whimsy-btn-ghost" onClick={() => handleRemove(index)}>✕</button>
                    </>
                  ) : (
                    <span className="favorites-modal-empty">Empty slot</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="favorites-modal-col">
            <Form.Control placeholder="Search your lists..." value={search} onChange={(e) => setSearch(e.target.value)} className="mb-2" />
            <div className="favorites-modal-scroll">
              {searchResults.map((item) => (
                <div key={item.id} className="favorites-modal-row">
                  <img src={item.image} alt={item.title} className={`fav-modal-thumb ${aspectClass(item.media)}`} />
                  <span className="favorites-modal-title">{item.title}</span>
                  <button className="whimsy-btn whimsy-btn-ghost" onClick={() => handleAdd(item)}>Add</button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <button className="whimsy-btn whimsy-btn-ghost" onClick={onHide}>Cancel</button>
        <button className="whimsy-btn" onClick={handleSave}>Save Favorites</button>
      </Modal.Footer>
    </Modal>
  );
};

export default FavoritesModal;

