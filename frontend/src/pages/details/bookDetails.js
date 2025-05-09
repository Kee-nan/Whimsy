// src/pages/searchs/BookDetail.js
import React from 'react';
import axios from 'axios';
import DetailPage from '../templates/DetailPage';

// Function to fetch book details (no token needed)
const fetchBookDetails = async (id) => {
  return await axios.get(`https://www.googleapis.com/books/v1/volumes/${id}`);
};

const stripHtmlTags = (html) => {
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = html;
  return tempDiv.innerText;
};

// Function to extract book details
const extractBookDetails = (data) => {
  const book = data.volumeInfo;
  return {
    image: book.imageLinks?.thumbnail || 'placeholder.jpg',
    title: book.title, // Add title to ensure it's set
    details: [
        <p><strong>Author(s):</strong> {book.authors ? book.authors.join(', ') : "Unknown Author"}</p>,
        <p><strong>Published on:</strong> {book.publishedDate} by {book.publisher} </p>,
        <p><strong>Page Count:</strong> {book.pageCount}</p>,
        <p><strong>Categories:</strong> {book.categories ? book.categories.join(', ') : "None"}</p>,
    ],
    summary: stripHtmlTags(book.description)
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

