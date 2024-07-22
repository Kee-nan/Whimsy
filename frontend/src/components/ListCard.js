import React from 'react';
import { Card, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const ListCard = ({ item, reviewData, onNavigate, onDelete, type = 'poster', listType }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/${item.id}`);
  };

  // Find the corresponding review for this item
  const review = reviewData ? reviewData.find(r => r.id === `${item.id}`) : null;

  return (
    <Card className="grid-card-body" onClick={handleCardClick}>
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

export default ListCard;





