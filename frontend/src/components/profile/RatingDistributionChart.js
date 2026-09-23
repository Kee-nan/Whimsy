import React, { useEffect, useRef, useState } from 'react';
import { Chart as ChartJS, BarController, BarElement, CategoryScale, LinearScale, Tooltip } from 'chart.js';
import { getRatingTier } from '../details/RatingGauge';

ChartJS.register(BarController, BarElement, CategoryScale, LinearScale, Tooltip);

const RatingDistributionChart = ({ userId }) => {
  const canvasRef = useRef(null);
  const chartRef = useRef(null);
  const [hasData, setHasData] = useState(true);

  useEffect(() => {
    const fetchDistribution = async () => {
      const token = localStorage.getItem('user_token');
      const query = userId ? `?userId=${userId}` : '';
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/review/distribution${query}`, {
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
          datasets: [{ data: counts, backgroundColor: counts.map((_, i) => getRatingTier(i).color), borderRadius: 3 }],
        },
        options: {
          plugins: { legend: { display: false }, tooltip: { callbacks: { title: (items) => `Rating: ${items[0].label}` } } },
          scales: {
            x: { title: { display: true, text: 'Rating (0–30)', color: '#ccc' }, ticks: { color: '#aaa' }, grid: { color: '#2a2438' } },
            y: { beginAtZero: true, ticks: { color: '#aaa', stepSize: 1 }, grid: { color: '#2a2438' } },
          },
        },
      });
      requestAnimationFrame(() => chartRef.current?.resize());
    };
    fetchDistribution();
    return () => { if (chartRef.current) chartRef.current.destroy(); };
  }, [userId]); // <-- re-fetches whenever userId changes (own profile vs a friend's)

  return (
    <>
      <h4>Your Rating Distribution</h4>
      <p style={{ color: '#999', fontSize: '0.9rem' }}>See how spread out ratings are across the scale.</p>
      {hasData ? (
        <div className="chart-canvas-wrapper"><canvas ref={canvasRef}></canvas></div>
      ) : (
        <p style={{ color: '#999', textAlign: 'center' }}>No reviews yet.</p>
      )}
    </>
  );
};

export default RatingDistributionChart;