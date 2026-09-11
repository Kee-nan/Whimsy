import React, { useEffect, useState, useCallback } from 'react';
import { Dropdown, DropdownButton } from 'react-bootstrap';
import '../../styles/detailpage.css';
import FriendActivityList from './FriendActivityList';
import LoggedDateEditor from './loggedDateEditor';
import CustomListSelector from '../lists/CustomListSelector';
import RatingGauge from './RatingGauge';
import MediaTagsPanel from './MediaTagsPanel';

const DetailCard = ({
  image, title, details, summary, type, mediaId, userLists,
  onAddToList, onReview, onBack, review, onEdit, onDelete,
  stats, loggedAt, onLoggedAtSaved,
}) => {
  let imageClass = 'anime-image';
  if (type === 'album') imageClass += ' square large';
  else if (type === 'game') imageClass += ' landscape';
  else imageClass += ' portrait large';

  const getInitial = useCallback(() => {
    for (const listType of ['completed', 'current', 'futures']) {
      const arr = userLists[listType] || [];
      if (arr.find((item) => item.id === mediaId)) return listType;
    }
    return 'none';
  }, [userLists, mediaId]);

  const [selected, setSelected] = useState(getInitial());
  useEffect(() => { setSelected(getInitial()); }, [getInitial]);

  const handleChange = async (newType) => {
    if (newType === selected) return;
    const previous = selected;
    setSelected(newType);
    const mediaObj = { id: mediaId, media: type, title, image, listType: newType };
    const success = await onAddToList(newType, mediaId, mediaObj);
    if (!success) setSelected(previous);
  };

  const buttonLabel = selected === 'none' ? 'Add to List' : selected.charAt(0).toUpperCase() + selected.slice(1);

  return (
    <div className="anime-detail-container">
      <div className="anime-left">
        <div className="title-row">
          {onBack && (
            <div className="back-container">
              <div className="btn btn-outline-light back-arrow" onClick={onBack}>←</div>
            </div>
          )}
          <div className="title-container"><div className="anime-title">{title}</div></div>
        </div>
        <div className="image-wrapper"><img src={image} alt={title} className={imageClass} /></div>
      </div>

      <div className="anime-right">
        <div className="details-grid">
          {details.map((item, idx) => <div key={idx} className="detail-cell">{item}</div>)}
        </div>

        <div className="summary-box">{summary}</div>

        <div className="stats-grid">
          <RatingGauge value={stats?.global?.average} count={stats?.global?.count} label="Global" />
          <RatingGauge value={stats?.external?.average} count={stats?.external?.count} label="Source" />
          <RatingGauge value={stats?.friends?.average} count={stats?.friends?.count} label="Friends" />
          <RatingGauge value={review ? review.rating : null} label="You" />
        </div>


        <div className="logged-and-tags-row">
          <LoggedDateEditor mediaId={mediaId} loggedAt={loggedAt} onSaved={onLoggedAtSaved} />
          <MediaTagsPanel mediaType={type} externalId={mediaId.split('/').slice(1).join('/')} />
        </div>

        <FriendActivityList friendActivity={stats?.friendActivity} />

        <div className="review-box">
          <h5 style={{ textAlign: 'left' }}>Your Review:</h5>
          <p>{review ? review.review : 'Not yet reviewed'}</p>
        </div>

        <div className="anime-buttons">
          <DropdownButton title={buttonLabel} variant="secondary">
            <Dropdown.Item onClick={() => handleChange('completed')}>Completed</Dropdown.Item>
            <Dropdown.Item onClick={() => handleChange('current')}>Current</Dropdown.Item>
            <Dropdown.Item onClick={() => handleChange('futures')}>Futures</Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Item onClick={() => handleChange('none')}>None</Dropdown.Item>
          </DropdownButton>
          <CustomListSelector mediaId={mediaId} mediaType={type} title={title} image={image} />
          <button className="btn btn-outline-light" onClick={onReview}>Reviews</button>
          <button className="btn btn-outline-light" onClick={onEdit}>Edit Review</button>
          <button className="btn btn-outline-light" onClick={onDelete}>Delete Review</button>
        </div>
      </div>
    </div>
  );
};

export default DetailCard;


