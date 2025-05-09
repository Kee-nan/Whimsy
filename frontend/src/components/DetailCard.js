import React, { useEffect, useState, useCallback } from 'react';
import { Dropdown, DropdownButton } from 'react-bootstrap';
import '../styles/detailpage.css';

const DetailCard = ({ image, title, details, summary, type, mediaId, userLists, onAddToList, onReview, onBack, review, onEdit, onDelete }) => {
  let imageClass = 'anime-image';

  
  if (type === 'album') {
    imageClass += ' square large';
  } else if (type === 'game') {
    imageClass += ' landscape';
  } else  {
    imageClass += ' portrait large';
  }
  const getInitial = useCallback(() => {
    for (const listType of ['completed', 'current', 'futures']) {
      const arr = userLists[listType] || [];
      if (arr.find(item => item.id === mediaId)) {
        return listType;
      }
    }
    return 'none';
  }, [userLists, mediaId]);

  const [selected, setSelected] = useState(getInitial());

  useEffect(() => {
    setSelected(getInitial());
  }, [getInitial]);

  const handleChange = (newType) => {
    if (newType === selected) return;
    setSelected(newType);
    const mediaObj = { id: mediaId, media: type, title, image, listType: newType };
    onAddToList(newType, mediaId, mediaObj);
  };

  const buttonLabel = selected === 'none'
    ? 'Add to List'
    : selected.charAt(0).toUpperCase() + selected.slice(1);

  return (
    <div className="anime-detail-container">
      {/* LEFT SIDE */}
      <div className="anime-left">
        <div className="title-row">
          {onBack && (
            <div className="back-container">
              <div className="btn btn-outline-light back-arrow" onClick={onBack}>
                ←
              </div>
            </div>
          )}
          <div className="title-container">
            <div className="anime-title">{title}</div>
          </div>
        </div>
        <div className="image-wrapper">
          <img src={image} alt={title} className={imageClass} />
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="anime-right">
        {/* 2x3 Details Grid */}
        <div className="details-grid">
          {details.map((item, idx) => (
            <div key={idx} className="detail-cell">{item}</div>
          ))}
        </div>

        {/* Summary Box */}
        <div className="summary-box">{summary}</div>

        {/* 3x1 Stats Grid */}
        <div className="stats-grid">
          {( [<p>Global Rating: 0</p>, <p>Friend Rating: 0</p> , <p>Your Rating: {review ? review.rating : "n/a"} </p>]).map((stat, idx) => (
            <div key={idx} className="stat-cell">{stat}</div>
          ))}
        </div>

        {/* Review Box */}
        <div className="review-box">
          <h5 style={{ textAlign: 'left' }}>Your Review:</h5>
          <p>{review ? review.review : "Not yet reviewed"}</p>
        </div>

        {/* Buttons */}
        <div className="anime-buttons">
          <DropdownButton title={buttonLabel} variant="secondary">
            <Dropdown.Item onClick={() => handleChange('completed')}>Completed</Dropdown.Item>
            <Dropdown.Item onClick={() => handleChange('current')}>Current</Dropdown.Item>
            <Dropdown.Item onClick={() => handleChange('futures')}>Futures</Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Item onClick={() => handleChange('none')}>None</Dropdown.Item>
          </DropdownButton>
          <button className="btn btn-outline-light" onClick={onReview}>Reviews</button>
          <button className='btn btn-outline-light' onClick={onEdit}>Edit Review</button>
          <button className='btn btn-outline-light' onClick={onDelete}>Delete Review</button>
        </div>
      </div>
    </div>
  );
};

export default DetailCard;



