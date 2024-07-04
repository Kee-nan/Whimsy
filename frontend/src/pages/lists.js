// src/pages/Lists.js
import React, { useEffect, useState } from 'react';
import { Container, Button } from 'react-bootstrap';
import AppNavbar from '../components/Navbar';
import ListCard from '../components/ListCard';

const Lists = () => {
  const [completedList, setCompletedList] = useState([]);
  const [futuresList, setFuturesList] = useState([]);

  useEffect(() => {
    const savedCompletedList = JSON.parse(localStorage.getItem('completedList')) || [];
    const savedFuturesList = JSON.parse(localStorage.getItem('futuresList')) || [];
    setCompletedList(savedCompletedList);
    setFuturesList(savedFuturesList);
  }, []);

  const handleNavigate = (url) => {
    window.location.href = `/${url}`;
  };

  const handleDelete = (url, listName) => {
    const updatedList = listName === 'completedList' 
      ? completedList.filter(item => item.url !== url) 
      : futuresList.filter(item => item.url !== url);
    
    listName === 'completedList'
      ? setCompletedList(updatedList)
      : setFuturesList(updatedList);
      
    localStorage.setItem(listName, JSON.stringify(updatedList));
  };

  const clearList = (listName) => {
    localStorage.removeItem(listName);
    listName === 'completedList' ? setCompletedList([]) : setFuturesList([]);
  };

  return (
    <>
      <AppNavbar />
      <Container className="mt-5">
        <h2>Your Lists</h2>
        <Button variant="danger" onClick={() => clearList('completedList')}>Clear Completed List</Button>
        <Button variant="danger" onClick={() => clearList('futuresList')}>Clear Futures List</Button>
        <div>
          <h3>Completed</h3>
          <div className="d-flex flex-nowrap overflow-auto">
            {completedList.map((item, index) => (
              <ListCard
                key={index}
                item={item}
                onNavigate={handleNavigate}
                onDelete={(url) => handleDelete(url, 'completedList')}
              />
            ))}
          </div>
        </div>
        <div>
          <h3>Futures</h3>
          <div className="d-flex flex-nowrap overflow-auto">
            {futuresList.map((item, index) => (
              <ListCard
                key={index}
                item={item}
                onNavigate={handleNavigate}
                onDelete={(url) => handleDelete(url, 'futuresList')}
              />
            ))}
          </div>
        </div>
      </Container>
    </>
  );
};

export default Lists;



