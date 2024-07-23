import React, { useState } from 'react';

const FriendRequestForm = () => {
  const [username, setUsername] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const user_token = localStorage.getItem('user_token');
    if (!user_token) {
      setMessage('User not authenticated');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/friends/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user_token}`,
        },
        body: JSON.stringify({ receiverUsername: username }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message);
      } else {
        setMessage('Failed to send friend request');
      }

      setUsername('');
    } catch (error) {
      setMessage('Failed to send friend request');
      console.error(error);
    }
  };

  return (
    <div className="card">
      <h2>Send Friend Request</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <button type="submit">Send</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default FriendRequestForm;

