import React, { useState, useEffect } from 'react';
import '../../styles/friendpage.css';
import { useNavigate } from 'react-router-dom';
import '../../styles/modal.css'
import { Modal } from 'react-bootstrap';


const FriendPageCard = () => {
  const [friends, setFriends] = useState([]);
  const [friendSearch, setFriendSearch] = useState('');
  const [filteredFriends, setFilteredFriends] = useState([]);
  const [globalSearch, setGlobalSearch] = useState('');
  const [globalResults, setGlobalResults] = useState([]);
  const [friendRequests, setFriendRequests] = useState([]);
  const [message, setMessage] = useState('');

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedFriend, setSelectedFriend] = useState(null);


  const navigate = useNavigate();

  // Load friends and pending requests
  useEffect(() => {
    const token = localStorage.getItem('user_token');

    const fetchFriends = async () => {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/friends/friends`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        setFriends(data);
        setFilteredFriends(data);
      }
    };

    const fetchFriendRequests = async () => {
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

  // Filter friends list
  useEffect(() => {
    const lower = friendSearch.toLowerCase();
    setFilteredFriends(friends.filter(f => f.username.toLowerCase().includes(lower)));
  }, [friendSearch, friends]);

  // Handlers
  const handleFriendSearch = (e) => setFriendSearch(e.target.value);

  const handleDeleteClick = (friend) => {
    setSelectedFriend(friend);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    const token = localStorage.getItem('user_token');
    const response = await fetch(`/api/friends/delete/${selectedFriend.id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  
    if (response.ok) {
      setFriends(friends.filter(f => f.id !== selectedFriend.id));
      setFilteredFriends(filteredFriends.filter(f => f.id !== selectedFriend.id));
      setMessage('Friend removed.');
    } else {
      setMessage('Failed to remove friend.');
    }
  
    setShowDeleteModal(false);
    setSelectedFriend(null);
  };
  
  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setSelectedFriend(null);
  };
  
  

  /**
   *  Top Right
   *  Search and Add
   *
   */

  // This function Handles the Global Search to find new friends (TOP RIGHT OF CARD)
  const handleGlobalSearch = async (e) => {
    const query = e.target.value;
    setGlobalSearch(query);

    if (!query) {
      setGlobalResults([]);
      return;
    }

    const token = localStorage.getItem('user_token');
    const response = await fetch(`/api/friends/search?query=${query}`, {
      headers: { 'Authorization': `Bearer ${token}` },
    });

    if (response.ok) {
      const data = await response.json();
      setGlobalResults(data.slice(0, 3)); // Limit to first 3 results
    }
  };

  const handleSendRequest = async (receiverUsername) => {
    const token = localStorage.getItem('user_token');
    try {
      const response = await fetch('/api/friends/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ receiverUsername }),
      });
  
      if (response.ok) {
        setMessage('Friend request sent!');
      } else {
        setMessage('Failed to send request.');
      }
    } catch (err) {
      console.error(err);
      setMessage('An error occurred.');
    }
  };
  



  /**
   *  Bottom Right
   *  Accept and Deny
   *
   */
  const handleAccept = async (id) => {
    const token = localStorage.getItem('user_token');
    const response = await fetch('/api/friends/acceptRequest', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ requestId: id }),
    });

    if (response.ok) {
      setFriendRequests(friendRequests.filter(req => req.id !== id));
      setMessage('Friend request accepted.');
    } else {
      setMessage('Failed to accept request.');
    }
  };

  const handleDeny = async (id) => {
    const token = localStorage.getItem('user_token');
    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/friends/declineRequest`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ requestId: id }),
    });

    if (response.ok) {
      setFriendRequests(friendRequests.filter(req => req.id !== id));
      setMessage('Friend request denied.');
    } else {
      setMessage('Failed to deny request.');
    }
  };

  const handleViewList = (username, id) => {
    navigate(`/lists/${username}/${id}`);
  };

  return (
    <div className="friend-page-container">
      {/* Left: Friend List */}
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
                <div>
                  <button onClick={() => handleDeleteClick(friend)} className="secondaryButton">Delete</button>
                  <button onClick={() => handleViewList(friend.username, friend.id)} className="primaryButton">View</button>
                </div>
              </div>
            ))
          ) : (
            <p>No friends found.</p>
          )}
        </div>
      </div>

      {/* Right: Add + Pending */}
      <div className="friend-section right">
        {/* Top Right: Add Friend */}
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
                  <button className="primaryButton" onClick={() => handleSendRequest(user.username)}>Add</button>
                </div>
              ))
            ) : (
              <p>Search to find users.</p>
            )}
          </div>
        </div>

        {/* Bottom Right: Pending Requests */}
        <div className="sub-section">
          <h3>Pending Requests</h3>
          <div className="scroll-box">
            {friendRequests.length > 0 ? (
              friendRequests.map(req => (
                <div key={req.id} className="friend-row">
                  <span>{req.username}</span>
                  <div>
                    <button className="primaryButton" onClick={() => handleAccept(req.id)}>Accept</button>
                    <button className="secondaryButton" onClick={() => handleDeny(req.id)}>Deny</button>
                  </div>
                </div>
              ))
            ) : (
              <p>No pending requests.</p>
            )}
          </div>
        </div>

        {/* Status Message */}
        {message && <p className="status-message">{message}</p>}

      </div>
  
      <Modal show={showDeleteModal} centered className="custom-modal">
      <Modal.Header closeButton>
        <Modal.Title>Confirm Friend Delete</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {selectedFriend
          ? `Are you sure you want to remove ${selectedFriend.username} as a friend?`
          : 'Loading...'}
      </Modal.Body>
      <Modal.Footer>
        <button onClick={handleConfirmDelete} className="primaryButton" disabled={!selectedFriend}>
          Confirm
        </button>
        <button onClick={handleCancelDelete} className="secondaryButton">Cancel</button>
      </Modal.Footer>
    </Modal>

    </div>
    
  );
};

export default FriendPageCard;

