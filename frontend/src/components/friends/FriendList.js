// frontend\src\components\friends\FriendsList.js
// frontend/src/components/friends/FriendsList.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const FriendsList = () => {
  const [friends, setFriends] = useState([]);
  const navigate = useNavigate();

  //Effect that uses backend api to fetch the users frined from the database and loads it into friends var
  useEffect(() => {
    const fetchFriends = async () => {
      //API Call
      try {
        const response = await fetch('http://localhost:5000/api/friends/friends', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('user_token')}`,
          },
        });

        //Error handling
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        //Respose data set to variable
        const data = await response.json();
        setFriends(data);
      
      //Error handling
      } catch (error) {
        console.error('Error fetching friends list:', error);
      }
    };

    fetchFriends();
  }, []);

  //Function that navigates to the page of the friend the user wants to view
  const handleViewList = (username, id) => {
    navigate(`/lists/${username}/${id}`);
  };

  return (
    <div className="friend-card">
      <h2 className="friend-card-text">Friends:</h2>
      {/* Scrollable Container */}
      <div style={{ 
        maxHeight: '400px', 
        overflowY: 'auto', 
        border: '1px solid #ccc', 
        padding: '10px', 
        borderRadius: '8px' 
      }}>
        {friends.length > 0 ? (
          friends.map((friend) => (
            <div key={friend.id} className="friend" style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              marginBottom: '10px',
              fontSize: '1.5rem',
            }}>
              <span>{friend.username}</span>
              <button onClick={() => handleViewList(friend.username, friend.id)} className="primaryButton">
                View List
              </button>
            </div>
          ))
        ) : (
          <p>No friends found.</p>
        )}
      </div>
    </div>
  );
};

export default FriendsList;




