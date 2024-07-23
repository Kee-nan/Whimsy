//frontend\src\components\friends\SendRequest.js
// frontend\src\components\friends\FriendsList.js
import React, { useEffect, useState } from 'react';

const FriendsList = () => {
  const [friends, setFriends] = useState([]);

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/friends/friends', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('user_token')}` // Adjust as needed
          }
        });
        
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        
        const data = await response.json();
        setFriends(data);
      } catch (error) {
        console.error('Error fetching friends list:', error);
      }
    };

    fetchFriends();
  }, []);

  return (
    <div className="card">
      <h2>Friends</h2>
      <div>
        {friends.map((friend) => (
          <div key={friend.id} className="friend">
            <span>{friend.username}</span>
            <button>View List</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FriendsList;

