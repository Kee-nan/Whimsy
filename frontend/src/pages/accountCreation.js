import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Form, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

/**
 *  Account creation
 *  All the details an account
 */

const CreateAccountPage = () => {
  //Account Variable details
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Create a JSON object with form data
    const userData = {
      firstName,
      lastName,
      username,
      email,
      password,
    };

    try {
      // Send a POST request to the backend API to save user data
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/accounts/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        // If the account creation is successful, navigate to the login page or home page
        navigate('/login');
        alert('Account Created. Please login.')
      } else {
        // Handle error if the account creation fails
        console.error('Account creation failed');
      }
    } catch (error) {
      console.error('Error:', error);
      alert(`Error Occured: ${error.message}, username or email may already be used.`)
    }
  };

  return (

    <div className="login-page">
      <Container className="d-flex justify-content-center align-items-center vh-100">
        <Form className="w-100" onSubmit={handleSubmit}>
          <h1 className="text-center mb-4 header-title">Create Account</h1>

          <Form.Group controlId="formFirstName">
            <Form.Label className="form-label">First Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter your first name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
              className="form-control"
            />
          </Form.Group>

          <Form.Group controlId="formLastName" className="mt-3">
            <Form.Label className="form-label">Last Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter your last name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
              className="form-control"
            />
          </Form.Group>

          <Form.Group controlId="formUsername" className="mt-3">
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

          <Form.Group controlId="formEmail" className="mt-3">
            <Form.Label className="form-label">Email address</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="form-control"
            />
          </Form.Group>

          <Form.Group controlId="formPassword" className="mt-3">
            <Form.Label className="form-label">Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="form-control"
            />
          </Form.Group>

          <Button type="submit" className="button-login">
            Create Account
          </Button>
        </Form>
      </Container>
    </div>
  );
};

export default CreateAccountPage;
