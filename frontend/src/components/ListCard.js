// src/components/ListCard.js
import React from 'react';
import { Card, Button } from 'react-bootstrap';

const ListCard = ({ item, onNavigate, onDelete, type = 'poster' }) => {
  const styles = {
    card: {
      width: '320px', // Increased width
      margin: '5px',
    },
    image: {
      width: '100%', // Full width of the card
      height: type === 'album' ? '300px' : '450px', // Adjust height for better fit
      objectFit: 'cover',
    },
    title: {
      fontWeight: 'bold',
      margin: '10px 0',
    },
    buttons: {
      display: 'flex',
      justifyContent: 'space-between',
      gap: '2px',
    },
    button: {
      flex: 1, // Make buttons stretch to fill the space
      margin: '0 5px', // Margin between buttons
    },
  };

  return (
    <Card style={styles.card}>
      <Card.Img style={styles.image} src={item.image} alt={item.title} />
      <Card.Body>
        <Card.Title style={styles.title}>{item.title}</Card.Title>
        <div style={styles.buttons}>
          <Button variant="primary" style={styles.button} onClick={() => onNavigate(item.url)}>Details</Button>
          <Button variant="danger" style={styles.button} onClick={() => onDelete(item.url)}>Delete</Button>
          <Button variant="secondary" style={styles.button}>Review</Button>
        </div>
      </Card.Body>
    </Card>
  );
};

export default ListCard;
