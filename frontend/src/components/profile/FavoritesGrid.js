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
            <div key={index} className="favorite-tile">
              <img
                src={(item && item.image) || 'https://via.placeholder.com/80x100'}
                alt={(item && item.title) || `Slot ${index + 1}`}
                className="favorite-tile-img-plain"
              />
              <div className="favorite-tile-text">
                <p className="favorite-title-plain">{(item && item.title) || '-'}</p>
                {item && rating != null && <p className="favorite-rating-plain">{rating}/30</p>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FavoritesGrid;