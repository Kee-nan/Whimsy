// src/components/DetailCard.js
import React from 'react';
import { Card, Container, Button } from 'react-bootstrap';

const DetailCard = ({ image, title, details, buttons, type, onAddToCompleted, onAddToFutures, onAddToCurrent, onReview }) => {
  // Determine the class based on the media type
  const imageClass = `detail-image ${type ? `detail-image-${type}` : ''}`;

  return (
    <Container className="detail-container">
      <Card className="detail-card">
        <div className="detail-card-container">
          <Card.Img className={imageClass} src={image} alt={title} />
          <Card.Body className="detail-body">
            <Card.Title className="detail-title">{title}</Card.Title>
            <Card.Text className="detail-text">{details}</Card.Text>
            <div className="detail-buttons">
              {buttons}
              <button className="completedButton" onClick={onAddToCompleted}>Completed</button>
              <button className="currentButton" onClick={onAddToCurrent}>Current</button>
              <button className="futuresButton" onClick={onAddToFutures}>Futures</button>
              <button className="reviewButton" onClick={onReview}>Reviews</button>
            </div>
          </Card.Body>
        </div>
      </Card>
    </Container>
  );
};

export default DetailCard;


