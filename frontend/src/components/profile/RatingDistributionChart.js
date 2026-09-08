import React, { useEffect, useRef, useState } from 'react';
import { Chart as ChartJS, BarController, BarElement, CategoryScale, LinearScale, Tooltip } from 'chart.js';
import { getRatingTier } from '../details/RatingGauge';

ChartJS.register(BarController, BarElement, CategoryScale, LinearScale, Tooltip);

/** Bell-curve style histogram of every rating (0–30) the user has given. */
const RatingDistributionChart = () => {
  const canvasRef = useRef(null);
  const chartRef = useRef(null);
  const [hasData, setHasData] = useState(true);

  useEffect(() => {
    const fetchDistribution = async () => {
      const token = localStorage.getItem('user_token');
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/review/distribution`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) return;
      const counts = await res.json();
      setHasData(counts.some((c) => c > 0));

      if (chartRef.current) chartRef.current.destroy();
      chartRef.current = new ChartJS(canvasRef.current, {
        type: 'bar',
        data: {
          labels: counts.map((_, i) => i),
          datasets: [{
            data: counts,
            backgroundColor: counts.map((_, i) => getRatingTier(i).color),
            borderRadius: 3,
          }],
        },
        options: {
          plugins: { legend: { display: false }, tooltip: { callbacks: { title: (items) => `Rating: ${items[0].label}` } } },
          scales: {
            x: { title: { display: true, text: 'Rating (0–30)', color: '#ccc' }, ticks: { color: '#aaa' }, grid: { color: '#2a2438' } },
            y: { beginAtZero: true, ticks: { color: '#aaa', stepSize: 1 }, grid: { color: '#2a2438' } },
          },
        },
      });
    };
    fetchDistribution();
    return () => { if (chartRef.current) chartRef.current.destroy(); };
  }, []);

  return (
    <div className="profile-panel mt-4">
      <h4>Your Rating Distribution</h4>
      <p style={{ color: '#999', fontSize: '0.9rem' }}>See how spread out your ratings are across the scale.</p>
      {hasData ? <div style={{ height: '280px' }}><canvas ref={canvasRef}></canvas></div> : <p style={{ color: '#999', textAlign: 'center' }}>No reviews yet.</p>}
    </div>
  );
};

export default RatingDistributionChart;