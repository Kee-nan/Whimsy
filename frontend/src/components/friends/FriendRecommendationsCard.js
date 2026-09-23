import React, { useEffect, useState } from 'react';
import ActivityFeed from '../profile/ActivityFeed';
import { Container } from 'react-bootstrap';

const FriendRecommendationsCard = () => {
  const [activity, setActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeed = async () => {
      const token = localStorage.getItem('user_token');
      try {
        const res = await fetch(`${process.env.REACT_APP_API_URL}/api/activity/friends-feed`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) setActivity(await res.json());
      } catch (err) {
        console.error('Error fetching friends activity feed:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchFeed();
  }, []);

  if (loading) return null;

  return (

    <Container className="friend-recommendations-card">
      <ActivityFeed activity={activity} title="What Your Friends Are Logging" showUsername />
    </Container>
  )

};

export default FriendRecommendationsCard;