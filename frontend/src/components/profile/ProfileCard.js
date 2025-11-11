// src/components/profile/ProfileCard.js
import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Image, Form, Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import '../../styles/profilepage.css';
import '../../styles/modal.css';
import AccountSettingsModal from './AccountSettingsModal.js';
import FavoritesGrid from './FavoritesGrid.js';
import FavoritesModal from './FavoritesModal.js'

import {
  Chart as ChartJS,
  BarController,
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  BarController,
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend
);

const UserProfileCard = ({ user, setUser }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [bio, setBio] = useState(user.bio);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const canvasRef = useRef(null);
  const chartRef = useRef(null);

  // ProfileCard.js
  const [, setCompletedCounts] = useState({});
  const [, setReviewData] = useState([]);



  // *** New state for the FavoritesModal ***
  const [showFavsModal, setShowFavsModal] = useState(false);

  // Keep local copy of favorites so we can pass down
  const [userFavorites, setUserFavorites] = useState(Array(8).fill(null));

  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [viewSetting, setViewSetting] = useState("card"); // or "table"

  const updateUser = async (updatedUser) => {
    try {
      const token = localStorage.getItem("user_token");
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/accounts/user`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(updatedUser),
      });
  
      if (!response.ok) throw new Error(await response.text());
      setUser(updatedUser);
    } catch (err) {
      console.error("Error updating user:", err);
    }
  };


  // Variables that will be loaded from the user account that will be filtered
  const [lists, setLists] = useState({
    completed: [],
    futures: [],
    current: [],
  });
  const { completed } = lists;
  
  
  // Function to Sort the completed list into media types for the chart
  const countCompletedMediaTypes = (completedList) => {
    const counts = {
      album: 0,
      anime: 0,
      book: 0,
      manga: 0,
      movie: 0,
      show: 0,
      game: 0,
    };
  
    for (const item of completedList) {
      if (counts.hasOwnProperty(item.media)) {
        counts[item.media]++;
      }
    }
  
    // Return sorted array for easy charting
    return Object.entries(counts)
      .map(([media, count]) => ({ media, count }))
      .sort((a, b) => b.count - a.count);
  };

  useEffect(() => {
    setBio(user.bio || '');
  }, [user]);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('user_token');
      if (!token) return console.error('no user token');
  
      const headers = { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      };
  
      try {
        const res = await fetch(`${process.env.REACT_APP_API_URL}/api/list/lists`, { headers });
        if (!res.ok) throw new Error('failed to fetch lists');
        const data = await res.json();
        setLists(data);
  
        // Once data is loaded, count completed media types
        const counts = countCompletedMediaTypes(data.completed);
        setCompletedCounts(counts);
  
        const rev = await fetch(`${process.env.REACT_APP_API_URL}/api/list/reviews`, { headers });
        setReviewData(rev.ok ? await rev.json() : []);
      } catch (err) {
        console.error(err);
      }
    };
  
    fetchData();
  }, []);

  

  useEffect(() => {
    if (!completed || completed.length === 0) return;

    const MEDIA_COLORS = {
      movie: '#ff4d4d',   // red
      show: '#e37005',    // orange
      anime: '#fcd303',   // yellow
      book: '#00cc44',    // green
      manga: '#00c2ff',   // blue
      game: '#2e1df0',    // indigo
      album: '#9400d3'    // violet
    };
  
    const chartData = countCompletedMediaTypes(completed);
  
    // Use raw media types for color lookup
    const rawMediaTypes = chartData.map(d => d.media);
    const counts = chartData.map(d => d.count);
  
    // Capitalize and pluralize for axis labels
    const pluralize = (word) => {
      if (word === 'anime' || word === 'manga') return word.charAt(0).toUpperCase() + word.slice(1);
      return word.charAt(0).toUpperCase() + word.slice(1) + 's';
    };
    const labels = rawMediaTypes.map(pluralize);
  
    const colors = rawMediaTypes.map(type => MEDIA_COLORS[type] || '#999');
  
    if (chartRef.current) {
      chartRef.current.destroy();
    }
  
    chartRef.current = new ChartJS(canvasRef.current, {
      type: 'bar',
      data: {
        labels,
        datasets: [{
          label: 'Completed Media',
          data: counts,
          backgroundColor: colors,
          borderColor: '#fff',
          borderWidth: 1
        }]
      },
      options: {
        indexAxis: 'y',
        plugins: {
          legend: { display: false }
        },
        scales: {
          x: {
            beginAtZero: true,
            ticks: { color: '#ddd' },
            grid: { color: '#333' }
          },
          y: {
            ticks: { color: '#ddd' },
            grid: { color: '#333' }
          }
        }
      }
    });
  }, [completed, MEDIA_COLORS]);
  
  const totalItems = lists.futures.length + lists.current.length + lists.completed.length;

  useEffect(() => {
    const fetchFavorites = async () => {
      const token = localStorage.getItem('user_token');
      if (!token) return;
      try {
        const res = await fetch(`${process.env.REACT_APP_API_URL}/api/accounts/favorites`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error('Failed to fetch favorites');
        const data = await res.json();
        // normalize to slot array of length 8
        let slots = Array(8).fill(null);
        if (Array.isArray(data)) {
          if (data.length === 8) slots = data;
          else for (let i = 0; i < Math.min(8, data.length); i++) slots[i] = data[i];
        }
        setUserFavorites(slots);
      } catch (err) {
        console.error('Failed to fetch favorites', err);
      }
    };

    fetchFavorites();
  }, []);

  const handleEdit = () => {
    setIsEditing(true);
    setBio(user.bio);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setBio(user.bio);
  };

  const handleSignOut = () => {
    localStorage.removeItem('user_token');
    navigate('/login');
  };

  const handleClose = () => setShowModal(false);
  const handleShow = () => setShowModal(true);
  const handleConfirmSignOut = () => {
    handleSignOut();
    setShowModal(false);
  };


  const handleSave = async () => {
    try {
      const user_token = localStorage.getItem('user_token');
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${user_token}`,
      };

      const response = await axios.put(
        `${process.env.REACT_APP_API_URL}/api/accounts/user`,
        { bio },
        { headers }
      );

      setUser(response.data);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating bio:', error);
      alert('Error updating bio: ' + error.message);
    }
  };

  return (
    <>
      <div className="profile-container">
        {/* Top Row */}
        <div className="profile-header bordered">
          <div className="profile-left">
            <Image
              src={user.profilePicture || 'https://via.placeholder.com/150'}
              roundedCircle
              width="150"
              height="150"
              className="profile-picture"
            />
          </div>
          <div className="profile-center">
            <h1 className="profile-username">{user.username}'s Profile</h1>
          </div>
          <div className="profile-right vertical-buttons">
            <button className="primaryButton" onClick={handleShow}>Sign Out</button>
            <button className="secondaryButton" onClick={() => setShowSettingsModal(true)}>Account Details</button>
          </div>
        </div>
  
        {/* Middle 3 Cards Row */}
        <div className="profile-middle">
          
          <div className="profile-bio-card bio-card bordered">
            <div className="bio-header">
              <h4>Bio:</h4>
              <button className="smallButton" onClick={handleEdit}>Edit Bio</button>
            </div>
            {isEditing ? (
              <>
                <Form.Control
                  as="textarea"
                  rows={5}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="mb-2 bio-textarea"
                />
                <div className="button-group">
                  <button className="primaryButton" onClick={handleSave}>Save</button>
                  <button className="secondaryButton" onClick={handleCancel}>Cancel</button>
                </div>
              </>
            ) : (
              <div className="bio-content">
                <p>{bio || "This user hasn't written a bio yet."}</p>
              </div>
            )}
          </div>
  
          <div className="profile-chart-card meter-card bordered">
            <h4>Total Media Meter</h4>
            <canvas ref={canvasRef}></canvas>
          </div>

        </div>
  
        {/* Bottom Row */}
        
        <div className="profile-bottom">

            <div className="stat-bar-box">
              <div className="stat-list">
                <div className="stat-list-header">List Stats</div>
                <div><strong>Futures:</strong> {lists.futures.length}</div>
                <div><strong>Current:</strong> {lists.current.length}</div>
                <div><strong>Completed:</strong> {lists.completed.length}</div>
                <div><strong>Total:</strong> {lists.futures.length + lists.current.length + lists.completed.length}</div>
              </div>
              <div className="vertical-bar-container">
                <div
                  className="bar-segment futures"
                  style={{ height: `${(lists.futures.length / totalItems) * 100 || 0}%` }}
                />
                <div
                  className="bar-segment current"
                  style={{ height: `${(lists.current.length / totalItems) * 100 || 0}%` }}
                />
                <div
                  className="bar-segment completed"
                  style={{ height: `${(lists.completed.length / totalItems) * 100 || 0}%` }}
                />
              </div>
            </div>
            
               <FavoritesGrid
                 onEditClick={() => setShowFavsModal(true)}
                 favorites={userFavorites}
               />


        </div>  
      </div>
  
      {/* Sign Out Modal */}
      <Modal show={showModal} onHide={handleClose} centered className="custom-modal">
        <Modal.Header closeButton>
          <Modal.Title>Confirm Sign Out</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you would like to sign out?</Modal.Body>
        <Modal.Footer>
          <button className="secondaryButton" onClick={handleClose}>Cancel</button>
          <button className="primaryButton" onClick={handleConfirmSignOut}>Confirm</button>
        </Modal.Footer>
      </Modal>

      {/* Account Settings Modal */}
      <AccountSettingsModal
        show={showSettingsModal}
        handleClose={() => setShowSettingsModal(false)}
        user={user}
        updateUser={updateUser}
        viewSetting={viewSetting}
        setViewSetting={setViewSetting}
      />

      {/* FAVORITES MODAL */}
      <FavoritesModal
        show={showFavsModal}
        onHide={() => setShowFavsModal(false)}
        allLists={lists}
        userFavorites={userFavorites}
        setUserFavorites={(slots) => {
          // update local UI and keep in sync
          setUserFavorites(slots);
        }}
      />

    </>
  );
  
};

export default UserProfileCard;
