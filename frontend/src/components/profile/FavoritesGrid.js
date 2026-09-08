import React from 'react';
import '../../styles/profilepage.css';

/**
 * Shared favorites grid for both the logged-in user's own profile
 * (editable) and a friend's read-only profile (editable=false hides
 * the Edit button and nothing else changes).
 */
const FavoritesGrid = ({ favorites, editable = false, onEditClick }) => {
  const slots = Array(8).fill(null).map((_, i) => favorites?.[i] || null);

  return (
    <div className="favorites-box">
      <div className="favorites-header">
        <h4>{favorites?.some(Boolean) ? 'Favorites' : 'No Favorites Yet'}</h4>
        {editable && (
          <button className="smallButton" onClick={onEditClick}>Edit</button>
        )}
      </div>

      <div className="favorites-grid">
        {slots.map((item, index) => (
          <div key={index} className="favorite-tile">
            <img
              src={(item && item.image) || 'https://via.placeholder.com/80x100'}
              alt={(item && item.title) || `Slot ${index + 1}`}
              className="favorite-tile-img"  // NEW class, styled below
            />
            <p className="favorite-title-bold">{(item && item.title) || '-'}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FavoritesGrid;
