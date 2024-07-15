import React from 'react';
import { Card, Button } from 'react-bootstrap';

const UserReviewCard = ({ review, onDelete, onEdit }) => {
  const styles = {
    card: {
      width: '100%',
      maxWidth: '700px',
      margin: '20px auto',
      padding: '20px',
    },
    rating: {
      fontSize: '2rem',
      fontWeight: 'bold',
      marginBottom: '20px',
    },
    reviewBox: {
      height: '150px',
      overflowY: 'auto',
      padding: '10px',
      border: '1px solid #ccc',
      borderRadius: '5px',
      marginBottom: '10px',
    },
    buttonContainer: {
      display: 'flex',
      justifyContent: 'space-between',
    },
  };

  return (
    <Card style={styles.card}>
      <Card.Body>
        <div style={styles.rating}>Rating: {review.rating}/100</div>
        <div style={styles.reviewBox}>{review.review}</div>
        <div style={styles.buttonContainer}>
          <Button variant="primary" onClick={onEdit}>Edit Review</Button>
          <Button variant="danger" onClick={onDelete}>Delete Review</Button>
        </div>
      </Card.Body>
    </Card>
  );
};

export default UserReviewCard;



