// src/components/DetailCard.js
import React, { useEffect, useState, useCallback } from 'react';
import { Card, Container, Dropdown, DropdownButton } from 'react-bootstrap';

const DetailCard = ({ image, title, details, type, mediaId, userLists, onAddToList, onReview }) => {
  // Determine the class based on the media type
  const imageClass = `detail-image ${type ? `detail-image-${type}` : ''}`;

  // Detect current listType (if any)
  const getInitial = useCallback(() => {
        // userLists is { completed: [...], current: [...], futures: [...] }
        // look in each array for this mediaId
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
    if (newType===selected) return;
    setSelected(newType);
    
    // build the media object for upsert
    const mediaObj = { id: mediaId, media: type, title, image, listType: newType };
    onAddToList(newType, mediaId, mediaObj);
  };

  // derive a human‑friendly label
  const buttonLabel = selected === 'none'
    ? 'Add to List'
    : selected.charAt(0).toUpperCase() + selected.slice(1);

  return (
    <Container className="detail-container">
      <Card className="detail-card">
        <div className="detail-card-container">
          <Card.Img className={imageClass} src={image} alt={title} />
          <Card.Body className="detail-body">
            <Card.Title className="detail-title" style = {{color: 'white'}}>{title}</Card.Title>
            <Card.Text as="div" className="detail-text">{details}</Card.Text>

            {/* Dropdown to choose which list to add media to */}
            <DropdownButton title={buttonLabel} variant="secondary">
              <Dropdown.Item onClick={() => handleChange('completed')}>Completed</Dropdown.Item>
              <Dropdown.Item onClick={() => handleChange('current')}>Current</Dropdown.Item>
              <Dropdown.Item onClick={() => handleChange('futures')}>Futures</Dropdown.Item>
              <Dropdown.Divider />
              <Dropdown.Item onClick={() => handleChange('none')}>None</Dropdown.Item>
            </DropdownButton>


            <div className="detail-buttons"> 
              <button className="reviewButton" onClick={onReview}>Reviews</button>
            </div>
          </Card.Body>
        </div>
      </Card>
    </Container>
  );
};

export default DetailCard;


