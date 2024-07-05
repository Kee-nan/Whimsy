import React, { useState, useEffect } from 'react';
import { Container, Card, Form, Button } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import AppNavbar from '../components/Navbar';

const LeaveReview = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [mediaDetails, setMediaDetails] = useState({});
  const [rating, setRating] = useState('');
  const [review, setReview] = useState('');

  useEffect(() => {
    if (location.state && location.state.mediaDetails) {
      setMediaDetails(location.state.mediaDetails);
      if (location.state.mediaDetails.review) {
        setRating(location.state.mediaDetails.review.rating);
        setReview(location.state.mediaDetails.review.review);
      }
    }
  }, [location.state]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const reviewData = { rating, review, title: mediaDetails.title, image: mediaDetails.image };

    const reviews = JSON.parse(localStorage.getItem('reviews')) || {};
    reviews[mediaDetails.url] = reviewData;
    localStorage.setItem('reviews', JSON.stringify(reviews));

    navigate(`/${mediaDetails.url}`);
  };

  const isPoster = mediaDetails.type === 'poster';

  const styles = {
    card: {
      width: '100%',
      maxWidth: '700px',
      margin: '0 auto',
      padding: '20px',
    },
    image: {
      width: isPoster ? '60%' : '40%',
      height: isPoster ? 'auto' : 'auto',
      objectFit: 'cover',
      margin: '0 auto 20px auto',
      display: 'block',
    },
    title: {
      fontSize: '2rem',
      fontWeight: 'bold',
      marginBottom: '20px',
    },
    form: {
      display: 'flex',
      flexDirection: 'column',
      gap: '15px',
    },
  };

  return (
    <>
      <AppNavbar />
      <Container>
        <Card style={styles.card}>
          {mediaDetails.image && <Card.Img style={styles.image} src={mediaDetails.image} alt={mediaDetails.title} />}
          <Card.Body>
            <Card.Title style={styles.title}>{mediaDetails.title}</Card.Title>
            <Form style={styles.form} onSubmit={handleSubmit}>
              <Form.Group controlId="rating">
                <Form.Label>Rating (1-100)</Form.Label>
                <Form.Control
                  type="number"
                  value={rating}
                  onChange={(e) => setRating(e.target.value)}
                  min="1"
                  max="100"
                  required
                />
              </Form.Group>
              <Form.Group controlId="review">
                <Form.Label>Review</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={5}
                  value={review}
                  onChange={(e) => setReview(e.target.value)}
                  required
                />
              </Form.Group>
              <Button variant="primary" type="submit">Submit Review</Button>
            </Form>
          </Card.Body>
        </Card>
      </Container>
    </>
  );
};

export default LeaveReview;


