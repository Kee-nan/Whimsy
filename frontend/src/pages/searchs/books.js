
// src/pages/search/BookSearch.js
import React from 'react';
import axios from 'axios';
import SearchPage from '../templates/SearchPage';
import { Card } from 'react-bootstrap';

const searchBooks = async (key) => {
  try {
    const response = await axios.get('https://www.googleapis.com/books/v1/volumes', {
      params: { q: key }
    });
    return { data: response.data.items || [] }; // Ensure data is always an array
  } catch(error) {
    console.error("Error fetching Books:", error);
    alert("Error fetching Books");
    return [];
  }
};

const renderBookCard = (item) => (
  <>
    <Card.Img src={item.volumeInfo.imageLinks?.thumbnail || 'placeholder.jpg'} alt={item.volumeInfo.title} className="grid-card-image poster"/>
    <Card.Body>
      <Card.Title className="grid-card-title" style={{ color: 'white' }}>{item.volumeInfo.title}</Card.Title>
    </Card.Body>
  </>
);

const BookSearch = () => (
  <SearchPage
    searchFunction={searchBooks}
    renderCard={renderBookCard}
    placeholder="Book"
    extractId={(item) => item.id}
  />
);

export default BookSearch;






