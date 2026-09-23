import React, { useMemo } from 'react';

// Same tier scale as the homepage's RatingScaleExplainer, reused here so
// a "17" means the same word and the same color everywhere in the app.
const TIERS = [
  { max: 2,  label: 'Abysmal',     description: 'A complete disaster with nothing to redeem it.',              color: '#5a0505' },
  { max: 5,  label: 'Horrible',         description: "Deeply disappointing and difficult to find enjoyment in.",                    color: '#bd2918' },
  { max: 8, label: 'Bad',        description: 'Significantly flawed and rarely delivers on its potential.',          color: '#b95c04' },
  { max: 11, label: 'Poor',        description: 'Below average, with noticeable flaws.',          color: '#e9b91a' },
  { max: 14, label: 'Subpar',     description: 'Not bad, but its weaknesses certainly outweigh its strengths.',         color: '#e9bf04' },
  { max: 15, label: 'Average',        description: 'A perfectly ordinary experience that meets the basic expectations.',            color: '#e6ff04' },
  { max: 18, label: 'Good',       description: 'An enjoyable experience with qualities worth appreciating.',           color: '#1fdd68' },
  { max: 21, label: 'Great',   description: 'Highly enjoyable and memorable. Worth reccomending',             color: 'rgb(13, 141, 30)' },
  { max: 24, label: 'Excellent',   description: 'An exceptional experience that definitely shines out of the ordinary.',             color: 'rgb(13, 193, 199)' },
  { max: 27, label: 'Incredible',   description: 'An extraordinary experience that leaves a lasting impression.',             color: 'rgb(41, 99, 223)' },
  { max: 29, label: 'Outstanding',   description: 'An exceptional achievement that comes remarkably close to perfection.',             color: 'rgb(50, 35, 184)' },
  { max: 30, label: 'Masterpiece', description: 'A virtually flawless work that stands among the very best.',          color: '#831b8f' },
];

export const getRatingTier = (value) => TIERS.find((t) => value <= t.max) || TIERS[TIERS.length - 1];

const VIEW_W = 180;
const VIEW_H = 120;
const CENTER_X = VIEW_W / 2;
const CENTER_Y = 100;
const RADIUS = 70;
const STROKE = 16;

/**
 * angleDeg measured with 180° = left, 90° = top, 0° = right (standard
 * math convention). Subtracting sin() converts to SVG's y-down space
 * while keeping 90° pointing visually upward — this is the fix for the
 * arc previously dipping below center instead of arching over the top.
 */
const polarToCartesian = (cx, cy, r, angleDeg) => {
  const rad = (angleDeg * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy - r * Math.sin(rad) };
};

const describeArc = (cx, cy, r, startAngle, endAngle) => {
  const start = polarToCartesian(cx, cy, r, startAngle);
  const end = polarToCartesian(cx, cy, r, endAngle);
  const largeArcFlag = Math.abs(startAngle - endAngle) > 180 ? '1' : '0';
  // sweep-flag = 1 draws the arc over the top given this angle convention
  return `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArcFlag} 1 ${end.x} ${end.y}`;
};

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
      <svg viewBox={`0 0 ${VIEW_W} ${VIEW_H}`} className="rating-gauge-svg">
        <path d={describeArc(CENTER_X, CENTER_Y, RADIUS, 180, 0)} fill="none" stroke="#333" strokeWidth={STROKE} strokeLinecap="round" />
        {hasValue && percentage > 0 && (
          <path d={describeArc(CENTER_X, CENTER_Y, RADIUS, 180, endAngle)} fill="none" stroke={tier.color} strokeWidth={STROKE} strokeLinecap="round" />
        )}
        {hasValue && <line x1={CENTER_X} y1={CENTER_Y} x2={needleTip.x} y2={needleTip.y} stroke={tier.color} strokeWidth="3" strokeLinecap="round" />}
        <circle cx={CENTER_X} cy={CENTER_Y} r="5" fill={hasValue ? tier.color : '#555'} />
      </svg>
      <div className="rating-gauge-value" style={{ color: hasValue ? tier.color : '#666' }}>{hasValue ? clamped : '—'}</div>
      <div className="rating-gauge-tier">{hasValue ? tier.label : 'No ratings yet'}</div>
      <div className="rating-gauge-caption">{label}{count != null && hasValue ? ` (${count})` : ''}</div>
    </div>
  );
};

export default RatingGauge;