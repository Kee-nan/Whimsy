import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate, useLocation } from 'react-router-dom';
import AppNavbar from '../../components/Navbar';
import SearchBar from '../../components/SearchBar';
import GridCard from '../../components/GridCard';
import { Card } from 'react-bootstrap';

const Books = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchKey, setSearchKey] = useState(location.state?.searchKey || "");
  const [books, setBooks] = useState(location.state?.searchResults || []);

  useEffect(() => {
    if (location.state?.searchKey) {
      searchBooks(location.state.searchKey);
    }
  }, [location.state]);

  const searchBooks = async (key) => {
    try {
      const response = await axios.get('https://www.googleapis.com/books/v1/volumes', {
        params: { q: key }
      });
      setBooks(response.data.items || []);
    } catch (error) {
      console.error("Error fetching books:", error);
      setBooks([]);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    searchBooks(searchKey);
  };

  const clearBooks = () => {
    setBooks([]);
  };

  const handleCardClick = (id) => {
    const currentState = {
      searchKey,
      searchResults: books
    };
    navigate(`/book/${id}`, { state: currentState });
  };

  const renderBookCard = (item) => (
    <>
      <Card.Img src={item.volumeInfo.imageLinks?.thumbnail || 'placeholder.jpg'} alt={item.volumeInfo.title} />
      <Card.Body>
        <Card.Title>{item.volumeInfo.title}</Card.Title>
      </Card.Body>
    </>
  );

  return (
    <>
      <AppNavbar />
      <SearchBar
        placeholder="Search for Books..."
        searchFunction={handleSearch}
        clearFunction={clearBooks}
        searchKey={searchKey}
        setSearchKey={setSearchKey}
      />
      <GridCard
        items={books.map(b => ({ ...b, id: b.id }))}
        renderItem={renderBookCard}
        onCardClick={handleCardClick}
      />
    </>
  );
};

export default Books;



