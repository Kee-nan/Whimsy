import React, { useState } from 'react';
import { Modal } from 'react-bootstrap';
import '../../styles/detailpage.css';

const capitalize = (s) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : s);

/**
 * Shows every friend who has this media item logged (on a list and/or
 * reviewed). Clicking a row opens a modal with that friend's full
 * written review, if they left one.
 */
const FriendActivityList = ({ friendActivity }) => {
  const [selected, setSelected] = useState(null);

  return (
    <div className="friend-activity-box">
      <h5>Friends Who Logged This</h5>

      {(!friendActivity || friendActivity.length === 0) ? (
        <p className="friend-activity-empty">None of your friends have logged this yet.</p>
      ) : (
        <div className="friend-activity-list">
          {friendActivity.map((entry) => (
            <div
              key={entry.user_id}
              className="friend-activity-row"
              onClick={() => setSelected(entry)}
            >
              <span className="friend-activity-name">{entry.username}</span>
              <span className="friend-activity-status">
                {entry.list_status ? capitalize(entry.list_status) : 'Not on a list'}
              </span>
              <span className="friend-activity-rating">
                {entry.rating != null ? `${entry.rating}/30` : 'No rating'}
              </span>
            </div>
          ))}
        </div>
      )}

      <Modal show={!!selected} onHide={() => setSelected(null)} centered className="custom-modal">
        <Modal.Header closeButton>
          <Modal.Title>{selected?.username}'s Review</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selected?.rating != null && <p><strong>Rating:</strong> {selected.rating}/30</p>}
          <p>{selected?.review_text || 'No written review left.'}</p>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default FriendActivityList;