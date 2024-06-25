import React from 'react';
import { useNavigate } from 'react-router-dom'; // Import useHistory hook for navigation
import styles from './mediaobject.module.css'; // Import local CSS for styling

const MediaComponent = ({ id, image, title, creator, rating, status, description }) => {
  const history = useNavigate(); // Get the history object from react-router-dom

  // Function to navigate to media page on click
  const handleClick = () => {
    history.push(`/media/${id}`); // Navigate to '/media/:id' route
  };

  return (
    <div className={styles['media-component']} onClick={handleClick}>
      <div className={styles['media-image']}>
        <img src={image} alt={title} />
      </div>
      <div className={styles['media-details']}>
        <h2 className={styles['media-title']}>{title}</h2>
        <p className={styles['media-creator']}>Creator: {creator}</p>
        <p className={styles['media-rating']}>Rating: {rating}</p>
        <p className={styles['media-status']}>Status: {status}</p>
        <p className={styles['media-description']}>{description}</p>
      </div>
    </div>
  );
};

export default MediaComponent;
