// src/components/AccountDetailsCard.js
import React, { useState, useEffect } from 'react';
import { Card, Button, Form } from 'react-bootstrap';

const AccountDetailsCard = ({ user }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [firstName, setFirstName] = useState(user.firstName);
  const [lastName, setLastName] = useState(user.lastName);
  const [username, setUsername] = useState(user.username);
  const [email, setEmail] = useState(user.email);

  useEffect(() => {
    // Prefill the form fields when entering edit mode
    if (isEditing) {
      setFirstName(user.firstName);
      setLastName(user.lastName);
      setUsername(user.username);
      setEmail(user.email);
    }
  }, [isEditing, user]);

  const handleEditToggle = () => setIsEditing(!isEditing);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedUser = {
        firstName,
        lastName,
        username,
        email,
      };
      const user_token = localStorage.getItem('user_token');
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${user_token}`,
      };

      const response = await fetch('http://localhost:5000/api/accounts/user', {
        method: 'PUT',
        headers: headers,
        body: JSON.stringify(updatedUser),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message);
      }

      setIsEditing(false);
      window.location.reload();
    } catch (error) {
      console.error('Error updating user details:', error);
    }
  };

  return (
    <Card className="mb-4">
      <Card.Body>
        <Card.Title>Account Details</Card.Title>
        {isEditing ? (
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formFirstName" className="mb-3">
              <Form.Label>First Name</Form.Label>
              <Form.Control
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group controlId="formLastName" className="mb-3">
              <Form.Label>Last Name</Form.Label>
              <Form.Control
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group controlId="formUsername" className="mb-3">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group controlId="formEmail" className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Form.Group>
            <Button variant="primary" type="submit">Save</Button>
            <Button variant="secondary" onClick={handleEditToggle} className="ms-2">Cancel</Button>
          </Form>
        ) : (
          <div>
            <p>First Name: {user.firstName}</p>
            <p>Last Name: {user.lastName}</p>
            <p>Username: {user.username}</p>
            <p>Email: {user.email}</p>
            <Button variant="primary" onClick={handleEditToggle}>Edit</Button>
          </div>
        )}
      </Card.Body>
    </Card>
  );
};

export default AccountDetailsCard;
