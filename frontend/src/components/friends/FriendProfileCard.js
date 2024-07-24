import React, { useState } from 'react';
import axios from 'axios';
import { Card, Button, Image, Form } from 'react-bootstrap';

const FriendProfileCard = ({ friendBio, friendUsername }) => {
  

  return (
    <Card className="profile-card user-profile-card mb-4">
      <Card.Body className="profile-card-body d-flex flex-column align-items-center">
        <Image
          src={'https://via.placeholder.com/150'}
          roundedCircle
          width="150"
          height="150"
          className="mb-3"
        />
        <Card.Title className="profile-card-title">{friendUsername}'s Profile</Card.Title>
        <Card.Text className="profile-card-text">{friendBio}</Card.Text>
      </Card.Body>
    </Card>
  );
};

export default FriendProfileCard;