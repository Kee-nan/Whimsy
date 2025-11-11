import React from 'react';
import { Card } from 'react-bootstrap';

const FriendListCard = ({ item, reviewData, onCardClick }) => {
  // Find the corresponding review for this item
  const review = reviewData ? reviewData.find(r => r.id === `${item.id}`) : null;

  // Determine the class based on the type of media to properly assign image dimensions
  const getImageClass = () => {
    if (item.media === 'album') return 'grid-card-image album';
    if (item.media === 'game') return 'grid-card-image game';
    return 'grid-card-image poster'; // Default to poster
  };

  return (
    <Card className="grid-card-body landscape" onClick={() => onCardClick(item)}>
      <div className="grid-card-content">
        <Card.Img src={item.image} className={getImageClass()} />
        <div className="grid-card-text">
          <Card.Title className="grid-card-title">{item.title}</Card.Title>
          <Card.Text className="grid-card-title">
            {review ? `Rating: ${review.rating}` : 'No rating available'}
          </Card.Text>
        </div>
      </div>
  </Card>
  );
};

export default FriendListCard;
