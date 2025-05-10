import React, { useState, useEffect } from 'react';
import '../../styles/friendpage.css';
import { useNavigate } from 'react-router-dom';

const FriendPageCard = () => {
  const [friends, setFriends] = useState([]);
  const [friendSearch, setFriendSearch] = useState('');
  const [filteredFriends, setFilteredFriends] = useState([]);
  const [globalSearch, setGlobalSearch] = useState('');
  const [globalResults, setGlobalResults] = useState([]);
  const [friendRequests, setFriendRequests] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    // Load user's friends
    const fetchFriends = async () => {
      const token = localStorage.getItem('user_token');
      const response = await fetch('/api/friends/friends', {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        setFriends(data);
        setFilteredFriends(data);
      }
    };

    // Load pending friend requests
    const fetchFriendRequests = async () => {
      const token = localStorage.getItem('user_token');
      const response = await fetch('/api/friends/pending', {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        setFriendRequests(data);
      }
    };

    fetchFriends();
    fetchFriendRequests();
  }, []);

  useEffect(() => {
    // Filter friend list
    const lower = friendSearch.toLowerCase();
    setFilteredFriends(friends.filter(f => f.username.toLowerCase().includes(lower)));
  }, [friendSearch, friends]);

  const handleFriendSearch = (e) => {
    setFriendSearch(e.target.value);
  };

  const handleGlobalSearch = async (e) => {
    const query = e.target.value;
    setGlobalSearch(query);

    if (!query) {
      setGlobalResults([]);
      return;
    }

    const token = localStorage.getItem('user_token');
    const response = await fetch(`/api/users/search?query=${query}`, {
      headers: { 'Authorization': `Bearer ${token}` },
    });

    if (response.ok) {
      const data = await response.json();
      setGlobalResults(data);
    }
  };

  const handleViewList = (username, id) => {
    navigate(`/lists/${username}/${id}`);
  };

  return (
    <div className="friend-page-container">
      {/* Left: Friends list */}
      <div className="friend-section left">
        <div className="section-header">
          <h2>Friends</h2>
          <input
            type="text"
            placeholder="Search friends..."
            value={friendSearch}
            onChange={handleFriendSearch}
            className="friend-search"
          />
        </div>
        <div className="scroll-box">
          {filteredFriends.length > 0 ? (
            filteredFriends.map(friend => (
              <div key={friend.id} className="friend-row">
                <span>{friend.username}</span>
                <button onClick={() => handleViewList(friend.username, friend.id)} className="primaryButton">View</button>
              </div>
            ))
          ) : (
            <p>No friends found.</p>
          )}
        </div>
      </div>

      {/* Right: Add + Pending Requests */}
      <div className="friend-section right">
        {/* Add Friend */}
        <div className="sub-section">
          <h3>Add Friends</h3>
          <input
            type="text"
            placeholder="Search users..."
            value={globalSearch}
            onChange={handleGlobalSearch}
            className="friend-search"
          />
          <div className="scroll-box">
            {globalResults.length > 0 ? (
              globalResults.map(user => (
                <div key={user.id} className="friend-row">
                  <span>{user.username}</span>
                  <button className="primaryButton">Add</button>
                </div>
              ))
            ) : (
              <p>Search to find users.</p>
            )}
          </div>
        </div>

        {/* Pending Friend Requests */}
        <div className="sub-section">
          <h3>Pending Requests</h3>
          <div className="scroll-box">
            {friendRequests.length > 0 ? (
              friendRequests.map(req => (
                <div key={req.id} className="friend-row">
                  <span>{req.username}</span>
                  <div>
                    <button className="primaryButton">Accept</button>
                    <button className="secondaryButton">Deny</button>
                  </div>
                </div>
              ))
            ) : (
              <p>No pending requests.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FriendPageCard;
