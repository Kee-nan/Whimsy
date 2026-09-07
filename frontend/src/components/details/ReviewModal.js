import React, { useState, useEffect } from 'react';
import { Modal, Form, Card, Row, Col } from 'react-bootstrap';
import { getRatingTier } from './RatingGauge';

const ReviewModal = ({ show, onClose, mediaDetails, onSubmit }) => {
  const [rating, setRating] = useState(15);
  const [review, setReview] = useState('');

  useEffect(() => {
    if (mediaDetails.review) {
      setRating(mediaDetails.review.rating);
      setReview(mediaDetails.review.review || '');
    } else {
      setRating(15);
      setReview('');
    }
  }, [mediaDetails]);

  const tier = getRatingTier(rating);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const reviewData = {
      id: mediaDetails.id,
      image: mediaDetails.image,
      rating,
      review: review.trim() === '' ? null : review, // review text is optional — rating alone is enough
      title: mediaDetails.title,
    };
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/review/add`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('user_token')}` },
        body: JSON.stringify({ reviewData }),
      });
      if (response.ok) {
        onSubmit();
        alert('Review Successfully Added');
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.message}`);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An unexpected error occurred. Please try again later.');
    }
  };

  return (
    <Modal show={show} onHide={onClose} centered className="custom-modal review-modal-lg">
      <Modal.Header closeButton><Modal.Title>Leave a Review</Modal.Title></Modal.Header>
      <Modal.Body>
        <Card className="review-modal-card">
          <Row>
            <Col md={4}>
              {mediaDetails.image && <Card.Img src={mediaDetails.image} alt={mediaDetails.title} className="review-modal-card-img" />}
              <Card.Title className="review-modal-card-title mt-3">{mediaDetails.title}</Card.Title>
            </Col>
            <Col md={8}>
              <Card.Body>
                <Form onSubmit={handleSubmit}>
                  <Form.Group controlId="rating" className="mb-3">
                    <Form.Label className="review-modal-label">Rating</Form.Label>
                    <div className="review-rating-display" style={{ color: tier.color }}>
                      <span className="review-rating-value">{rating}</span>
                      <span className="review-rating-tier">{tier.label}</span>
                    </div>
                    <input
                      type="range" min="0" max="30" step="1"
                      value={rating}
                      onChange={(e) => setRating(Number(e.target.value))}
                      className="review-rating-slider"
                      style={{ accentColor: tier.color }}
                    />
                  </Form.Group>
                  <Form.Group controlId="review" className="mb-3">
                    <Form.Label className="review-modal-label">
                      Review <span className="review-modal-optional">(optional)</span>
                    </Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={8}
                      value={review}
                      onChange={(e) => setReview(e.target.value)}
                      placeholder="Share your thoughts... or leave this blank and just save your rating."
                      className="review-modal-input"
                    />
                  </Form.Group>
                  <button type="submit" className="whimsy-btn">Submit Review</button>
                </Form>
              </Card.Body>
            </Col>
          </Row>
        </Card>
      </Modal.Body>
    </Modal>
  );
};

export default ReviewModal;


