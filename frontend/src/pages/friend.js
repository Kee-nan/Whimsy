//frontend\src\pages\friend.js
import React from 'react';
import AppNavbar from '../components/Navbar';
import { Container } from 'react-bootstrap';
import FriendPageCard from '../components/friends/FriendPageCard';
import FriendRecommendationsCard from '../components/friends/FriendRecommendationsCard';

const FriendPage = () => {
  return (
    <>
      <AppNavbar />

      <Container>
        <FriendPageCard />
        <FriendRecommendationsCard />
      </Container>
        
    </>
    
  );
};

export default FriendPage;
