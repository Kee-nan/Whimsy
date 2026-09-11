import React, { useEffect, useState } from 'react';

/** Shows which of the user's custom-list tags contain this media item — icon + name grid. */
const MediaTagsPanel = ({ mediaType, externalId }) => {
  const [tags, setTags] = useState([]);

  useEffect(() => {
    const fetchTags = async () => {
      const token = localStorage.getItem('user_token');
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/custom-lists/for-media?mediaType=${mediaType}&id=${externalId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setTags(data.filter((t) => t.included));
      }
    };
    fetchTags();
  }, [mediaType, externalId]);

  return (
    <div className="media-tags-panel">
      <h5>Your Tags</h5>
      {tags.length === 0 ? (
        <p className="media-tags-empty">Not on any of your tags yet.</p>
      ) : (
        <div className="media-tags-grid">
          {tags.map((tag) => (
            <div key={tag.id} className="media-tag-chip-icon">
              {tag.iconUrl ? (
                <img src={`${process.env.REACT_APP_API_URL}${tag.iconUrl}`} alt="" />
              ) : (
                <div className="media-tag-chip-icon-placeholder">🏷️</div>
              )}
              <span>{tag.name}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MediaTagsPanel;