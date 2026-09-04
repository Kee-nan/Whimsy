import React, { useEffect, useState } from 'react';
import { Container, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import AppNavbar from '../components/Navbar';

const MEDALS = { 1: '🥇', 2: '🥈', 3: '🥉' };


const Global = () => {
  const [topRated, setTopRated] = useState([]);
  const [mediaFilter, setMediaFilter] = useState('All');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [source, setSource] = useState('whimsy');

  useEffect(() => {
    const fetchTopRated = async () => {
      setLoading(true);
      const token = localStorage.getItem('user_token');
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/global/top-rated?source=${source}${mediaFilter !== 'All' ? `&mediaType=${mediaFilter}` : ''}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) setTopRated(await res.json());
      setLoading(false);
    };
    fetchTopRated();
  }, [mediaFilter]);

  return (
    <>
      <AppNavbar />
      <Container className="mt-5" style={{ color: 'white' }}>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2>Global Leaderboard</h2>
          <Form.Select style={{ width: '180px' }} value={mediaFilter} onChange={(e) => setMediaFilter(e.target.value)}>
            <option value="All">All Types</option>
            <option value="movie">Movies</option>
            <option value="show">Shows</option>
            <option value="anime">Anime</option>
            <option value="manga">Manga</option>
            <option value="book">Books</option>
            <option value="game">Games</option>
            <option value="album">Albums</option>
          </Form.Select>
          <Form.Select style={{ width: '200px' }} value={source} onChange={(e) => setSource(e.target.value)}>
            <option value="whimsy">Whimsy Community Ratings</option>
            <option value="external">Source Website Ratings</option>
          </Form.Select>
        </div>

        <div className="global-leaderboard-card">
          <div className="global-leaderboard-header">
            <span>Rank</span><span>Title</span><span>Type</span><span>Avg Rating</span><span># Reviews</span>
          </div>
          <div className="global-leaderboard-scroll">
            {loading ? (
              <p style={{ color: '#999', padding: '1rem' }}>Loading...</p>
            ) : topRated.length === 0 ? (
              <p style={{ color: '#999', padding: '1rem' }}>No rated media yet — be the first to leave a review!</p>
            ) : (
              topRated.map((item) => (
                <div
                  key={item.id}
                  className="global-leaderboard-row"
                  onClick={() => navigate(`/${item.media}/${item.id.split('/').slice(1).join('/')}`)}
                >
                  <span className="rank-cell">{MEDALS[item.rank] || `#${item.rank}`}</span>
                  <span className="title-cell">
                    <img src={item.image} alt={item.title} className="leaderboard-thumb" />
                    {item.title}
                  </span>
                  <span className="type-cell">{item.media}</span>
                  <span className="rating-cell">{item.averageRating}/30</span>
                  <span className="count-cell">{item.reviewCount}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </Container>
    </>
  );
};

export default Global;