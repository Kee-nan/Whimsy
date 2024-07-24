// frontend\src\components\friends\FriendsList.js
// frontend/src/components/friends/FriendsList.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const FriendsList = () => {
  const [friends, setFriends] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/friends/friends', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('user_token')}`
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

  const handleViewList = (username, id) => {
    navigate(`/lists/${username}/${id}`);
  };

  return (
    <div className="card">
      <h2>Friends</h2>
      <div>
        {friends.map((friend) => (
          <div key={friend.id} className="friend">
            <span>{friend.username}</span>
            <button onClick={() => handleViewList(friend.username, friend.id)}>View List</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FriendsList;



