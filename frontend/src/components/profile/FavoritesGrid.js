// src/components/FavoritesGrid.js
import React from 'react';
import '../../styles/profilepage.css';

const FavoritesGrid = ({ onEditClick, favorites }) => {
  // Ensure we always have an array of 8 slots (fill empty ones with nulls)
  const slots = Array(8).fill(null).map((_, i) => favorites?.[i] || null);

  return (
    <div className="favorites-box">
      <div className="favorites-header">
        <h4>Favorites</h4>
        <button className="smallButton" onClick={onEditClick}>
          Edit
        </button>
      </div>

      <div className="favorites-grid">
        {slots.map((item, index) => (
          <div key={index} className="favorite-tile">
            <img
              src={(item && item.image) || 'https://via.placeholder.com/80x100'}
              alt={(item && item.title) || `Slot ${index + 1}`}
            />
            <p className="favorite-title">{(item && item.title) || '-'}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FavoritesGrid;

