import React, { useState } from 'react';
import axios from 'axios';
import { Card, Button, Image, Form, Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const UserProfileCard = ({ user, setUser }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [bio, setBio] = useState(user.bio);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const handleEdit = () => {
    setIsEditing(true);
    setBio(user.bio);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setBio(user.bio);
  };

  const navtofriends = () => {
    navigate(`/friend`);
  }

  const handleSignOut = () => {
    localStorage.removeItem('user_token');
    navigate('/login');
  };

  const handleClose = () => setShowModal(false);
  const handleShow = () => setShowModal(true);
  const handleConfirmSignOut = () => {
    handleSignOut();
    setShowModal(false);
  };


  const handleSave = async () => {
    try {
      const user_token = localStorage.getItem('user_token');
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${user_token}`,
      };

      const response = await axios.put(
        'http://localhost:5000/api/accounts/user',
        { bio },
        { headers }
      );

      setUser(response.data);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating bio:', error);
      alert('Error updating bio: ' + error.message);
    }
  };

  return (
    <>
      <Card className="profile-card user-profile-card mb-4">
        <Card.Body className="profile-card-body d-flex flex-column align-items-center">
          <Image
            src={user.profilePicture || 'https://via.placeholder.com/150'}
            roundedCircle
            width="150"
            height="150"
            className="mb-3"
          />
          <Card.Title className="profile-card-title">{user.username}'s Profile</Card.Title>
          {isEditing ? (
            <Form.Control
              as="textarea"
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="mb3 profile-card-text-edit"
            />
          ) : (
            <Card.Text className="profile-card-text">{user.bio}</Card.Text>
          )}
          <div className="d-flex justify-content-center mt-3">
            {isEditing ? (
              <>
                <button className="primaryButton" onClick={handleSave}>Save</button>
                <button className="secondaryButton" onClick={handleCancel}>Cancel</button>
              </>
            ) : (
              <>
                <button className="primaryButton" onClick={handleEdit}>Edit Bio</button>
                <button className="secondaryButton" onClick={navtofriends}>Friends</button>
                <button className="secondaryButton" onClick={handleShow}>Sign Out</button>
              </>
            )}
          </div>
        </Card.Body>
      </Card>

      <Modal show={showModal} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Sign Out</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you would like to sign out?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleConfirmSignOut}>
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>
    
    </>
  );
};

export default UserProfileCard;


