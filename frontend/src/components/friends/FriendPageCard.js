import React, { useState, useEffect } from 'react';
import '../../styles/friendpage.css';
import { useNavigate } from 'react-router-dom';
import '../../styles/modal.css';
import { Modal } from 'react-bootstrap';
import Avatar from '../common/Avatar';

const FriendPageCard = () => {
  const [friends, setFriends] = useState([]);
  const [friendSearch, setFriendSearch] = useState('');
  const [filteredFriends, setFilteredFriends] = useState([]);

  const [globalSearch, setGlobalSearch] = useState('');
  const [globalResults, setGlobalResults] = useState([]);
  const [hasSearched, setHasSearched] = useState(false); // tracks whether a search has actually run yet

  const [friendRequests, setFriendRequests] = useState([]);
  const [message, setMessage] = useState('');

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedFriend, setSelectedFriend] = useState(null);

  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedAddUser, setSelectedAddUser] = useState(null);

  const avatarUrl = (pic) => (pic ? `${process.env.REACT_APP_API_URL}${pic}` : 'https://via.placeholder.com/40');

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('user_token');

    const fetchFriends = async () => {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/friends/friends`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        setFriends(data);
        setFilteredFriends(data);
      }
    };

    const fetchFriendRequests = async () => {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/friends/pending`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) setFriendRequests(await response.json());
    };

    fetchFriends();
    fetchFriendRequests();
  }, []);

  useEffect(() => {
    const lower = friendSearch.toLowerCase();
    setFilteredFriends(friends.filter((f) => f.username.toLowerCase().includes(lower)));
  }, [friendSearch, friends]);

  const handleFriendSearch = (e) => setFriendSearch(e.target.value);

  const handleDeleteClick = (friend) => {
    setSelectedFriend(friend);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    const token = localStorage.getItem('user_token');
    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/friends/delete/${selectedFriend.id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    if (response.ok) {
      setFriends(friends.filter((f) => f.id !== selectedFriend.id));
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
   * Top Right — Search and Add.
   * Now fires only on form submit (Enter key, or the Search button),
   * not on every keystroke — the input's onChange just updates the text.
   */
  const handleGlobalSearchSubmit = async (e) => {
    e.preventDefault();
    const query = globalSearch.trim();
    setHasSearched(true);
    if (!query) { setGlobalResults([]); return; }

    const token = localStorage.getItem('user_token');
    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/friends/search?query=${encodeURIComponent(query)}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setGlobalResults(response.ok ? await response.json() : []); // full result set (up to 10 from the backend) — no slicing
  };

  const handleAddClick = (user) => {
    setSelectedAddUser(user);
    setShowAddModal(true);
  };

  const handleConfirmSendRequest = async () => {
    const token = localStorage.getItem('user_token');
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/friends/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ receiverUsername: selectedAddUser.username }),
      });
      if (response.ok) {
        setMessage('Friend request sent!');
        setGlobalResults((prev) => prev.filter((u) => u.id !== selectedAddUser.id));
      } else {
        setMessage('Failed to send request.');
      }
    } catch (err) {
      console.error(err);
      setMessage('An error occurred.');
    } finally {
      setShowAddModal(false);
      setSelectedAddUser(null);
    }
  };

  const handleCancelSendRequest = () => {
    setShowAddModal(false);
    setSelectedAddUser(null);
  };

  /**
   * Bottom Right — Accept and Deny.
   */
  const handleAccept = async (id) => {
    const token = localStorage.getItem('user_token');
    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/friends/acceptRequest`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ requestId: id }),
    });
    if (response.ok) {
      setFriendRequests(friendRequests.filter((req) => req.id !== id));
      setMessage('Friend request accepted.');
    } else {
      setMessage('Failed to accept request.');
    }
  };

  const handleDeny = async (id) => {
    const token = localStorage.getItem('user_token');
    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/friends/declineRequest`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ requestId: id }),
    });
    if (response.ok) {
      setFriendRequests(friendRequests.filter((req) => req.id !== id));
      setMessage('Friend request denied.');
    } else {
      setMessage('Failed to deny request.');
    }
  };

  const handleViewList = (username, id) => navigate(`/lists/${username}/${id}`);

  return (
    <div className="friend-page-container">
      {/* Left: Friend List */}
      <div className="friend-section left">
        <div className="section-header">
          <h2>Friends</h2>
          <input type="text" placeholder="Search friends..." value={friendSearch} onChange={handleFriendSearch} className="friend-search" />
        </div>
        <div className="scroll-box friend-main-scroll-box">
          {filteredFriends.length > 0 ? (
            filteredFriends.map((friend) => (
              <div key={friend.id} className="friend-row-shaded" onClick={() => handleViewList(friend.username, friend.id)}>
                <Avatar src={friend.profile_picture_url ? `${process.env.REACT_APP_API_URL}${friend.profile_picture_url}` : null} size={36} />
                <span className="friend-row-name">{friend.username}</span>
                <button className="whimsy-btn whimsy-btn-ghost" onClick={(e) => { e.stopPropagation(); handleDeleteClick(friend); }}>Delete</button>
              </div>
            ))
          ) : (
            <p className="friend-inset-placeholder">No friends found.</p>
          )}
        </div>
      </div>

      {/* Right: Add + Pending */}
      <div className="friend-section right">
        {/* Top Right: Add Friend — search-on-submit */}
        <div className="sub-section">
          <h3>Add Friends</h3>
          <form onSubmit={handleGlobalSearchSubmit} className="d-flex gap-2">
            <input
              type="text"
              placeholder="Search users..."
              value={globalSearch}
              onChange={(e) => setGlobalSearch(e.target.value)}
              className="friend-search"
              style={{ width: '100%' }}
            />
            <button type="submit" className="whimsy-btn">Search</button>
          </form>
          <div className="scroll-box friend-main-scroll-box">
            {!hasSearched && <p className="friend-inset-placeholder">Search to find users.</p>}
            {hasSearched && globalResults.length === 0 && <p className="friend-inset-placeholder">No users found.</p>}
            {globalResults.map((user) => (
              <div key={user.id} className="friend-row-shaded" onClick={() => handleAddClick(user)}>
                <Avatar src={user.profile_picture_url ? `${process.env.REACT_APP_API_URL}${user.profile_picture_url}` : null} size={36} />
                <span className="friend-row-name">{user.username}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Right: Pending Requests */}
        <div className="sub-section">
          <h3>Pending Requests</h3>
          <div className="scroll-box friend-main-scroll-box">
            {friendRequests.length > 0 ? (
              friendRequests.map((req) => (
                <div key={req.id} className="friend-row-shaded">
                  <Avatar src={req.profilePicture ? `${process.env.REACT_APP_API_URL}${req.profilePicture}` : null} size={36} />
                  <span className="friend-row-name">{req.username}</span>
                  <div className="d-flex gap-2">
                    <button className="whimsy-btn" onClick={() => handleAccept(req.id)}>Accept</button>
                    <button className="whimsy-btn whimsy-btn-ghost" onClick={() => handleDeny(req.id)}>Deny</button>
                  </div>
                </div>
              ))
            ) : (
              <p className="friend-inset-placeholder">No pending requests.</p>
            )}
          </div>
        </div>

        {message && <p className="status-message">{message}</p>}
      </div>

      {/* Confirm Delete Friend */}
      <Modal show={showDeleteModal} centered className="custom-modal">
        <Modal.Header closeButton><Modal.Title>Confirm Friend Delete</Modal.Title></Modal.Header>
        <Modal.Body>
          {selectedFriend ? `Are you sure you want to remove ${selectedFriend.username} as a friend?` : 'Loading...'}
        </Modal.Body>
        <Modal.Footer>
          <button onClick={handleConfirmDelete} className="whimsy-btn" disabled={!selectedFriend}>Confirm</button>
          <button onClick={handleCancelDelete} className="whimsy-btn whimsy-btn-ghost">Cancel</button>
        </Modal.Footer>
      </Modal>

      {/* Confirm Send Friend Request */}
      <Modal show={showAddModal} onHide={handleCancelSendRequest} centered className="custom-modal">
        <Modal.Header closeButton><Modal.Title>Send Friend Request</Modal.Title></Modal.Header>
        <Modal.Body>
          {selectedAddUser ? `Would you like to send ${selectedAddUser.username} a friend request?` : 'Loading...'}
        </Modal.Body>
        <Modal.Footer>
          <button onClick={handleConfirmSendRequest} className="whimsy-btn" disabled={!selectedAddUser}>Send Request</button>
          <button onClick={handleCancelSendRequest} className="whimsy-btn whimsy-btn-ghost">Cancel</button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default FriendPageCard;
