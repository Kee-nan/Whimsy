import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Spinner } from 'react-bootstrap';
import AppNavbar from '../components/Navbar';
import ProfileCard from '../components/profile/ProfileCard';
import FriendListTable from '../components/friends/FriendListTable';

const authHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem('user_token')}`,
});

const ViewFriendLists = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState('profile'); // 'profile' | 'list'

  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [lists, setLists] = useState({ completed: [], current: [], futures: [] });
  const [favorites, setFavorites] = useState([]);
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
        if (friendRes.status === 403) setError('You are not friends with this user.');
        else if (friendRes.status === 404) setError('User not found.');
        else setError('Failed to load this profile.');
        setLoading(false);
        return;
      }

      const data = await friendRes.json();
      setUsername(data.username);
      setBio(data.bio || '');
      setLists({
        completed: (data.lists || []).filter((item) => item.listType === 'completed'),
        current: (data.lists || []).filter((item) => item.listType === 'current'),
        futures: (data.lists || []).filter((item) => item.listType === 'futures'),
      });
      setFavorites(data.favorites || []);

      if (activityRes.ok) setActivity(await activityRes.json());
    } catch (err) {
      console.error('Error fetching friend data:', err);
      setError('Something went wrong loading this profile.');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { fetchFriendData(); }, [fetchFriendData]);

  if (loading) {
    return (
      <>
        <AppNavbar />
        <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
          <Spinner animation="border" variant="light" />
        </Container>
      </>
    );
  }

  if (error) {
    return (
      <>
        <AppNavbar />
        <Container className="text-center" style={{ paddingTop: '4rem', color: 'white' }}>
          <h3>{error}</h3>
          <button className="whimsy-btn whimsy-btn-ghost mt-3" onClick={() => navigate('/friend')}>← Back to Friends</button>
        </Container>
      </>
    );
  }

  return (
    <>
      <AppNavbar />
      <Container>
        <div className="d-flex gap-2 my-3">
          <button className={`whimsy-btn ${viewMode === 'profile' ? '' : 'whimsy-btn-ghost'}`} onClick={() => setViewMode('profile')}>
            Profile
          </button>
          <button className={`whimsy-btn ${viewMode === 'list' ? '' : 'whimsy-btn-ghost'}`} onClick={() => setViewMode('list')}>
            Lists
          </button>
        </div>

        {viewMode === 'profile' ? (
          <ProfileCard
            username={username}
            bio={bio}
            lists={lists}
            favorites={favorites}
            activity={activity}
            editable={false}
          />
        ) : (
          <FriendListTable friendId={id} friendUsername={username} />
        )}
      </Container>
    </>
  );
};

export default ViewFriendLists;




