import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/friendpage.css';

const cap = (s) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : s);

/**
 * "Friends also logged" recommendations — the highest-value, lowest-
 * effort recommendation feature for a small trusted group: shows what
 * friends are currently adding/reviewing that the user doesn't have on
 * any of their own lists yet.
 */
const FriendRecommendationsCard = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRecs = async () => {
      const token = localStorage.getItem('user_token');
      try {
        const res = await fetch(`${process.env.REACT_APP_API_URL}/api/activity/recommendations`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) setRecommendations(await res.json());
      } catch (err) {
        console.error('Error fetching recommendations:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchRecs();
  }, []);

  const handleClick = (item) => {
    const [mediaType, ...rest] = item.id.split('/');
    navigate(`/${mediaType}/${rest.join('/')}`);
  };

  return (
    <div className="friend-page-container recommendations-container">
      <div className="friend-section" style={{ flex: 1 }}>
        <div className="section-header">
          <h2>What Your Friends Are Logging</h2>
        </div>
        <div className="scroll-box">
          {loading ? (
            <p>Loading...</p>
          ) : recommendations.length > 0 ? (
            recommendations.map((item) => (
              <div key={item.id} className="friend-row recommendation-row" onClick={() => handleClick(item)}>
                <img src={item.image || 'placeholder.jpg'} alt={item.title} className="recommendation-thumb" />
                <div className="recommendation-info">
                  <span className="recommendation-title">{item.title}</span>
                  <span className="recommendation-meta">{cap(item.media)} · logged by {item.loggedBy}</span>
                </div>
              </div>
            ))
          ) : (
            <p>None of your friends have logged anything new recently.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default FriendRecommendationsCard;