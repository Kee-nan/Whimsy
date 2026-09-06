import React, { useState, useEffect } from 'react';

const formatForInput = (dateStr) => (dateStr ? new Date(dateStr).toISOString().split('T')[0] : '');

/**
 * Shows the date this item was last logged/status-changed, editable via
 * a manual override — for cases where a user finished something days
 * before they got around to logging it in Whimsy.
 */
const LoggedDateEditor = ({ mediaId, loggedAt, onSaved }) => {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(formatForInput(loggedAt));

  useEffect(() => { setDraft(formatForInput(loggedAt)); }, [loggedAt]);

  if (!loggedAt) return null; // not on any list yet — nothing to show

  const handleSave = async () => {
    const token = localStorage.getItem('user_token');
    const res = await fetch(`${process.env.REACT_APP_API_URL}/api/list/logged-at`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ mediaId, loggedAt: new Date(draft).toISOString() }),
    });
    if (res.ok) {
      const data = await res.json();
      onSaved(data.loggedAt);
      setEditing(false);
    }
  };

  return (
    <div className="logged-date-editor">
      {editing ? (
        <>
          <input type="date" value={draft} onChange={(e) => setDraft(e.target.value)} className="logged-date-input" />
          <button className="smallButton" onClick={handleSave}>Save</button>
          <button className="smallButton" onClick={() => setEditing(false)}>Cancel</button>
        </>
      ) : (
        <>
          <span>Logged on {new Date(loggedAt).toLocaleDateString()}</span>
          <button className="smallButton" onClick={() => setEditing(true)}>Edit</button>
        </>
      )}
    </div>
  );
};

export default LoggedDateEditor;