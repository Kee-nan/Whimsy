// src/pages/details/BookDetail.js
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import AppNavbar from '../../components/Navbar';
import DetailCard from '../../components/DetailCard';
import { Button } from 'react-bootstrap';

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

  const stripHtmlTags = (html) => {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    return tempDiv.innerText;
  };

  if (!book) return <p>Loading...</p>;

  return (
    <>
      <AppNavbar />
      <DetailCard
        image={book.volumeInfo.imageLinks?.thumbnail || 'placeholder.jpg'}
        title={book.volumeInfo.title}
        details={
          <>
            <p><strong>Author:</strong> {book.volumeInfo.authors?.join(', ')}</p>
            <p><strong>Published Date:</strong> {book.volumeInfo.publishedDate}</p>
            <p><strong>Description:</strong> {stripHtmlTags(book.volumeInfo.description)}</p>
            <p><strong>Categories:</strong> {book.volumeInfo.categories?.join(', ')}</p>
          </>
        }
        buttons={<Button variant="success" onClick={addToWatchlist}>Add to Watchlist</Button>}
      />
    </>
  );
};

export default BookDetail;


