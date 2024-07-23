//frontend\src\pages\friend.js
import React from 'react';
import FriendRequestForm from '../components/friends/SendRequest';
import PendingFriendRequests from '../components/friends/PendingRequests';
import FriendsList from '../components/friends/FriendList';
import AppNavbar from '../components/Navbar';

const FriendPage = () => {
  return (
    <>
      <AppNavbar />

      <div>
        <h1>Friends</h1>
        <FriendRequestForm />
        <PendingFriendRequests />
        <FriendsList />
      </div>

    </>
    
  );
};

export default FriendPage;
