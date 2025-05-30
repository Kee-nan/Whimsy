import React, { useEffect, useRef, useState } from 'react';
import { Card, Image } from 'react-bootstrap';
import '../../styles/profilepage.css';
import '../../styles/modal.css';
import GreatEight from '../GreatEight'
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

const FriendProfileCard = ({ friendBio, friendUsername, friendFuturesList, friendCurrentList, friendCompletedList }) => {
  const canvasRef = useRef(null);
  const chartRef = useRef(null);
  const [completedCounts, setCompletedCounts] = useState([]);


  const MEDIA_COLORS = {
    movie: '#ff4d4d',
    show: '#e37005',
    anime: '#fcd303',
    book: '#00cc44',
    manga: '#00c2ff',
    game: '#2e1df0',
    album: '#9400d3'
  };

  const countCompletedMediaTypes = (friendCompletedList) => {
    const counts = {
      album: 0,
      anime: 0,
      book: 0,
      manga: 0,
      movie: 0,
      show: 0,
      game: 0,
    };

    for (const item of friendCompletedList) {
      if (item.listType === 'completed' && counts.hasOwnProperty(item.media)) {
        counts[item.media]++;
      }
    }

    return Object.entries(counts)
      .map(([media, count]) => ({ media, count }))
      .sort((a, b) => b.count - a.count);
  };

  

  useEffect(() => {
      if (!friendCompletedList || friendCompletedList.length === 0) return;
    
      const chartData = countCompletedMediaTypes(friendCompletedList);
    
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
    }, [friendCompletedList]);

  const totalItems = friendCompletedList.length + friendCurrentList.length + friendFuturesList.length;

  return (
    <>
      <div className="profile-container">
        {/* Top Row */}
        <div className="profile-header bordered">
          <div className="profile-left">
            <Image
              src={'https://via.placeholder.com/150'}
              roundedCircle
              width="150"
              height="150"
              className="profile-picture"
            />
          </div>
          <div className="profile-center">
            <h1 className="profile-username">{friendUsername}'s Profile</h1>
          </div>
          <div className="profile-right vertical-buttons">
          </div>
        </div>
  
        {/* Middle 3 Cards Row */}
        <div className="profile-middle">
          
          <div className="profile-bio-card bio-card bordered">
            <div className="bio-header">
              <h4>Bio:</h4>
            </div>
              <div className="bio-content">
                <p>{friendBio || "This user hasn't written a bio yet."}</p>
              </div>
          </div>
  
          <div className="profile-chart-card meter-card bordered">
            <h4>Total Media Meter</h4>
            <canvas ref={canvasRef}></canvas>
          </div>

        </div>
  
        {/* Bottom Row */}
        
        <div className="profile-bottom bordered">
          <div className="stat-bar-box">
            <div className="stat-list">
              <div className="stat-list-header">List Stats</div>
              <div><strong>Futures:</strong> {friendFuturesList.length}</div>
              <div><strong>Current:</strong> {friendCurrentList.length}</div>
              <div><strong>Completed:</strong> {friendCompletedList.length}</div>
              <div><strong>Total:</strong> {friendFuturesList.length + friendCurrentList.length + friendCompletedList.length}</div>
            </div>
            <div className="vertical-bar-container">
              <div
                className="bar-segment futures"
                style={{ height: `${(friendFuturesList.length / totalItems) * 100 || 0}%` }}
              />
              <div
                className="bar-segment current"
                style={{ height: `${(friendCurrentList.length / totalItems) * 100 || 0}%` }}
              />
              <div
                className="bar-segment completed"
                style={{ height: `${(friendCompletedList.length / totalItems) * 100 || 0}%` }}
              />
            </div>
          </div>
          <div className="great-eight-wrapper">
          </div>
        </div>  
      </div>
    </>
  );
};

export default FriendProfileCard;
