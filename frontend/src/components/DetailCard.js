// src/components/DetailCard.js
import React from 'react';
import { Card, Container } from 'react-bootstrap';

const DetailCard = ({ image, title, details, buttons, type = 'poster' }) => {
  const styles = {
    card: {
      width: '100%',
      maxWidth: '900px',
      margin: '0 auto',
      padding: '20px',
    },
    image: {
      width: type === 'album' ? '250px' : '250px',
      height: type === 'album' ? '250px' : '360px',
      objectFit: 'cover',
      marginRight: '20px',
    },
    body: {
      flex: 1,
    },
    title: {
      fontSize: '2rem',
      fontWeight: 'bold',
    },
    details: {
      marginTop: '10px',
      fontSize: '1rem',
    },
    buttons: {
      marginTop: '20px',
      display: 'flex',
      gap: '10px',
    },
    container: {
      marginTop: '5rem',
    },
    cardContainer: {
      display: 'flex',
    }
  };

  return (
    <Container style={styles.container}>
      <Card style={styles.card}>
        <div style={styles.cardContainer}>
          <Card.Img style={styles.image} src={image} alt={title} />
          <Card.Body style={styles.body}>
            <Card.Title style={styles.title}>{title}</Card.Title>
            <Card.Text style={styles.details}>{details}</Card.Text>
            <div style={styles.buttons}>{buttons}</div>
          </Card.Body>
        </div>
      </Card>
    </Container>
  );
};

export default DetailCard;

