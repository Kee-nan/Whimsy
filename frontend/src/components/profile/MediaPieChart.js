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

    // Only the chart-construction block changes — everything above it (imports, useState, filter logic) stays the same.
    chartRef.current = new ChartJS(canvasRef.current, {
      type: 'pie',
      data: {
        labels: mediaTypes.map((t) => MEDIA_LABELS[t] || t),
        datasets: [{
          data: mediaTypes.map((t) => counts[t]),
          backgroundColor: mediaTypes.map((t) => MEDIA_COLORS[t] || '#999'),
          borderColor: '#17131f',
          borderWidth: 3,
          hoverOffset: 26,       // pushes the slice outward on hover — the "bulge"
          hoverBorderWidth: 4,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        layout: { padding: 15 },     // NEW — gives datalabels/edges room, fixes bottom clipping
        radius: '100%',                     // NEW — shrinks the pie slightly to give datalabels room
        animation: { animateScale: true, duration: 400 },
        plugins: {
          legend: { position: 'right', labels: { color: '#ddd', font: { size: 14 }, boxWidth: 15, padding: 10 } },
          tooltip: {
            callbacks: {
              label: (ctx) => `${ctx.label}: ${ctx.raw} (${((ctx.raw / total) * 100).toFixed(1)}%)`,
            },
          },
          datalabels: {
            color: '#fff',
            font: { weight: 'bold', size: 13 },
            textAlign: 'center',
            formatter: (value, ctx) => {
              const lbl = ctx.chart.data.labels[ctx.dataIndex];
              const pct = ((value / total) * 100).toFixed(1);
              return `${lbl}\n${value} (${pct}%)`;
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