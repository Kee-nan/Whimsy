import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/profilepage.css';

const cap = (s) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : s);

const ACTION_LABELS = {
  list_add: (d) => `added to ${cap(d.status)}`,
  list_status_change: (d) => `moved from ${cap(d.from)} to ${cap(d.to)}`,
  review_add: (d) => `rated ${d.rating}/30`,
  review_update: (d) => `updated their rating to ${d.rating}/30`,
};

const timeAgo = (dateStr) => {
  const seconds = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  const intervals = [['year', 31536000], ['month', 2592000], ['day', 86400], ['hour', 3600], ['minute', 60]];
  for (const [label, secs] of intervals) {
    const count = Math.floor(seconds / secs);
    if (count >= 1) return `${count} ${label}${count > 1 ? 's' : ''} ago`;
  }
  return 'just now';
};

/**
 * Shows the last 5 actions (list adds, status changes, reviews) for
 * either the logged-in user or a friend, reverse chronological.
 */
const ActivityFeed = ({ activity, title = 'Recent Activity' }) => {
  const navigate = useNavigate();

  return (
    <div className="activity-feed-box bordered">
      <h4>{title}</h4>
      {(!activity || activity.length === 0) ? (
        <p className="activity-feed-empty">No recent activity.</p>
      ) : (
        <div className="activity-feed-list">
          {activity.map((entry, idx) => (
            <div
              key={idx}
              className="activity-feed-row"
              onClick={() => entry.media && navigate(`/${entry.media.media}/${entry.media.id.split('/').slice(1).join('/')}`)}
            >
              {entry.media?.image && <img src={entry.media.image} alt={entry.media.title} className="activity-feed-thumb" />}
              <div className="activity-feed-text">
                <span className="activity-feed-title">{entry.media?.title || 'Unknown'}</span>
                <span className="activity-feed-action">
                  {ACTION_LABELS[entry.actionType]?.(entry.detail) || entry.actionType}
                </span>
              </div>
              <span className="activity-feed-time">{timeAgo(entry.createdAt)}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ActivityFeed;