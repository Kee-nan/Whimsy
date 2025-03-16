// import React from 'react';
// import { Card } from 'react-bootstrap';
// import { useNavigate } from 'react-router-dom';

// const ListCard = ({ item, reviewData, onNavigate, onDelete, type = 'poster', listType }) => {
//   const navigate = useNavigate();

//   const handleCardClick = () => {
//     navigate(`/${item.id}`);
//   };

//   // Find the corresponding review for this item
//   const review = reviewData ? reviewData.find(r => r.id === `${item.id}`) : null;

//   return (
//     <Card className="grid-card-body" onClick={handleCardClick}>
//       <Card.Img src={item.image} className="grid-card-image poster" />
//       <Card.Body>
//         <Card.Title className="grid-card-title" style={{ color: 'white' }}>{item.title}</Card.Title>
//         <Card.Text className="grid-card-title" style={{ color: 'white' }}>
//           {review ? `Rating: ${review.rating}` : 'No rating available'}
//         </Card.Text>
//       </Card.Body>
//     </Card>
//   );
// };

// export default ListCard;

import React from 'react';
import { Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const ListCard = ({ item, reviewData, onNavigate, onDelete, type = 'poster', listType }) => {
  const navigate = useNavigate();

  // If Card is clicked on, take the user to the details page for that item
  const handleCardClick = () => {
    navigate(`/${item.id}`);
  };

  // Find the corresponding review for this item
  const review = reviewData ? reviewData.find(r => r.id === `${item.id}`) : null;

  // Determine the class based on the type of media to properly assign image dimensions
  const getImageClass = () => {
    if (item.media === 'album') return 'grid-card-image album';
    if (item.media === 'game') return 'grid-card-image game';
    return 'grid-card-image poster'; // Default to poster
  };

  return (
    <Card className="grid-card-body landscape" onClick={handleCardClick}>
      <div className="grid-card-content">
        <Card.Img src={item.image} className={getImageClass()} />
        <div className="grid-card-text">
          <Card.Title className="grid-card-title">{item.title}</Card.Title>
          <Card.Text className="grid-card-info">
            {review ? `Rating: ${review.rating}` : 'No rating available'}
          </Card.Text>
        </div>
      </div>
    </Card>
  );
};

export default ListCard;




