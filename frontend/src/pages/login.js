// src/pages/LoginPage.js
// src/pages/LoginPage.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Form, Button, Alert } from 'react-bootstrap';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  //Function to handle logging in
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Try calling backend api to get details about
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
        const data = await response.json();
        localStorage.setItem('user_token', data.user_token); // Store the token in localStorage
        navigate('/homepage');
      } else {
        // If login fails, set error message
        setError('Failed to login. Please check your username and password.');
      }
    } catch (error) {
      console.error('Error:', error);
      setError('An error occurred. Please try again.');
    }
  };

  // Button to navigate to account creation page if button is clicked
  const handleCreateAccount = () => {
    navigate('/accountcreation');
  };

  return (
    <div className="login-page">
      <Container className="d-flex flex-column justify-content-center align-items-center vh-100">
        <h1 className="header-title">Whimsy</h1>
        <Form className="w-100" onSubmit={handleSubmit}>
          {error && <Alert variant="danger">{error}</Alert>}

          <Form.Group controlId="formUsername">
            <Form.Label className="form-label">Username</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="form-control"
            />
          </Form.Group>

          <Form.Group controlId="formPassword" className="mt-3">
            <Form.Label className="form-label">Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="form-control"
            />
          </Form.Group>

          <Button
            className="button-login"
            type="submit"
          >
            Login
          </Button>

          <Button
            className="button-login"
            onClick={handleCreateAccount}
          >
            Create Account
          </Button>
        </Form>
      </Container>
    </div>
  );
};

export default LoginPage;


