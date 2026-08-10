import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { Container } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import AppNavbar from '../components/Navbar';
import ProfileCard from '../components/profile/ProfileCard';
import AccountSettingsModal from '../components/profile/AccountSettingsModal';
import FavoritesModal from '../components/profile/FavoritesModal';
import { checkTokenExpiration } from '../utils/checkTokenExpiration';

const authHeaders = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${localStorage.getItem('user_token')}`,
});

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [lists, setLists] = useState({ completed: [], current: [], futures: [] });
  const [favorites, setFavorites] = useState(Array(8).fill(null));
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showFavsModal, setShowFavsModal] = useState(false);
  const [viewSetting, setViewSetting] = useState('card');
  const [activity, setActivity] = useState([]);

  const fetchAll = useCallback(async () => {
    if (checkTokenExpiration(navigate)) return;
    try {
      const [userRes, listsRes, favsRes, activityRes] = await Promise.all([
        axios.get(`${process.env.REACT_APP_API_URL}/api/accounts/user`, { headers: authHeaders() }),
        axios.get(`${process.env.REACT_APP_API_URL}/api/list/lists`, { headers: authHeaders() }),
        axios.get(`${process.env.REACT_APP_API_URL}/api/accounts/favorites`, { headers: authHeaders() }),
        axios.get(`${process.env.REACT_APP_API_URL}/api/activity/me`, { headers: authHeaders() }),
      ]);
      setUser(userRes.data);
      setViewSetting(userRes.data.view_setting || 'card');
      setLists(listsRes.data);
      setFavorites(favsRes.data);
      setActivity(activityRes.data);
    } catch (err) {
      console.error('Error loading profile:', err);
    }
  }, [navigate]);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const handleUpdateBio = async (newBio) => {
    try {
      const res = await axios.patch(
        `${process.env.REACT_APP_API_URL}/api/accounts/bio`,
        { bio: newBio },
        { headers: authHeaders() }
      );
      setUser((prev) => ({ ...prev, bio: res.data.bio }));
    } catch (err) {
      console.error('Error updating bio:', err);
      alert('Could not save bio. Please try again.');
    }
  };

  const updateUser = async (updatedUser) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/accounts/user`, {
        method: 'PUT',
        headers: authHeaders(),
        body: JSON.stringify(updatedUser),
      });
      if (!response.ok) throw new Error(await response.text());
      const data = await response.json();
      setUser((prev) => ({ ...prev, ...data }));
    } catch (err) {
      console.error('Error updating user:', err);
    }
  };

  const handleSignOut = () => {
    if (window.confirm('Are you sure you would like to sign out?')) {
      localStorage.removeItem('user_token');
      navigate('/login');
    }
  };

  if (!user) return null;

  return (
    <>
      <AppNavbar />
      <Container>
        <ProfileCard
          username={user.username}
          bio={user.bio}
          lists={lists}
          favorites={favorites}
          editable={true}
          onUpdateBio={handleUpdateBio}
          onEditFavorites={() => setShowFavsModal(true)}
          onSignOut={handleSignOut}
          onOpenSettings={() => setShowSettingsModal(true)}
          profilePicture={user.profilePicture ? `${process.env.REACT_APP_API_URL}${user.profilePicture}` : null}
          activity={activity}
        />
      </Container>

      <AccountSettingsModal
        show={showSettingsModal}
        handleClose={() => setShowSettingsModal(false)}
        user={user}
        updateUser={updateUser}
        viewSetting={viewSetting}
        setViewSetting={setViewSetting}
        onProfilePictureUpdated={(newPath) => setUser((prev) => ({ ...prev, profilePicture: newPath }))}
      />

      <FavoritesModal
        show={showFavsModal}
        onHide={() => setShowFavsModal(false)}
        allLists={lists}
        userFavorites={favorites}
        setUserFavorites={setFavorites}
      />
    </>
  );
};

export default Profile;


