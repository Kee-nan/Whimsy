import React, { useEffect, useState } from 'react';
import '../../styles/profilepage.css';

const FavoritesGrid = ({ onEditClick }) => {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const fetchFavorites = async () => {
      const token = localStorage.getItem('user_token');
      try {
        const res = await fetch('http://localhost:5000/api/accounts/favorites', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error('Failed to fetch favorites');
        const data = await res.json();
        setFavorites(data.slice(0, 8)); // only show top 8
      } catch (error) {
        console.error(error);
      }
    };

    fetchFavorites();
  }, []);

  return (
    <div className="favorites-box">
      <div className="favorites-header">
        <h4>Favorites</h4>
        <button className="smallButton" onClick={onEditClick}>Edit</button>
      </div>

      <div className="favorites-grid">
        {favorites.map((item, index) => (
          <div key={index} className="favorite-tile">
            <img src={item.image || 'https://via.placeholder.com/80x100'} alt={item.title} />
            <p className="favorite-title">{item.title}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FavoritesGrid;
