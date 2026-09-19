import React, { useEffect, useState } from 'react';

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
      <div className="detail-panel-header">
        <span className="detail-panel-label">Your Tags</span>
      </div>
      {tags.length === 0 ? (
        <p className="media-tags-empty">Not on any of your tags yet.</p>
      ) : (
        <div className="media-tags-row">
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