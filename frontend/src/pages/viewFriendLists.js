import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Spinner, Form } from 'react-bootstrap';
import AppNavbar from '../components/Navbar';
import ProfileCard from '../components/profile/ProfileCard';
import FriendListTable from '../components/friends/FriendListTable';
import FriendTagsList from '../components/friends/FriendTagsList';
import FriendTagDetail from '../components/friends/FriendTagDetail';

const authHeaders = () => ({ Authorization: `Bearer ${localStorage.getItem('user_token')}` });

const ViewModeSelect = ({ viewMode, setViewMode }) => (
  <Form.Select
    className="filter-bar-select"
    style={{ width: '150px' }}
    value={viewMode}
    onChange={(e) => setViewMode(e.target.value)}
  >
    <option value="profile">Profile</option>
    <option value="list">Lists</option>
    <option value="tags">Tags</option>
  </Form.Select>
);

const ViewFriendLists = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState('profile');
  const [selectedTagId, setSelectedTagId] = useState(null);

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
  useEffect(() => { setSelectedTagId(null); }, [viewMode]);

  if (loading) return (<><AppNavbar /><Container className="d-flex justify-content-center" style={{ minHeight: '60vh' }}><Spinner animation="border" variant="light" /></Container></>);
  if (error) return (<><AppNavbar /><Container className="text-center" style={{ paddingTop: '4rem', color: 'white' }}><h3>{error}</h3><button className="whimsy-btn whimsy-btn-ghost mt-3" onClick={() => navigate('/friend')}>← Back to Friends</button></Container></>);

  return (
    <>
      <AppNavbar />
      {viewMode === 'profile' && (
        <>
          <div className="filter-bar">
            <div className="filter-bar-inner">
              <h4 className="filter-bar-title">Viewing {username}'s Profile</h4>
              <ViewModeSelect viewMode={viewMode} setViewMode={setViewMode} />
            </div>
          </div>
          <Container>
            <ProfileCard username={username} bio={bio} lists={lists} favorites={favorites} reviews={reviews} activity={activity} profilePicture={profilePicture} editable={false} viewedUserId={id} />
          </Container>
        </>
      )}

      {viewMode === 'list' && (
        <FriendListTable
          friendId={id}
          friendUsername={username}
          titleText={`Viewing ${username}'s Profile`}
          toggleButtons={<ViewModeSelect viewMode={viewMode} setViewMode={setViewMode} />}
        />
      )}

      {viewMode === 'tags' && (
        selectedTagId ? (
          <FriendTagDetail friendId={id} listId={selectedTagId} onBack={() => setSelectedTagId(null)} />
        ) : (
          <FriendTagsList
            friendId={id}
            friendUsername={username}
            titleText={`Viewing ${username}'s Profile`}
            toggleControl={<ViewModeSelect viewMode={viewMode} setViewMode={setViewMode} />}
            onSelectTag={setSelectedTagId}
          />
        )
      )}
    </>
  );
};

export default ViewFriendLists;




