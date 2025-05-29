import React, { useEffect, useState } from 'react';
import '../styles/profilepage.css'; // we'll create this file next

const GreatEight = () => {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const fetchFavorites = async () => {
      const token = localStorage.getItem('user_token');
      try {
        const res = await fetch('http://localhost:5000/api/list/favorites', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error('Failed to fetch favorites');
        const data = await res.json();
        setFavorites(data.slice(0, 8)); // just show top 8
      } catch (error) {
        console.error(error);
      }
    };

    fetchFavorites();
  }, []);

  return (
    <div className="great-eight-container">
      <h3 className="great-eight-title">Great Eight</h3>
      <div className="great-eight-grid">
        {favorites.map((item, index) => (
          <div key={index} className="great-eight-card">
            <img src={item.image || 'https://via.placeholder.com/80x100'} alt={item.title} />
            <div className="great-eight-title-text">
              <p>{item.title}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GreatEight;
