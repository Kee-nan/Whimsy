import React from 'react';
import { Card, Button } from 'react-bootstrap';

const UserReviewCard = ({ review, onDelete, onEdit }) => {
  return (
    <Card className="review-card">
      <Card.Body>
        <div className="review-card-rating">Rating: {review.rating}/100</div>
        <div className="review-card-box">{review.review}</div>
        <div className="review-button-container">
          <button className='primaryButton' onClick={onEdit}>Edit Review</button>
          <button className='secondaryButton' onClick={onDelete}>Delete Review</button>
        </div>
      </Card.Body>
    </Card>
  );
};

export default UserReviewCard;




