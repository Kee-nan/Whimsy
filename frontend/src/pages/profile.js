import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container } from 'react-bootstrap';
import AppNavbar from '../components/Navbar';
import UserProfileCard from '../components/ProfileCard';

const Profile = () => {
  const [user, setUser] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    bio: '',
    profilePicture: '',
  });

  useEffect(() => {

    //Get User Details from Database to use to Load on page
    const fetchUserDetails = async () => {
      try {
        const user_token = localStorage.getItem('user_token');
        const headers = {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user_token}`,
        };

        const response = await axios.get('http://localhost:5000/api/accounts/user', { headers });

        if (response.status !== 200) {
          throw new Error('Error fetching user details');
        }

        setUser(response.data);
      } catch (error) {
        console.error('Error fetching user details:', error);
      }
    };

    fetchUserDetails();
  }, []);


  return (
    <>
      <AppNavbar />
      
      <Container>

        <UserProfileCard user={user} setUser={setUser} />

      </Container>
    </>
  );
};

export default Profile;



