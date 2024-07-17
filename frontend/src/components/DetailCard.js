// src/components/DetailCard.js
import React from 'react';
import { Card, Container, Button } from 'react-bootstrap';

const DetailCard = ({ image, title, details, buttons, type = 'poster', onAddToCompleted, onAddToFutures, onAddToCurrent, onReview }) => {
  

  return (
    <Container className="detail-container">
      <Card className="detail-card">
        <div className="detail-card-container">
          <Card.Img className={`detail-image`} src={image} alt={title} />
          <Card.Body className="detail-body">
            <Card.Title className="detail-title" style={{ color: 'white' }}>{title}</Card.Title>
            <Card.Text className="detail-text">{details}</Card.Text>
            <div>
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


