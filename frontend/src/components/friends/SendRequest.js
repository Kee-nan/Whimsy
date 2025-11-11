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
    <div className="friend-card">
      <h2 className="friend-card-text">Send Friend Request</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={{
            width: '80%', // Makes it wider
            height: '50px', // Makes it taller
            borderRadius: '25px', // Rounded edges
            backgroundColor: '#333', // Dark interior background
            color: '#fff', // White text color
            border: '1px solid #555', // Optional border for visibility
            padding: '0 15px', // Padding for comfortable typing
            fontSize: '1rem' // Adjust text size if needed
          }}
        />
        <button type="submit" className='primaryButton'>Send</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default FriendRequestForm;

