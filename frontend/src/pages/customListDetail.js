import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Form } from 'react-bootstrap';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import BulkAddModal from '../components/lists/BulkAddModal';
import AppNavbar from '../components/Navbar';

const authHeaders = () => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${localStorage.getItem('user_token')}`,
});

const CustomListDetail = () => {
  const { listId } = useParams();
  const navigate = useNavigate();
  const [list, setList] = useState(null);
  const [items, setItems] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [showBulkAdd, setShowBulkAdd] = useState(false);

  const [nameDraft, setNameDraft] = useState('');
  const [descDraft, setDescDraft] = useState('');
  const [rankedDraft, setRankedDraft] = useState(false);
  const [visibilityDraft, setVisibilityDraft] = useState('public');

  const fetchList = useCallback(async () => {
    const res = await fetch(`${process.env.REACT_APP_API_URL}/api/custom-lists/${listId}`, { headers: authHeaders() });
    if (res.ok) {
      const data = await res.json();
      setList(data);
      setItems(data.items);
      setNameDraft(data.name);
      setDescDraft(data.description || '');
      setRankedDraft(data.is_ranked);
      setVisibilityDraft(data.visibility);
    } else if (res.status === 403 || res.status === 404) {
      navigate('/lists/custom');
    }
  }, [listId, navigate]);

  useEffect(() => { fetchList(); }, [fetchList]);

  // Whether to show rank numbers / enable dragging right now: while
  // editing, reflect the (possibly still-unsaved) ranked toggle; while
  // viewing, reflect the persisted value.
  const showRanked = editMode ? rankedDraft : list?.is_ranked;

  const handleRemove = async (mediaId) => {
    await fetch(`${process.env.REACT_APP_API_URL}/api/custom-lists/${listId}/items`, {
      method: 'DELETE', headers: authHeaders(), body: JSON.stringify({ mediaId }),
    });
    fetchList();
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;
    const reordered = Array.from(items);
    const [moved] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, moved);
    setItems(reordered); // local optimistic reorder — persisted only on Save
  };

  const handleSave = async () => {
    await fetch(`${process.env.REACT_APP_API_URL}/api/custom-lists/${listId}`, {
      method: 'PUT', headers: authHeaders(),
      body: JSON.stringify({ name: nameDraft, description: descDraft, isRanked: rankedDraft, visibility: visibilityDraft }),
    });

    if (rankedDraft) {
      const mediaItemIds = items.map((item) => item.mediaItemId);
      await fetch(`${process.env.REACT_APP_API_URL}/api/custom-lists/${listId}/reorder`, {
        method: 'PUT', headers: authHeaders(), body: JSON.stringify({ mediaItemIds }),
      });
    }

    setEditMode(false);
    fetchList();
  };

  const handleCancel = () => {
    setEditMode(false);
    fetchList(); // discard unsaved edits / drag reordering
  };

  const handleDelete = async () => {
    if (!window.confirm(`Delete "${list.name}"? This cannot be undone.`)) return;
    await fetch(`${process.env.REACT_APP_API_URL}/api/custom-lists/${listId}`, { method: 'DELETE', headers: authHeaders() });
    navigate('/lists/custom');
  };

  const goToDetail = (item) => {
    navigate(`/${item.media}/${item.id.split('/').slice(1).join('/')}`);
  };

  if (!list) return null;

  return (
    <>
      <AppNavbar />
      <Container className="mt-5" style={{ color: 'white' }}>
        <button className="secondaryButton mb-3" onClick={() => navigate('/lists/custom')}>← Back to My Lists</button>

        <div className="custom-list-header">
          {editMode ? (
            <>
              <Form.Control className="review-modal-input mb-2" value={nameDraft} onChange={(e) => setNameDraft(e.target.value)} />
              <Form.Control as="textarea" rows={2} className="review-modal-input mb-2" value={descDraft} onChange={(e) => setDescDraft(e.target.value)} />
              <div className="d-flex gap-3 align-items-center mb-2 flex-wrap">
                <Form.Check
                  type="checkbox"
                  label="Ranked list (order matters)"
                  checked={rankedDraft}
                  onChange={(e) => setRankedDraft(e.target.checked)}
                />
                <Form.Select style={{ width: '180px' }} value={visibilityDraft} onChange={(e) => setVisibilityDraft(e.target.value)}>
                  <option value="public">Public</option>
                  <option value="friends">Friends Only</option>
                  <option value="private">Private</option>
                </Form.Select>
              </div>
            </>
          ) : (
            <>
              <h2>{list.name}</h2>
              <p style={{ color: '#ccc' }}>{list.description}</p>
              <div className="custom-list-badges">
                <span className="list-badge">{list.is_ranked ? 'Ranked' : 'Unranked'}</span>
                <span className="list-badge">
                  {list.visibility === 'public' ? 'Public' : list.visibility === 'friends' ? 'Friends Only' : 'Private'}
                </span>
              </div>
            </>
          )}

          {list.isOwner && (
            <div className="d-flex gap-2 mt-3 flex-wrap">
              {editMode ? (
                <>
                  <button className="primaryButton" onClick={() => setShowBulkAdd(true)}>+ Add Items</button>
                  <button className="primaryButton" onClick={handleSave}>Save Changes</button>
                  <button className="secondaryButton" onClick={handleCancel}>Cancel</button>
                  <button className="secondaryButton" onClick={handleDelete}>Delete List</button>
                </>
              ) : (
                <button className="secondaryButton" onClick={() => setEditMode(true)}>Edit List</button>
              )}
            </div>
          )}
        </div>

        {showRanked && editMode && (
          <p style={{ color: '#999', marginTop: '0.5rem' }}>Drag rows to reorder, then Save Changes.</p>
        )}

        <div className="whimsy-table-container mt-4">
          <div className="whimsy-table-wrapper">
            <table className="table whimsy-table table-striped table-hover">
              <thead>
                <tr>
                  {showRanked && <th style={{ width: '60px' }}>#</th>}
                  <th>Image</th>
                  <th>Title</th>
                  <th>Type</th>
                  {editMode && <th style={{ width: '80px' }}>Remove</th>}
                </tr>
              </thead>

              {editMode && showRanked ? (
                <DragDropContext onDragEnd={handleDragEnd}>
                  <Droppable droppableId="custom-list-items">
                    {(provided) => (
                      <tbody ref={provided.innerRef} {...provided.droppableProps}>
                        {items.map((item, index) => (
                          <Draggable key={item.id} draggableId={item.id} index={index}>
                            {(dragProvided, dragSnapshot) => (
                              <tr
                                ref={dragProvided.innerRef}
                                {...dragProvided.draggableProps}
                                {...dragProvided.dragHandleProps}
                                style={{
                                  ...dragProvided.draggableProps.style,
                                  backgroundColor: dragSnapshot.isDragging ? '#3a3a3a' : undefined,
                                  cursor: 'grab',
                                }}
                              >
                                <td>#{index + 1}</td>
                                <td><img src={item.image} alt={item.title} style={{ width: '50px' }} /></td>
                                <td>{item.title}</td>
                                <td>{item.media}</td>
                                <td>
                                  <button className="secondaryButton" onClick={() => handleRemove(item.id)}>✕</button>
                                </td>
                              </tr>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </tbody>
                    )}
                  </Droppable>
                </DragDropContext>
              ) : (
                <tbody>
                  {items.map((item, index) => (
                    <tr
                      key={item.id}
                      onClick={() => !editMode && goToDetail(item)}
                      style={{ cursor: editMode ? 'default' : 'pointer' }}
                    >
                      {showRanked && <td>#{index + 1}</td>}
                      <td><img src={item.image} alt={item.title} style={{ width: '50px' }} /></td>
                      <td>{item.title}</td>
                      <td>{item.media}</td>
                      {editMode && (
                        <td>
                          <button className="secondaryButton" onClick={() => handleRemove(item.id)}>✕</button>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              )}
            </table>
          </div>
          {items.length === 0 && <p style={{ color: '#999', textAlign: 'center', padding: '2rem' }}>No items in this list yet.</p>}
        </div>
      </Container>

      <BulkAddModal show={showBulkAdd} onHide={() => setShowBulkAdd(false)} listId={listId} onDone={fetchList} />
    </>
  );
};

export default CustomListDetail;