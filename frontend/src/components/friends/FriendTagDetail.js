import React, { useEffect, useState } from 'react';
import { Container } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const PAGE_SIZE = 50;

/** Items inside one of a friend's tags — image, title, type, and the friend's own rating. */
const FriendTagDetail = ({ friendId, listId, onBack }) => {
  const [tag, setTag] = useState(null);
  const [page, setPage] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTag = async () => {
      const token = localStorage.getItem('user_token');
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/friends/${friendId}/tags/${listId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) setTag(await res.json());
    };
    fetchTag();
    setPage(1);
  }, [friendId, listId]);

  if (!tag) return null;

  const totalPages = Math.ceil(tag.items.length / PAGE_SIZE) || 1;
  const paginated = tag.items.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div>
      <div className="filter-bar">
        <div className="filter-bar-inner">
          <button className="whimsy-btn whimsy-btn-ghost" onClick={onBack}>← Back to Tags</button>
          <h4 className="filter-bar-title">{tag.name}</h4>
        </div>
      </div>

      <Container className="mt-3">
        <div className="custom-list-description-block">
          <p>{tag.description || 'No description.'}</p>
        </div>

        <div className="whimsy-table-container">
          <div className="whimsy-table-wrapper">
            <table className="table whimsy-table table-striped table-hover">
              <thead>
                <tr><th>Image</th><th>Title</th><th>Type</th><th>Friend's Rating</th></tr>
              </thead>
              <tbody>
                {paginated.map((item) => (
                  <tr key={item.id} onClick={() => navigate(`/${item.media}/${item.id.split('/').slice(1).join('/')}`)}>
                    <td><img src={item.image} alt={item.title} style={{ width: '50px' }} /></td>
                    <td>{item.title}</td>
                    <td>{item.media}</td>
                    <td>{item.friendRating != null ? `${item.friendRating}/30` : '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {paginated.length === 0 && <p style={{ color: '#999', textAlign: 'center', padding: '2rem' }}>No items in this tag.</p>}
        </div>

        {tag.items.length > 0 && (
          <div className="d-flex justify-content-center my-3">
            <button className="whimsy-btn whimsy-btn-ghost mx-2" disabled={page === 1} onClick={() => setPage((p) => p - 1)}>← Prev</button>
            <span className="align-self-center">Page {page} of {totalPages}</span>
            <button className="whimsy-btn whimsy-btn-ghost mx-2" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}>Next →</button>
          </div>
        )}
      </Container>
    </div>
  );
};

export default FriendTagDetail;