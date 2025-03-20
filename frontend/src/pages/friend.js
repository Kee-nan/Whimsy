//frontend\src\pages\friend.js
import React from 'react';
import FriendRequestForm from '../components/friends/SendRequest';
import PendingFriendRequests from '../components/friends/PendingRequests';
import FriendsList from '../components/friends/FriendList';
import AppNavbar from '../components/Navbar';
import { Container } from 'react-bootstrap';

const FriendPage = () => {
  return (
    <>
      <AppNavbar />

      <Container>
        <FriendsList />
        <PendingFriendRequests />
        <FriendRequestForm />
      </Container>
        
    </>
    
  );
};

export default FriendPage;
