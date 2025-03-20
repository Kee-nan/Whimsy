//frontend\src\components\friends\PendingRequests.js
import React, { useEffect, useState } from 'react';

const PendingFriendRequests = () => {
  const [friendRequests, setFriendRequests] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchFriendRequests = async () => {
      const user_token = localStorage.getItem('user_token');
      if (!user_token) {
        console.error('No user token found');
        return;
      }

      try {
        const response = await fetch('/api/friends/pending', {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${user_token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setFriendRequests(data);
        } else {
          console.error('Failed to fetch friend requests');
        }
      } catch (error) {
        console.error('Error fetching friend requests:', error);
      }
    };

    fetchFriendRequests();
  }, []);

  const handleAccept = async (id) => {
    const user_token = localStorage.getItem('user_token');
    try {
      const response = await fetch('http://localhost:5000/api/friends/acceptRequest', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user_token}`,
        },
        body: JSON.stringify({ requestId: id }),
      });

      if (response.ok) {
        setFriendRequests(friendRequests.filter(request => request.id !== id));
        setMessage('Friend request accepted');
      } else {
        setMessage('Failed to accept friend request');
      }
    } catch (error) {
      setMessage('Failed to accept friend request');
      console.error(error);
    }
  };

  const handleDeny = async (id) => {
    const user_token = localStorage.getItem('user_token');
    try {
      const response = await fetch('/api/friends/declineRequest', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user_token}`,
        },
        body: JSON.stringify({ requestId: id }),
      });

      if (response.ok) {
        setFriendRequests(friendRequests.filter(request => request.id !== id));
        setMessage('Friend request declined');
      } else {
        setMessage('Failed to decline friend request');
      }
    } catch (error) {
      setMessage('Failed to decline friend request');
      console.error(error);
    }
  };

  return (
    <div className="friend-card">
      <h2 className="friend-card-text">Pending Friend Requests:</h2>
      {message && <p>{message}</p>}
      <div style={{ 
        maxHeight: '400px', 
        overflowY: 'auto', 
        border: '1px solid #ccc', 
        padding: '10px', 
        borderRadius: '8px' 
      }}>
        {friendRequests.length > 0 ? (
          friendRequests.map((request) => (
            <div key={request.id} className="friend" style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              marginBottom: '10px',
              fontSize: '1.5rem',
            }}>
              <span>{request.username}</span>
              <div>
                <button onClick={() => handleAccept(request.id)} className="primaryButton" style={{ marginRight: '10px' }}>Accept</button>
                <button onClick={() => handleDeny(request.id)} className="secondaryButton">Deny</button>
              </div>
            </div>
          ))
        ) : (
          <p>No pending friend requests.</p>
        )}
      </div>
    </div>
  );
};

export default PendingFriendRequests;


