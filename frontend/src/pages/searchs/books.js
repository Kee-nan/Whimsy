import React, { useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import AppNavbar from '../../components/Navbar';
import SearchBar from '../../components/SearchBar';
import GridCard from '../../components/GridCard';
import { Card } from 'react-bootstrap';

const Books = () => {
  const [searchKey, setSearchKey] = useState("");
  const [books, setBooks] = useState([]);

  // Function to search books using the backend API
  const searchBooks = async (e) => {
    e.preventDefault(); // Prevent the default form submission behavior
    try {
      const response = await axios.get('/api/books/search', {
        params: { q: searchKey } // Use the search key as a query parameter
      });
      const responseJson = response.data;

      if (responseJson.items) {
        setBooks(responseJson.items); // Update the state with the search results
      } else {
        setBooks([]); // Clear the books if no results are found
      }
    } catch (error) {
      console.error("Error fetching books:", error);
      setBooks([]); // Clear the books in case of an error
    }
  };

  // Function to clear the list of books
  const clearBooks = () => {
    setBooks([]);
  };

  // Render function for each book item
  const renderBookCard = (book) => (
    <>
      <Card.Img src={book.volumeInfo.imageLinks?.thumbnail} alt={book.volumeInfo.title} />
      <Card.Body>
        <Card.Title>{book.volumeInfo.title}</Card.Title>
        <Card.Text>{book.volumeInfo.authors ? book.volumeInfo.authors.join(', ') : "Unknown Author"}</Card.Text>
      </Card.Body>
    </>
  );

  return (
    <>
      <AppNavbar />
      <SearchBar
        placeholder="Search for Books..."
        searchFunction={searchBooks}
        clearFunction={clearBooks}
        searchKey={searchKey}
        setSearchKey={setSearchKey}
      />
      <GridCard
        items={books}
        renderItem={renderBookCard}
      />
    </>
  );
};

export default Books;

