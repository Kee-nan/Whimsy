// src/pages/details/BookDetail.js
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import AppNavbar from '../../components/Navbar';
import { Container, Card, Button } from 'react-bootstrap';

const BookDetail = () => {
  const { id } = useParams();
  const [book, setBook] = useState(null);

  useEffect(() => {
    const fetchBookDetails = async () => {
      try {
        const response = await axios.get(`/api/books/${id}`);
        setBook(response.data);
      } catch (error) {
        console.error("Error fetching book details:", error);
      }
    };

    fetchBookDetails();
  }, [id]);

  const addToWatchlist = () => {
    const watchlist = JSON.parse(localStorage.getItem('watchlist')) || [];
    const bookItem = {
      url: `books/${id}`,
      title: book.volumeInfo.title,
      image: book.volumeInfo.imageLinks?.thumbnail || 'placeholder.jpg',
    };
    localStorage.setItem('watchlist', JSON.stringify([...watchlist, bookItem]));
  };

  if (!book) return <p>Loading...</p>;

  return (
    <>
      <AppNavbar />
      <Container className="mt-5">
        <Card>
          <Card.Img src={book.volumeInfo.imageLinks?.thumbnail} alt={book.volumeInfo.title} />
          <Card.Body>
            <Card.Title>{book.volumeInfo.title}</Card.Title>
            <Card.Text>{book.volumeInfo.description}</Card.Text>
            <Button variant="success" onClick={addToWatchlist}>Add to Watchlist</Button>
          </Card.Body>
        </Card>
      </Container>
    </>
  );
};

export default BookDetail;


