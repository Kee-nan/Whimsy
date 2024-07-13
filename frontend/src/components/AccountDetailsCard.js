// src/components/AccountDetailsCard.js

import React, { useState } from 'react';
import { Card, Button, Form } from 'react-bootstrap';
import axios from 'axios';

const AccountDetailsCard = ({ user }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [firstName, setFirstName] = useState(user.firstName);
  const [lastName, setLastName] = useState(user.lastName);
  const [username, setUsername] = useState(user.username);
  const [email, setEmail] = useState(user.email);
  const [password, setPassword] = useState('');

  const handleEditToggle = () => setIsEditing(!isEditing);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedUser = {
        firstName,
        lastName,
        username,
        email,
        password,
      };
      const user_token = localStorage.getItem('user_token');
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${user_token}`,
      };

      await axios.put('http://localhost:5000/api/user', updatedUser, { headers });

      setIsEditing(false);
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
            <Form.Group controlId="formPassword" className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Group>
            <Button variant="primary" type="submit">Save</Button>
            <Button variant="secondary" onClick={handleEditToggle} className="ms-2">Cancel</Button>
          </Form>
        ) : (
          <>
            <p><strong>First Name:</strong> {firstName}</p>
            <p><strong>Last Name:</strong> {lastName}</p>
            <p><strong>Username:</strong> {username}</p>
            <p><strong>Email:</strong> {email}</p>
            <Button variant="primary" onClick={handleEditToggle}>Edit</Button>
          </>
        )}
      </Card.Body>
    </Card>
  );
};

export default AccountDetailsCard;