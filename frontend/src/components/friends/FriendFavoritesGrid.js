// src/components/profile/FriendFavoritesGrid.js
import React from 'react';
import '../../styles/profilepage.css';

const FriendFavoritesGrid = ({ favorites }) => {
  // Ensure we always render 8 slots, filling missing ones with placeholders
  const slots = Array(8).fill(null).map((_, i) => favorites?.[i] || null);

  return (
    <div className="favorites-box">
      <div className="favorites-header">
        <h4>{favorites?.length ? "Favorites" : "No Favorites Yet"}</h4>
      </div>

      <div className="favorites-grid">
        {slots.map((item, index) => (
          <div key={index} className="favorite-tile">
            <img
              src={item?.image || 'https://via.placeholder.com/80x100'}
              alt={item?.title || `Slot ${index + 1}`}
            />
            <p className="favorite-title">{item?.title || '-'}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FriendFavoritesGrid;