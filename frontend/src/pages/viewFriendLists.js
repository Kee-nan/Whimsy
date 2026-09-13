import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Spinner } from 'react-bootstrap';
import AppNavbar from '../components/Navbar';
import ProfileCard from '../components/profile/ProfileCard';
import FriendListTable from '../components/friends/FriendListTable';

const authHeaders = () => ({ Authorization: `Bearer ${localStorage.getItem('user_token')}` });

const ToggleButtons = ({ viewMode, setViewMode }) => (
  <>
    <button className={`whimsy-btn ${viewMode === 'profile' ? '' : 'whimsy-btn-ghost'}`} onClick={() => setViewMode('profile')}>Profile</button>
    <button className={`whimsy-btn ${viewMode === 'list' ? '' : 'whimsy-btn-ghost'}`} onClick={() => setViewMode('list')}>Lists</button>
  </>
);

const ViewFriendLists = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState('profile');

  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [profilePicture, setProfilePicture] = useState(null);
  const [lists, setLists] = useState({ completed: [], current: [], futures: [] });
  const [favorites, setFavorites] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [activity, setActivity] = useState([]);

  const fetchFriendData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const headers = authHeaders();
      const [friendRes, activityRes] = await Promise.all([
        fetch(`${process.env.REACT_APP_API_URL}/api/friends/friend-lists/${id}`, { headers }),
        fetch(`${process.env.REACT_APP_API_URL}/api/activity/user/${id}`, { headers }),
      ]);

      if (!friendRes.ok) {
        setError(friendRes.status === 403 ? 'You are not friends with this user.' : friendRes.status === 404 ? 'User not found.' : 'Failed to load this profile.');
        return;
      }

      const data = await friendRes.json();
      setUsername(data.username);
      setBio(data.bio || '');
      setProfilePicture(data.profilePicture ? `${process.env.REACT_APP_API_URL}${data.profilePicture}` : null);
      setLists({
        completed: (data.lists || []).filter((i) => i.listType === 'completed'),
        current: (data.lists || []).filter((i) => i.listType === 'current'),
        futures: (data.lists || []).filter((i) => i.listType === 'futures'),
      });
      setFavorites(data.favorites || []);
      setReviews(data.reviews || []);
      if (activityRes.ok) setActivity(await activityRes.json());
    } catch (err) {
      console.error(err);
      setError('Something went wrong loading this profile.');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { fetchFriendData(); }, [fetchFriendData]);

  if (loading) {
    return (<><AppNavbar /><Container className="d-flex justify-content-center" style={{ minHeight: '60vh' }}><Spinner animation="border" variant="light" /></Container></>);
  }
  if (error) {
    return (<><AppNavbar /><Container className="text-center" style={{ paddingTop: '4rem', color: 'white' }}><h3>{error}</h3><button className="whimsy-btn whimsy-btn-ghost mt-3" onClick={() => navigate('/friend')}>← Back to Friends</button></Container></>);
  }

  return (
    <>
      <AppNavbar />
      {viewMode === 'profile' ? (
        <>
          <div className="filter-bar">
            <div className="filter-bar-inner">
              <h4 className="filter-bar-title">Viewing {username}'s Profile</h4>
              <ToggleButtons viewMode={viewMode} setViewMode={setViewMode} />
            </div>
          </div>
          <Container>
            <ProfileCard
              username={username} bio={bio} lists={lists} favorites={favorites}
              reviews={reviews} activity={activity} profilePicture={profilePicture}
              editable={false} viewedUserId={id}
            />
          </Container>
        </>
      ) : (
        <FriendListTable
          friendId={id}
          friendUsername={username}
          titleText={`Viewing ${username}'s Profile`}
          toggleButtons={<ToggleButtons viewMode={viewMode} setViewMode={setViewMode} />}
        />
      )}
    </>
  );
};

export default ViewFriendLists;




