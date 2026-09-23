import React, { useState, useEffect } from 'react';

const formatForInput = (dateStr) => (dateStr ? new Date(dateStr).toISOString().split('T')[0] : '');

const LoggedDateEditor = ({ mediaId, loggedAt, onSaved }) => {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(formatForInput(loggedAt));

  useEffect(() => { setDraft(formatForInput(loggedAt)); }, [loggedAt]);

  const handleSave = async () => {
    const token = localStorage.getItem('user_token');
    const res = await fetch(`${process.env.REACT_APP_API_URL}/api/list/logged-at`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ mediaId, loggedAt: new Date(draft || Date.now()).toISOString() }),
    });
    if (res.ok) {
      const data = await res.json();
      onSaved(data.loggedAt);
      setEditing(false);
    } else {
      const err = await res.json().catch(() => ({}));
      // Most common cause: this item isn't on any list yet, so there's
      // no list_entries row to attach a date to.
      alert(err.message || 'Could not save — add this item to a list first.');
    }
  };

  return (
    <div className="logged-date-editor">
      <div className="detail-panel-header">
        <span className="detail-panel-label">Logged On:</span>
      </div>
      {editing ? (
        <div className="logged-date-edit-row">
          <input type="date" value={draft} onChange={(e) => setDraft(e.target.value)} className="logged-date-input" />
          <button className="smallButton" onClick={handleSave}>Save</button>
        </div>
      ) : (
        <div className="detail-panel-value">{loggedAt ? new Date(loggedAt).toLocaleDateString() : 'N/A'}</div>
      )}

      <button className="smallButton" onClick={() => setEditing((e) => !e)}>{editing ? 'Cancel' : 'Edit'}</button>
    </div>
  );
};

export default LoggedDateEditor;