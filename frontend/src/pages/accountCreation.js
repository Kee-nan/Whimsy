import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Container, Alert } from 'react-bootstrap';
import '../styles/login.css';

const AccountCreation = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ firstName: '', lastName: '', username: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/accounts/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      // FIX: always parse JSON now that the backend responds consistently —
      // and always check response.ok before treating this as success.
      const data = await response.json();

      if (!response.ok) {
        setError(data.message || 'Something went wrong creating your account.');
        setSubmitting(false);
        return;
      }

      navigate('/login', { state: { accountCreated: true } });
    } catch (err) {
      console.error('Account creation error:', err);
      setError('Could not reach the server. Please try again.');
      setSubmitting(false);
    }
  };

  return (
    <Container className="login-container">
      <div className="login-card">
        <h2 className="login-title">Create Your Account</h2>
        {error && <Alert variant="danger">{error}</Alert>}
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>First Name</Form.Label>
            <Form.Control name="firstName" value={formData.firstName} onChange={handleChange} required />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Last Name</Form.Label>
            <Form.Control name="lastName" value={formData.lastName} onChange={handleChange} required />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Username</Form.Label>
            <Form.Control name="username" value={formData.username} onChange={handleChange} required />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control type="email" name="email" value={formData.email} onChange={handleChange} required />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Password</Form.Label>
            <Form.Control type="password" name="password" value={formData.password} onChange={handleChange} required />
            <Form.Text className="text-muted">Must be at least 8 characters.</Form.Text>
          </Form.Group>
          <button type="submit" className="whimsy-btn w-100" disabled={submitting}>
            {submitting ? 'Creating Account...' : 'Create Account'}
          </button>
        </Form>
      </div>
    </Container>
  );
};

export default AccountCreation;
