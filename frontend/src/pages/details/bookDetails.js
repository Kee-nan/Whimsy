// src/pages/searchs/BookDetail.js
import React from 'react';
import axios from 'axios';
import DetailPage from '../templates/DetailPage';

// Function to fetch book details (no token needed)
const fetchBookDetails = async (id) => {
  return await axios.get(`https://www.googleapis.com/books/v1/volumes/${id}`);
};

// Function to extract book details
const extractBookDetails = (data) => {
  const book = data.volumeInfo;
  return {
    image: book.imageLinks?.thumbnail || 'placeholder.jpg',
    title: book.title, // Add title to ensure it's set
    details: (
      <>
        <p><strong>Author(s):</strong> {book.authors ? book.authors.join(', ') : "Unknown Author"}</p>
        <p><strong>Published Date:</strong> {book.publishedDate}</p>
        <p><strong>Page Count:</strong> {book.pageCount}</p>
        <p><strong>Publisher:</strong> {book.publisher}</p>
        <p><strong>Categories:</strong> {book.categories ? book.categories.join(', ') : "None"}</p>
        <p><strong>Google Books URL:</strong> <a href={book.infoLink} target="_blank" rel="noopener noreferrer">View on Google Books</a></p>
      </>
    )
  };
};

const BookDetail = () => {
  return (
    <DetailPage
      fetchDetails={fetchBookDetails}
      extractDetails={extractBookDetails}
      mediaType="book"
      tokenRequired={false} // No token required for books
    />
  );
};

export default BookDetail;

