import React, { useState, useEffect } from 'react';
import { Image, Form } from 'react-bootstrap';
import '../../styles/profilepage.css';
import '../../styles/modal.css';
import FavoritesGrid from './FavoritesGrid';
import MediaPieChart from './MediaPieChart';
import ActivityFeed from './ActivityFeed';

/**
 * Shared profile card for both the logged-in user's own profile and a
 * friend's read-only profile. `editable` toggles all mutation UI: bio
 * editing, favorites editing, account settings, and sign out. When
 * editable=false this renders a fully read-only view of someone else's
 * profile — no separate FriendProfileCard component needed.
 */
const ProfileCard = ({
  username,
  bio,
  lists,            // { completed: [], current: [], futures: [] }
  favorites,        // array of up to 8 items (or null slots)
  editable = false,
  onUpdateBio,       // async (newBio) => void — required if editable
  onEditFavorites,   // () => void — required if editable
  onSignOut,         // () => void — required if editable
  onOpenSettings,    // () => void — required if editable
  profilePicture,    // URL of the profile picture
  activity             // array of recent activity items
}) => {
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [bioDraft, setBioDraft] = useState(bio || '');

  useEffect(() => {
    setBioDraft(bio || '');
  }, [bio]);

  const handleSaveBio = async () => {
    await onUpdateBio(bioDraft);
    setIsEditingBio(false);
  };

  const handleCancelBio = () => {
    setBioDraft(bio || '');
    setIsEditingBio(false);
  };

  const totalItems =
    (lists.completed?.length || 0) +
    (lists.current?.length || 0) +
    (lists.futures?.length || 0);

  return (
    <div className="profile-container">
      {/* Top Row */}
      <div className="profile-header bordered">
        <div className="profile-left">
          <Image
            src={profilePicture || 'https://via.placeholder.com/150'}
            roundedCircle
            width="150"
            height="150"
            className="profile-picture"
          />
        </div>
        <div className="profile-center">
          <h1 className="profile-username">{username}'s Profile</h1>
        </div>
        <div className="profile-right vertical-buttons">
          {editable && (
            <>
              <button className="primaryButton" onClick={onSignOut}>Sign Out</button>
              <button className="secondaryButton" onClick={onOpenSettings}>Account Details</button>
            </>
          )}
        </div>
      </div>

      {/* Middle Row */}
      <div className="profile-middle">
        <div className="profile-bio-card bio-card bordered">
          <div className="bio-header">
            <h4>Bio:</h4>
            {editable && !isEditingBio && (
              <button className="smallButton" onClick={() => setIsEditingBio(true)}>Edit Bio</button>
            )}
          </div>
          {isEditingBio ? (
            <>
              <Form.Control
                as="textarea"
                rows={5}
                value={bioDraft}
                onChange={(e) => setBioDraft(e.target.value)}
                className="mb-2 bio-textarea"
              />
              <div className="button-group">
                <button className="primaryButton" onClick={handleSaveBio}>Save</button>
                <button className="secondaryButton" onClick={handleCancelBio}>Cancel</button>
              </div>
            </>
          ) : (
            <div className="bio-content">
              <p>{bio || "This user hasn't written a bio yet."}</p>
            </div>
          )}
        </div>

        <MediaPieChart lists={lists} />
      </div>

      {/* Bottom Row */}
      <div className="profile-bottom bordered">
        <div className="stat-bar-box">
          <div className="stat-list">
            <div className="stat-list-header">List Stats</div>
            <div><strong>Futures:</strong> {lists.futures?.length || 0}</div>
            <div><strong>Current:</strong> {lists.current?.length || 0}</div>
            <div><strong>Completed:</strong> {lists.completed?.length || 0}</div>
            <div><strong>Total:</strong> {totalItems}</div>
          </div>
          <div className="vertical-bar-container">
            <div className="bar-segment futures" style={{ height: `${((lists.futures?.length || 0) / totalItems) * 100 || 0}%` }} />
            <div className="bar-segment current" style={{ height: `${((lists.current?.length || 0) / totalItems) * 100 || 0}%` }} />
            <div className="bar-segment completed" style={{ height: `${((lists.completed?.length || 0) / totalItems) * 100 || 0}%` }} />
          </div>
        </div>

        <FavoritesGrid favorites={favorites} editable={editable} onEditClick={onEditFavorites} />
      </div>

       <ActivityFeed
          activity={activity}
          title={editable ? 'Your Recent Activity' : `${username}'s Recent Activity`}
        />
    </div>
  );
};

export default ProfileCard;
