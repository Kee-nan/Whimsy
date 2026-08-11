import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import AppNavbar from '../components/Navbar';

const authHeaders = () => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${localStorage.getItem('user_token')}`,
});

const CustomListDetail = () => {
  const { listId } = useParams();
  const navigate = useNavigate();
  const [list, setList] = useState(null);

  const fetchList = useCallback(async () => {
    const res = await fetch(`${process.env.REACT_APP_API_URL}/api/custom-lists/${listId}`, { headers: authHeaders() });
    if (res.ok) setList(await res.json());
  }, [listId]);

  useEffect(() => { fetchList(); }, [fetchList]);

  const handleRemove = async (mediaItemId) => {
    await fetch(`${process.env.REACT_APP_API_URL}/api/custom-lists/${listId}/items/${mediaItemId}`, {
      method: 'DELETE', headers: authHeaders(),
    });
    fetchList();
  };

  if (!list) return null;

  return (
    <>
      <AppNavbar />
      <Container className="mt-5">
        <button className="secondaryButton mb-3" onClick={() => navigate('/lists/custom')}>← Back to My Lists</button>
        <h2 style={{ color: 'white' }}>{list.name}</h2>
        <p style={{ color: '#ccc' }}>{list.description}</p>

        <div className="row mt-4">
          {list.items.map((item) => (
            <div className="col-md-3 mb-4" key={item.id}>
              <div className="homepage-card" style={{ padding: '0.75rem' }}>
                <img src={item.image} alt={item.title} style={{ width: '100%', borderRadius: '6px' }} />
                <p style={{ color: 'white', marginTop: '0.5rem', marginBottom: '0.25rem' }}>{item.title}</p>
                <button className="secondaryButton" onClick={() => handleRemove(item.id.split('/').pop())}>Remove</button>
              </div>
            </div>
          ))}
          {list.items.length === 0 && <p style={{ color: '#999' }}>No items in this list yet.</p>}
        </div>
      </Container>
    </>
  );
};

export default CustomListDetail;