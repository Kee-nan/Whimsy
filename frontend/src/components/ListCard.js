import React from 'react';
import { Card, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const ListCard = ({ item, onNavigate, onDelete, type = 'poster', listType }) => {
  const navigate = useNavigate();

  const handleReviewClick = () => {
    console.log('Navigating with:', item);
    navigate('/leaveReview', { state: { mediaDetails: item } });
  };

  const styles = {
    card: {
      width: '320px',
      margin: '5px',
    },
    image: {
      width: '100%',
      height: type === 'album' ? '300px' : '450px',
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
      flex: 1,
      margin: '0 5px',
    },
  };

  return (
    <Card style={styles.card}>
      <Card.Img style={styles.image} src={item.image} alt={item.title} />
      <Card.Body>
        <Card.Title style={styles.title}>{item.title}</Card.Title>
        <div style={styles.buttons}>
          <Button variant="primary" style={styles.button} onClick={() => onNavigate(item.id)}>Details</Button>
          <Button variant="danger" style={styles.button} onClick={() => onDelete(item.id, listType)}>Delete</Button>
          <Button variant="secondary" style={styles.button} onClick={handleReviewClick}>Review</Button>
        </div>
      </Card.Body>
    </Card>
  );
};

export default ListCard;




