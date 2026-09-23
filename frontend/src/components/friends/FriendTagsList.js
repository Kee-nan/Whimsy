import React, { useEffect, useState } from 'react';
import { Container, Form } from 'react-bootstrap';

const visibilityLabel = (v) => (v === 'public' ? 'Public' : 'Friends Only');

/** All of a friend's tags (excluding private ones) — searchable, click into one to see its items. */
const FriendTagsList = ({ friendId, friendUsername, onSelectTag, titleText, toggleControl }) => {
  const [tags, setTags] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchTags = async () => {
      const token = localStorage.getItem('user_token');
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/friends/${friendId}/tags`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) setTags(await res.json());
    };
    fetchTags();
  }, [friendId]);

  const filtered = tags.filter((t) => t.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div>
      <div className="filter-bar">
        <div className="filter-bar-inner">
          <h4 className="filter-bar-title">{titleText}</h4>
          {toggleControl}
          <Form.Control className="whimsy-form-control filter-bar-search" placeholder="Search tags..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
      </div>

      <Container className="mt-4">
        <div className="whimsy-table-container">
          <div className="whimsy-table-wrapper">
            <table className="table whimsy-table table-striped table-hover">
              <thead>
                <tr><th>Tag Title</th><th>Type</th><th>Visibility</th><th># Items</th><th>Description</th></tr>
              </thead>
              <tbody>
                {filtered.map((tag) => (
                  <tr key={tag.id} onClick={() => onSelectTag(tag.id)}>
                    <td style={{ textAlign: 'left', fontWeight: 'bold' }}>{tag.name}</td>
                    <td>{tag.is_ranked ? 'Ranked' : 'Unranked'}</td>
                    <td>{visibilityLabel(tag.visibility)}</td>
                    <td>{tag.item_count}</td>
                    <td style={{ textAlign: 'left', color: '#bbb' }}>{tag.description || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filtered.length === 0 && <p style={{ color: '#999', textAlign: 'center', padding: '2rem' }}>{friendUsername} has no visible tags yet.</p>}
        </div>
      </Container>
    </div>
  );
};

export default FriendTagsList;