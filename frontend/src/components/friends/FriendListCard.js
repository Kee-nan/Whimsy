import React from 'react';
import { Card } from 'react-bootstrap';

const FriendListCard = ({ item, reviewData, onCardClick }) => {
  // Find the corresponding review for this item
  const review = reviewData ? reviewData.find(r => r.id === `${item.id}`) : null;

  return (
    <Card className="grid-card-body" onClick={() => onCardClick(item)}>
      <Card.Img src={item.image} className="grid-card-image poster" />
      <Card.Body>
        <Card.Title className="grid-card-title" style={{ color: 'white' }}>{item.title}</Card.Title>
        <Card.Text className="grid-card-title" style={{ color: 'white' }}>
          {review ? `Rating: ${review.rating}` : 'No rating available'}
        </Card.Text>
      </Card.Body>
    </Card>
  );
};

export default FriendListCard;
