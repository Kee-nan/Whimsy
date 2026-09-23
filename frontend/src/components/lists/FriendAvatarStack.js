import React from 'react';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';

const cap = (s) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : s);
const MAX_VISIBLE = 4;

/**
 * Overlapping circular avatars of friends who have a given item logged.
 * Hover any avatar to see the friend's name and which list status they
 * have it in.
 */
const FriendAvatarStack = ({ friends }) => {
  if (!friends || friends.length === 0) return <span className="friend-stack-empty">—</span>;

  const visible = friends.slice(0, MAX_VISIBLE);
  const overflow = friends.length - visible.length;

  return (
    <div className="friend-avatar-stack">
      {visible.map((f, idx) => (
        <OverlayTrigger key={f.userId} placement="top" overlay={<Tooltip>{f.username} — {cap(f.status)}</Tooltip>}>
          <img
            src={f.profilePicture ? `${process.env.REACT_APP_API_URL}${f.profilePicture}` : 'https://via.placeholder.com/32'}
            alt={f.username}
            className="friend-avatar-circle"
            style={{ zIndex: visible.length - idx, marginLeft: idx === 0 ? 0 : '-10px' }}
          />
        </OverlayTrigger>
      ))}
      {overflow > 0 && <div className="friend-avatar-overflow" style={{ marginLeft: '-10px' }}>+{overflow}</div>}
    </div>
  );
};

export default FriendAvatarStack;