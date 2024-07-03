// src/components/ListCard.js
import React from 'react';
import { Card, Button } from 'react-bootstrap';

const ListCard = ({ item, onNavigate, onDelete }) => {
  return (
    <Card className="m-2">
      <Card.Img src={item.image} alt={item.title} />
      <Card.Body>
        <Card.Title>{item.title}</Card.Title>
        <Button variant="primary" onClick={() => onNavigate(item.url)}>Go to Details</Button>
        <Button variant="danger" onClick={() => onDelete(item.url)}>Delete</Button>
        <Button variant="secondary">Review</Button>
      </Card.Body>
    </Card>
  );
};

export default ListCard;
