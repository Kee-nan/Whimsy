import React, { useEffect, useState } from 'react';
import { Dropdown, Form } from 'react-bootstrap';

/**
 * Dropdown with a checkbox per custom list — lets a user add/remove a
 * single media item to/from any number of their custom lists at once,
 * directly from the detail page. `autoClose="outside"` is required so
 * clicking a checkbox doesn't immediately close the Bootstrap dropdown.
 */
const CustomListSelector = ({ mediaId, mediaType, title, image }) => {
  const [lists, setLists] = useState([]);
  const [loadingId, setLoadingId] = useState(null);

  const fetchMembership = async () => {
    const token = localStorage.getItem('user_token');
    const externalId = mediaId.split('/').slice(1).join('/');
    const res = await fetch(
      `${process.env.REACT_APP_API_URL}/api/custom-lists/for-media?mediaType=${mediaType}&id=${externalId}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    if (res.ok) setLists(await res.json());
  };

  useEffect(() => { fetchMembership(); }, [mediaId]);

  const handleToggle = async (list) => {
    setLoadingId(list.id);
    const token = localStorage.getItem('user_token');
    const headers = { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` };
    try {
      if (list.included) {
        await fetch(`${process.env.REACT_APP_API_URL}/api/custom-lists/${list.id}/items`, {
          method: 'DELETE', headers, body: JSON.stringify({ mediaId }),
        });
      } else {
        await fetch(`${process.env.REACT_APP_API_URL}/api/custom-lists/${list.id}/items`, {
          method: 'POST', headers,
          body: JSON.stringify({ media: { id: mediaId, media: mediaType, title, image } }),
        });
      }
      await fetchMembership();
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <Dropdown autoClose="outside">
      <Dropdown.Toggle variant="secondary">Add to Custom List</Dropdown.Toggle>
      <Dropdown.Menu style={{ padding: '0.75rem 1rem', minWidth: '240px' }}>
        {lists.length === 0 ? (
          <div style={{ color: '#999' }}>You have no custom lists yet.</div>
        ) : (
          lists.map((list) => (
            <Form.Check
              key={list.id}
              type="checkbox"
              id={`custom-list-${list.id}`}
              label={list.name}
              checked={list.included}
              disabled={loadingId === list.id}
              onChange={() => handleToggle(list)}
              className="mb-2"
            />
          ))
        )}
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default CustomListSelector;