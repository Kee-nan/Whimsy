import React, { useEffect, useRef, useState } from 'react';
import {
  Chart as ChartJS,
  PieController,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

ChartJS.register(PieController, ArcElement, Tooltip, Legend, ChartDataLabels);

const MEDIA_COLORS = {
  movie: '#ff4d4d',
  show: '#e37005',
  anime: '#fcd303',
  book: '#00cc44',
  manga: '#00c2ff',
  game: '#2e1df0',
  album: '#9400d3',
};

const MEDIA_LABELS = {
  movie: 'Movies',
  show: 'Shows',
  anime: 'Anime',
  book: 'Books',
  manga: 'Manga',
  game: 'Games',
  album: 'Albums',
};

const FILTERS = [
  { value: 'all', label: 'All Lists' },
  { value: 'completed', label: 'Completed' },
  { value: 'current', label: 'Current' },
  { value: 'futures', label: 'Futures' },
];

/**
 * Replaces the old bar-based "Total Media Meter." Shows a pie chart of
 * media-type breakdown, filterable by list (current/completed/futures/all).
 * Each slice is labeled directly on the chart with the media type, the
 * raw count, and the percentage of the filtered total.
 */
const MediaPieChart = ({ lists }) => {
  const canvasRef = useRef(null);
  const chartRef = useRef(null);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const source = filter === 'all'
      ? [...(lists.completed || []), ...(lists.current || []), ...(lists.futures || [])]
      : (lists[filter] || []);

    const counts = source.reduce((acc, item) => {
      acc[item.media] = (acc[item.media] || 0) + 1;
      return acc;
    }, {});

    const mediaTypes = Object.keys(counts);
    const total = source.length;

    if (chartRef.current) {
      chartRef.current.destroy();
      chartRef.current = null;
    }

    if (!canvasRef.current || total === 0) return;

    chartRef.current = new ChartJS(canvasRef.current, {
      type: 'pie',
      data: {
        labels: mediaTypes.map((t) => MEDIA_LABELS[t] || t),
        datasets: [{
          data: mediaTypes.map((t) => counts[t]),
          backgroundColor: mediaTypes.map((t) => MEDIA_COLORS[t] || '#999'),
          borderColor: '#1c1c1c',
          borderWidth: 2,
        }],
      },
      options: {
        plugins: {
          legend: {
            position: 'right',
            labels: { color: '#ddd' },
          },
          tooltip: {
            callbacks: {
              label: (ctx) => {
                const count = ctx.raw;
                const pct = ((count / total) * 100).toFixed(1);
                return `${ctx.label}: ${count} (${pct}%)`;
              },
            },
          },
          datalabels: {
            color: '#fff',
            font: { weight: 'bold', size: 11 },
            textAlign: 'center',
            formatter: (value, ctx) => {
              const label = ctx.chart.data.labels[ctx.dataIndex];
              const pct = ((value / total) * 100).toFixed(1);
              return `${label}\n${value} (${pct}%)`;
            },
          },
        },
      },
    });

    return () => {
      if (chartRef.current) chartRef.current.destroy();
    };
  }, [lists, filter]);

  const total = filter === 'all'
    ? (lists.completed?.length || 0) + (lists.current?.length || 0) + (lists.futures?.length || 0)
    : (lists[filter]?.length || 0);

  return (
    <div className="profile-chart-card meter-card bordered">
      <div className="d-flex justify-content-between align-items-center mb-2">
        <h4 style={{ margin: 0 }}>Media Breakdown</h4>
        <select
          className="pie-chart-filter"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          {FILTERS.map((f) => (
            <option key={f.value} value={f.value}>{f.label}</option>
          ))}
        </select>
      </div>
      {total > 0 ? (
        <canvas ref={canvasRef}></canvas>
      ) : (
        <p className="text-center" style={{ color: '#999', marginTop: '2rem' }}>
          No media logged in this list yet.
        </p>
      )}
    </div>
  );
};

export default MediaPieChart;