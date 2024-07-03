// src/pages/Lists.js
import React, { useEffect, useState } from 'react';
import { Container, Button } from 'react-bootstrap';
import AppNavbar from '../components/Navbar';
import ListCard from '../components/ListCard';

const Lists = () => {
  const [watchlist, setWatchlist] = useState([]);

  useEffect(() => {
    const savedWatchlist = JSON.parse(localStorage.getItem('watchlist')) || [];
    setWatchlist(savedWatchlist);
  }, []);

  const handleNavigate = (url) => {
    window.location.href = `/${url}`;
  };

  const handleDelete = (url) => {
    const updatedWatchlist = watchlist.filter(item => item.url !== url);
    setWatchlist(updatedWatchlist);
    localStorage.setItem('watchlist', JSON.stringify(updatedWatchlist));
  };

  const clearWatchlist = () => {
    localStorage.removeItem('watchlist');
    setWatchlist([]);
  };

  return (
    <>
      <AppNavbar />
      <Container className="mt-5">
        <h2>Your Watchlist</h2>
        <Button variant="danger" onClick={clearWatchlist}>Clear List</Button>
        <div className="d-flex flex-wrap">
          {watchlist.map((item, index) => (
            <ListCard
              key={index}
              item={item}
              onNavigate={handleNavigate}
              onDelete={handleDelete}
            />
          ))}
        </div>
      </Container>
    </>
  );
};

export default Lists;



