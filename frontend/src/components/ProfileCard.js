import React, { useState } from 'react';
import axios from 'axios';
import { Card, Button, Image, Form } from 'react-bootstrap';

const UserProfileCard = ({ user, setUser }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [bio, setBio] = useState(user.bio);

  const handleEdit = () => {
    setIsEditing(true);
    setBio(user.bio); // Ensure the form initializes with the current bio
  };

  const handleCancel = () => {
    setIsEditing(false);
    setBio(user.bio); // Reset the form value to the current bio
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
    <Card className="mb-4">
      <Card.Body className="d-flex flex-column align-items-center">
        <Image
          src={user.profilePicture || 'https://via.placeholder.com/150'}
          roundedCircle
          width="150"
          height="150"
          className="mb-3"
        />
        <Card.Title className="display-4">{user.username}'s Profile</Card.Title>
        {isEditing ? (
          <Form.Control
            as="textarea"
            rows={3}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="mb-3"
          />
        ) : (
          <Card.Text className="text-center">{user.bio}</Card.Text>
        )}
        <div className="d-flex justify-content-center mt-3">
          {isEditing ? (
            <>
              <Button variant="primary" className="me-2" onClick={handleSave}>
                Save
              </Button>
              <Button variant="secondary" onClick={handleCancel}>
                Cancel
              </Button>
            </>
          ) : (
            <>
              <Button variant="primary" className="me-2" onClick={handleEdit}>
                Edit Bio
              </Button>
              <Button variant="secondary">Friends</Button>
            </>
          )}
        </div>
      </Card.Body>
    </Card>
  );
};

export default UserProfileCard;

