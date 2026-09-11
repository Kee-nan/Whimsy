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
  const [iconFile, setIconFile] = useState(null);

  const fetchList = useCallback(async () => {
    const res = await fetch(`${process.env.REACT_APP_API_URL}/api/custom-lists/${listId}`, { headers: authHeaders() });
    if (res.ok) {
      const data = await res.json();
      setList(data);
      setItems(data.items);
      setNameDraft(data.name);
      setDescDraft(data.description || '');
    } else if (res.status === 403 || res.status === 404) {
      navigate('/lists/custom');
    }
  }, [listId, navigate]);

  useEffect(() => { fetchList(); }, [fetchList]);

  const patchList = async (fields) => {
    const res = await fetch(`${process.env.REACT_APP_API_URL}/api/custom-lists/${listId}`, {
      method: 'PUT', headers: authHeaders(),
      body: JSON.stringify({ name: nameDraft, description: descDraft, isRanked: list.is_ranked, visibility: list.visibility, ...fields }),
    });
    if (res.ok) fetchList();
  };

  const handleIconUpload = async () => {
  if (!iconFile) return;
  const formData = new FormData();
  formData.append('icon', iconFile);
  const token = localStorage.getItem('user_token');
  await fetch(`${process.env.REACT_APP_API_URL}/api/custom-lists/${listId}/icon`, {
    method: 'POST', headers: { Authorization: `Bearer ${token}` }, body: formData,
  });
  setIconFile(null);
  fetchList();
};

  // Ranked/visibility dropdowns are live — they save immediately, independent of edit mode.
  const handleRankedChange = (e) => patchList({ isRanked: e.target.value === 'ranked' });
  const handleVisibilityChange = (e) => patchList({ visibility: e.target.value });

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
    setItems(reordered);
  };

  const handleSaveEdits = async () => {
    await patchList({});
    if (list.is_ranked) {
      await fetch(`${process.env.REACT_APP_API_URL}/api/custom-lists/${listId}/reorder`, {
        method: 'PUT', headers: authHeaders(),
        body: JSON.stringify({ mediaItemIds: items.map((i) => i.mediaItemId) }),
      });
    }
    setEditMode(false);
    fetchList();
  };

  const handleCancelEdits = () => { setEditMode(false); fetchList(); };

  const handleDelete = async () => {
    if (!window.confirm(`Delete "${list.name}"? This cannot be undone.`)) return;
    await fetch(`${process.env.REACT_APP_API_URL}/api/custom-lists/${listId}`, { method: 'DELETE', headers: authHeaders() });
    navigate('/lists/custom');
  };

  const goToDetail = (item) => navigate(`/${item.media}/${item.id.split('/').slice(1).join('/')}`);

  if (!list) return null;

  return (
    <>
      <AppNavbar />

      {/* Top bar — same visual language as the Lists page filter bar */}
      <div className="whimsy-search-bar py-3">
        <Container>
          <Form className="whimsy-search-form d-flex align-items-center gap-2 flex-wrap">
            <button className="whimsy-btn whimsy-btn-ghost" onClick={() => navigate('/lists/custom')}>← Back</button>

            {editMode && (
              <>
                {list.icon_url && <img src={`${process.env.REACT_APP_API_URL}${list.icon_url}`} alt="" className="tag-icon-preview" />}
                <input type="file" accept="image/*" onChange={(e) => setIconFile(e.target.files[0])} style={{ width: '160px' }} />
                <button className="whimsy-btn whimsy-btn-ghost" onClick={handleIconUpload} disabled={!iconFile}>Set Icon</button>
              </>
            )}

            {editMode ? (
              <Form.Control className="whimsy-form-control" value={nameDraft} onChange={(e) => setNameDraft(e.target.value)} />
            ) : (
              <h4 style={{ color: 'white', margin: 0 }}>{list.name}</h4>
            )}

            <Form.Select style={{ width: '140px' }} value={list.is_ranked ? 'ranked' : 'unranked'} onChange={handleRankedChange}>
              <option value="ranked">Ranked</option>
              <option value="unranked">Unranked</option>
            </Form.Select>

            <Form.Select style={{ width: '150px' }} value={list.visibility} onChange={handleVisibilityChange}>
              <option value="public">Public</option>
              <option value="friends">Friends Only</option>
              <option value="private">Private</option>
            </Form.Select>

            {list.isOwner && (
              editMode ? (
                <>
                  <button className="whimsy-btn" onClick={() => setShowBulkAdd(true)}>+ Add Items</button>
                  <button className="whimsy-btn" onClick={handleSaveEdits}>Save Changes</button>
                  <button className="whimsy-btn whimsy-btn-ghost" onClick={handleCancelEdits}>Cancel</button>
                  <button className="whimsy-btn whimsy-btn-ghost" onClick={handleDelete}>Delete List</button>
                </>
              ) : (
                <button className="whimsy-btn" onClick={() => setEditMode(true)}>Edit List</button>
              )
            )}
          </Form>
        </Container>
      </div>

      <Container className="mt-4">
        {/* Centered description block */}
        <div className="custom-list-description-block">
          {editMode ? (
            <Form.Control as="textarea" rows={2} value={descDraft} onChange={(e) => setDescDraft(e.target.value)} />
          ) : (
            <p>{list.description || 'No description.'}</p>
          )}
        </div>

        {list.is_ranked && editMode && <p style={{ color: '#999', textAlign: 'center' }}>Drag rows to reorder, then Save Changes.</p>}

        <div className="whimsy-table-container">
          <div className="whimsy-table-wrapper">
            <table className="table whimsy-table table-striped table-hover">
              <thead>
                <tr>
                  {list.is_ranked && <th style={{ width: '60px' }}>#</th>}
                  <th>Image</th><th>Title</th><th>Type</th>
                  {editMode && <th style={{ width: '80px' }}>Remove</th>}
                </tr>
              </thead>
              {editMode && list.is_ranked ? (
                <DragDropContext onDragEnd={handleDragEnd}>
                  <Droppable droppableId="custom-list-items">
                    {(provided) => (
                      <tbody ref={provided.innerRef} {...provided.droppableProps}>
                        {items.map((item, index) => (
                          <Draggable key={item.id} draggableId={item.id} index={index}>
                            {(dragProvided, dragSnapshot) => (
                              <tr ref={dragProvided.innerRef} {...dragProvided.draggableProps} {...dragProvided.dragHandleProps}
                                  style={{ ...dragProvided.draggableProps.style, backgroundColor: dragSnapshot.isDragging ? '#37304a' : undefined, cursor: 'grab' }}>
                                <td>#{index + 1}</td>
                                <td><img src={item.image} alt={item.title} style={{ width: '50px' }} /></td>
                                <td>{item.title}</td>
                                <td>{item.media}</td>
                                <td><button className="whimsy-btn whimsy-btn-ghost" onClick={() => handleRemove(item.id)}>✕</button></td>
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
                    <tr key={item.id} onClick={() => !editMode && goToDetail(item)} style={{ cursor: editMode ? 'default' : 'pointer' }}>
                      {list.is_ranked && <td>#{index + 1}</td>}
                      <td><img src={item.image} alt={item.title} style={{ width: '50px' }} /></td>
                      <td>{item.title}</td>
                      <td>{item.media}</td>
                      {editMode && <td><button className="whimsy-btn whimsy-btn-ghost" onClick={() => handleRemove(item.id)}>✕</button></td>}
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