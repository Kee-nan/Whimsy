//frontend\src\pages\friend.js
import React from 'react';
import AppNavbar from '../components/Navbar';
import { Container } from 'react-bootstrap';
import FriendPageCard from '../components/friends/FriendPageCard';

const FriendPage = () => {
  return (
    <>
      <AppNavbar />

      <Container>
        <FriendPageCard />
      </Container>
        
    </>
    
  );
};

export default FriendPage;
