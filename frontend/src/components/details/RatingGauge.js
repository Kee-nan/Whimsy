import React, { useMemo } from 'react';

// Same tier scale as the homepage's RatingScaleExplainer, reused here so
// a "17" means the same word and the same color everywhere in the app.
const TIERS = [
  { max: 3,  label: 'Abysmal',     color: '#8b0000' },
  { max: 7,  label: 'Bad',         color: '#c0392b' },
  { max: 11, label: 'Poor',        color: '#d35400' },
  { max: 15, label: 'Average',     color: '#cc890d' },
  { max: 19, label: 'Good',        color: '#f1c40f' },
  { max: 23, label: 'Great',       color: '#27ae60' },
  { max: 27, label: 'Excellent',   color: '#2980b9' },
  { max: 30, label: 'Masterpiece', color: '#84308d' },
];

export const getRatingTier = (value) => TIERS.find((t) => value <= t.max) || TIERS[TIERS.length - 1];

const SIZE = 160;
const CENTER_X = SIZE / 2;
const CENTER_Y = SIZE / 2 + 10;
const RADIUS = 65;
const STROKE = 14;

const polarToCartesian = (cx, cy, r, angleDeg) => {
  const rad = (angleDeg * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
};

const describeArc = (cx, cy, r, startAngle, endAngle) => {
  const start = polarToCartesian(cx, cy, r, startAngle);
  const end = polarToCartesian(cx, cy, r, endAngle);
  const largeArcFlag = Math.abs(endAngle - startAngle) <= 180 ? '0' : '1';
  return `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArcFlag} 0 ${end.x} ${end.y}`;
};

/**
 * Semicircular 0–30 rating gauge. Both the needle position and the arc
 * fill scale with the value; both are colored via the same tier scale —
 * low scores render red, high scores render purple (matching the brand
 * color), rather than a fixed multi-band color scheme.
 */
const RatingGauge = ({ value, label, count }) => {
  const hasValue = value != null;
  const clamped = hasValue ? Math.max(0, Math.min(30, value)) : 0;
  const tier = getRatingTier(clamped);
  const percentage = clamped / 30;

  const endAngle = 180 - percentage * 180;
  const needleTip = useMemo(
    () => polarToCartesian(CENTER_X, CENTER_Y, RADIUS - STROKE / 2 - 4, endAngle),
    [endAngle]
  );

  return (
    <div className="rating-gauge">
      <svg viewBox={`0 0 ${SIZE} ${SIZE / 2 + 30}`} className="rating-gauge-svg">
        <path d={describeArc(CENTER_X, CENTER_Y, RADIUS, 180, 0)} fill="none" stroke="#333" strokeWidth={STROKE} strokeLinecap="round" />
        {hasValue && percentage > 0 && (
          <path d={describeArc(CENTER_X, CENTER_Y, RADIUS, 180, endAngle)} fill="none" stroke={tier.color} strokeWidth={STROKE} strokeLinecap="round" />
        )}
        {hasValue && (
          <line x1={CENTER_X} y1={CENTER_Y} x2={needleTip.x} y2={needleTip.y} stroke={tier.color} strokeWidth="3" strokeLinecap="round" />
        )}
        <circle cx={CENTER_X} cy={CENTER_Y} r="5" fill={hasValue ? tier.color : '#555'} />
      </svg>
      <div className="rating-gauge-value" style={{ color: hasValue ? tier.color : '#666' }}>{hasValue ? clamped : '—'}</div>
      <div className="rating-gauge-tier">{hasValue ? tier.label : 'No ratings yet'}</div>
      <div className="rating-gauge-caption">{label}{count != null && hasValue ? ` (${count})` : ''}</div>
    </div>
  );
};

export default RatingGauge;