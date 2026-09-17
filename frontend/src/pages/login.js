// src/pages/LoginPage.js

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Form, Button, Alert } from 'react-bootstrap';


/**
 *  Page that appears to log everyone in
 */
const LoginPage = () => {
  
  //Variables to hold the entered username and password
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(''); //Error Tracker

  const navigate = useNavigate();

  //Function to handle logging in
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/accounts/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await response.json(); // now always valid JSON regardless of success/failure

      if (!response.ok) {
        setError(data.message || 'Login failed.');
        return;
      }

      localStorage.setItem('user_token', data.user_token);
      localStorage.setItem('tokenExpiry', data.expiresAt);

      navigate('/homepage');
    } catch (err) {
      console.error('Login error:', err);
      setError('Could not reach the server. Please try again.');
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

          {/* Username Enter Field */}
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

          {/* Password Enter Field */}
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


