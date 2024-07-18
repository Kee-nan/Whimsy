import React from 'react';
import { Card, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const ListCard = ({ item, onNavigate, onDelete, type = 'poster', listType }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/${item.id}`);
  };

  return (
    <Card className="grid-card-body" onClick={handleCardClick}>
      <Card.Img src={item.image} className="grid-card-image poster" />
      <Card.Body>
        <Card.Title className="grid-card-title" style={{ color: 'white' }}>{item.title}</Card.Title>
      </Card.Body>
    </Card>
  );
};

export default ListCard;




