import React, { useState, useEffect } from 'react';
import { Form } from 'react-bootstrap';
import FavoritesGrid from './FavoritesGrid';
import MediaPieChart from './MediaPieChart';
import ActivityFeed from './ActivityFeed';
import RatingDistributionChart from './RatingDistributionChart';
import Avatar from '../common/Avatar';

const ProfileCard = ({
  username, bio, lists, favorites, reviews = [], activity, profilePicture,
  editable = false, viewedUserId,
  onUpdateBio, onEditFavorites, onSignOut, onOpenSettings,
}) => {
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [bioDraft, setBioDraft] = useState(bio || '');
  useEffect(() => { setBioDraft(bio || ''); }, [bio]);

  const handleSaveBio = async () => { await onUpdateBio(bioDraft); setIsEditingBio(false); };
  const handleCancelBio = () => { setBioDraft(bio || ''); setIsEditingBio(false); };

  const totalItems = (lists.completed?.length || 0) + (lists.current?.length || 0) + (lists.futures?.length || 0);

  return (
    <div className="profile-container wide">
      {/* Header — unchanged */}
      <div className="profile-header profile-panel">
        <div className="profile-left"><Avatar src={profilePicture} size={150} className="profile-picture" /></div>
        <div className="profile-center"><h1 className="profile-username">{username}'s Profile</h1></div>
        <div className="profile-right vertical-buttons">
          {editable && (
            <>
              <button className="whimsy-btn " onClick={onOpenSettings}>Account Details</button>
              <button className="whimsy-btn whimsy-btn-ghost" onClick={onSignOut}>Sign Out</button>
            </>
          )}
        </div>
      </div>

      {/* NEW: Bio — full width, short height, sits directly below the header */}
      <div className="profile-bio-full profile-panel">
        <div className="bio-header">
          <h4>Bio:</h4>
          {editable && !isEditingBio && <button className="smallButton" onClick={() => setIsEditingBio(true)}>Edit Bio</button>}
        </div>
        {isEditingBio ? (
          <>
            <Form.Control as="textarea" rows={2} value={bioDraft} onChange={(e) => setBioDraft(e.target.value)} className="mb-2 bio-textarea" />
            <div className="button-group">
              <button className="whimsy-btn" onClick={handleSaveBio}>Save</button>
              <button className="whimsy-btn whimsy-btn-ghost" onClick={handleCancelBio}>Cancel</button>
            </div>
          </>
        ) : (
          <div className="bio-content"><p>{bio || "This user hasn't written a bio yet."}</p></div>
        )}
      </div>

      {/* List Stats + Favorites row — unchanged, just moved down one slot */}
      <div className="profile-bottom-row">
        <div className="stat-bar-box profile-panel">
          <div className="stat-list">
            <div className="stat-list-header">List Stats</div>
            <div><strong>Futures:</strong> {lists.futures?.length || 0}</div>
            <div><strong>Current:</strong> {lists.current?.length || 0}</div>
            <div><strong>Completed:</strong> {lists.completed?.length || 0}</div>
            <div><strong>Total:</strong> {totalItems}</div>
          </div>
          <div className="vertical-bar-container">
            <div className="bar-segment completed" style={{ height: `${((lists.completed?.length || 0) / totalItems) * 100 || 0}%` }} />
            <div className="bar-segment current" style={{ height: `${((lists.current?.length || 0) / totalItems) * 100 || 0}%` }} />
            <div className="bar-segment futures" style={{ height: `${((lists.futures?.length || 0) / totalItems) * 100 || 0}%` }} />
            
          </div>
        </div>

        <FavoritesGrid favorites={favorites} editable={editable} onEditClick={onEditFavorites} reviews={reviews} />
      </div>

      <div className="profile-middle">
        
        <div className="profile-chart-card profile-panel">
          <div className="pie-chart-canvas-wrapper"><MediaPieChart lists={lists} /></div>
        </div>

        <div className="profile-chart-card profile-panel">
          <RatingDistributionChart userId={viewedUserId} />
        </div>

      </div>

      <ActivityFeed activity={activity} title={editable ? 'Your Recent Activity' : `${username}'s Recent Activity`} />

      {/* Pie chart + Rating Distribution — now side-by-side, replacing the old
          bio+pie row. This reuses .profile-middle's existing equal-width flex
          layout instead of the old .profile-charts-row, and reuses
          .profile-chart-card's existing fixed-height/no-scroll sizing so
          both panels fill their space with no scrollbar. */}
      
    </div>
  );
};

export default ProfileCard;

