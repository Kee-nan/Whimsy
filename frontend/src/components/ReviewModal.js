// src/components/ReviewModal.js
import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Card } from 'react-bootstrap';

const ReviewModal = ({ show, onClose, mediaDetails, onSubmit }) => {
  const [rating, setRating] = useState('');
  const [review, setReview] = useState('');

  useEffect(() => {
    if (mediaDetails.review) {
      setRating(mediaDetails.review.rating);
      setReview(mediaDetails.review.review);
    } else {
      setRating('');
      setReview('');
    }
  }, [mediaDetails]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const reviewData = { 
      id: mediaDetails.id, 
      image: mediaDetails.image, 
      rating, 
      review, 
      title: mediaDetails.title 
    };

    try {
      const response = await fetch('http://localhost:5000/api/review/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('user_token')}`
        },
        body: JSON.stringify({ reviewData })
      });

      if (response.ok) {
        const responseData = await response.json();
        console.log(responseData.message);
        onSubmit();
        alert('Review Successfully Added');
      } else {
        const errorData = await response.json();
        console.error('Error:', errorData.message);
        alert(`Error: ${errorData.message}`);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An unexpected error occurred. Please try again later.');
    }
  };

  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Leave a Review</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Card>
          {mediaDetails.image && <Card.Img src={mediaDetails.image} alt={mediaDetails.title} />}
          <Card.Body>
            <Card.Title>{mediaDetails.title}</Card.Title>
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="rating">
                <Form.Label>Rating (1-100)</Form.Label>
                <Form.Control
                  type="number"
                  value={rating}
                  onChange={(e) => setRating(e.target.value)}
                  min="1"
                  max="100"
                  required
                />
              </Form.Group>
              <Form.Group controlId="review">
                <Form.Label>Review</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={5}
                  value={review}
                  onChange={(e) => setReview(e.target.value)}
                  required
                />
              </Form.Group>
              <Button variant="primary" type="submit">Submit Review</Button>
            </Form>
          </Card.Body>
        </Card>
      </Modal.Body>
    </Modal>
  );
};

export default ReviewModal;
