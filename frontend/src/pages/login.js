// src/pages/LoginPage.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Form, Button, Alert } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:5000/api/accounts/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        // If login is successful, navigate to the homepage
        navigate('/');
      } else {
        // If login fails, set error message
        setError('Failed to login. Please check your username and password.');
      }
    } catch (error) {
      console.error('Error:', error);
      setError('An error occurred. Please try again.');
    }
  };

  const handleCreateAccount = () => {
    navigate('/accountcreation');
  };

  return (
    <Container className="d-flex justify-content-center align-items-center vh-100">
      <Form className="w-100" onSubmit={handleSubmit}>
        <h1 className="text-center mb-4">Whimsy</h1>
        {error && <Alert variant="danger">{error}</Alert>}
        <Form.Group controlId="formUsername">
          <Form.Label>Username</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group controlId="formPassword" className="mt-3">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </Form.Group>
        <Button variant="primary" type="submit" className="mt-4 w-100">
          Submit
        </Button>
        <Button
          variant="secondary"
          type="button"
          className="mt-4 w-100"
          onClick={handleCreateAccount}
        >
          Create Account
        </Button>
      </Form>
    </Container>
  );
};

export default LoginPage;

