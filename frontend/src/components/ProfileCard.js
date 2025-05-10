import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Image, Form, Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import '../styles/profilepage.css';
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

  const [completedCounts, setCompletedCounts] = useState([]);


  // Variables that will be loaded from the user account that will be filtered
  const [lists, setLists] = useState({
    completed: [],
    futures: [],
    current: [],
  });
  const { completed } = lists;
  
  // Initialized as an empty array for Review Data
  const [ReviewData, setReviewData] = useState([]);
  
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
    const fetchData = async () => {
      const token = localStorage.getItem('user_token');
      if (!token) return console.error('no user token');
  
      const headers = { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      };
  
      try {
        const res = await fetch('http://localhost:5000/api/list/lists', { headers });
        if (!res.ok) throw new Error('failed to fetch lists');
        const data = await res.json();
        setLists(data);
  
        // Once data is loaded, count completed media types
        const counts = countCompletedMediaTypes(data.completed);
        setCompletedCounts(counts);
  
        const rev = await fetch('http://localhost:5000/api/list/reviews', { headers });
        setReviewData(rev.ok ? await rev.json() : []);
      } catch (err) {
        console.error(err);
      }
    };
  
    fetchData();
  }, []);

  const MEDIA_COLORS = {
    movie: '#ff4d4d',   // red
    show: '#e37005',    // orange
    anime: '#fcd303',   // yellow
    book: '#00cc44',    // green
    manga: '#00c2ff',   // blue
    game: '#2e1df0',    // indigo
    album: '#9400d3'    // violet
  };

  useEffect(() => {
    if (!completed || completed.length === 0) return;
  
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
  }, [completed]);
  
  



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
        'http://localhost:5000/api/accounts/user',
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
            <button className="secondaryButton" onClick={() => navigate('/account')}>Account Details</button>
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
        <div className="profile-bottom bordered">
          <p>Bottom content area (customizable)</p>
        </div>
      </div>
  
      {/* Sign Out Modal */}
      <Modal show={showModal} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Sign Out</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you would like to sign out?</Modal.Body>
        <Modal.Footer>
          <button className="secondaryButton" onClick={handleClose}>Cancel</button>
          <button className="primaryButton" onClick={handleConfirmSignOut}>Confirm</button>
        </Modal.Footer>
      </Modal>
    </>
  );
  
};

export default UserProfileCard;






{/* <Card className="profile-card user-profile-card mb-4">
        <Card.Body className="profile-card-body d-flex flex-column align-items-center">
          <Image
            src={user.profilePicture || 'https://via.placeholder.com/150'}
            roundedCircle
            width="150"
            height="150"
            className="mb-3"
          />
          <Card.Title className="profile-card-title">{user.username}'s Profile</Card.Title>
          {isEditing ? (
            <Form.Control
              as="textarea"
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="mb3 profile-card-text-edit"
            />
          ) : (
            <Card.Text className="profile-card-text">{user.bio}</Card.Text>
          )}
          <div className="d-flex justify-content-center mt-3">
            {isEditing ? (
              <>
                <button className="primaryButton" onClick={handleSave}>Save</button>
                <button className="secondaryButton" onClick={handleCancel}>Cancel</button>
              </>
            ) : (
              <>
                <button className="primaryButton" onClick={handleEdit}>Edit Bio</button>
                <button className="secondaryButton" onClick={navtofriends}>Friends</button>
                <button className="secondaryButton" onClick={handleShow}>Sign Out</button>
              </>
            )}
          </div>
        </Card.Body>
      </Card>

      <Modal show={showModal} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Sign Out</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you would like to sign out?
        </Modal.Body>
        <Modal.Footer>
          <button className='secondaryButton' onClick={handleClose}>
            Cancel
          </button>
          <button className='primaryButton' onClick={handleConfirmSignOut}>
            Confirm
          </button>
        </Modal.Footer>
      </Modal> */}
    

