import React from 'react';
import '../../styles/profilepage.css';

const FavoritesGrid = ({ onEditClick, favorites, editable = false, reviews = [] }) => {
  const slots = Array(8).fill(null).map((_, i) => favorites?.[i] || null);

  const getRating = (item) => {
    if (!item) return null;
    const review = reviews.find((r) => r.id === item.id);
    return review ? review.rating : null;
  };

  return (
    <div className="favorites-box">
      <div className="favorites-header">
        <h4>Favorites</h4>
        {editable && <button className="smallButton" onClick={onEditClick}>Edit</button>}
      </div>

      <div className="favorites-grid">
        {slots.map((item, index) => {
          const rating = getRating(item);
          return (
            <div key={index} className="favorite-cell">
              <div className="favorite-cell-image">
                <img src={(item && item.image) || 'https://via.placeholder.com/80x100'} alt={(item && item.title) || `Slot ${index + 1}`} />
              </div>
              <div className="favorite-cell-info">
                <span className="favorite-cell-title">{(item && item.title) || '—'}</span>
                {item && rating != null && <span className="favorite-cell-score">{rating}/30</span>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FavoritesGrid;