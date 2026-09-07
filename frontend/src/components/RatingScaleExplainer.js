import React, { useState, useMemo } from 'react';
import '../styles/ratingScale.css';

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

const getTier = (value) => TIERS.find((t) => value <= t.max) || TIERS[TIERS.length - 1];

/**
 * Interactive 0–30 slider explaining Whimsy's rating scale — drag it and
 * watch the word/description/color update to show what each range means.
 */
const RatingScaleExplainer = () => {
  const [value, setValue] = useState(15);
  const tier = useMemo(() => getTier(value), [value]);

  return (
    <div className="rating-scale-explainer">
      <h3>Understanding Our Rating Scale</h3>
      <p className="rating-scale-intro">
        Whimsy uses a 0–30 rating scale for reviews. Drag the slider below to see
        how each range maps to a rating tier.
      </p>

      <div className="rating-scale-display" style={{ color: tier.color }}>
        <span className="rating-scale-value">{value}</span>
        <span className="rating-scale-label">{tier.label}</span>
      </div>

      <input
        type="range"
        min="0"
        max="30"
        step="1"
        value={value}
        onChange={(e) => setValue(Number(e.target.value))}
        className="rating-scale-slider"
        style={{ accentColor: tier.color }}
        aria-label="Rating scale demo slider"
      />

      <div className="rating-scale-ticks">
        {[0, 5, 10, 15, 20, 25, 30].map((tick) => <span key={tick}>{tick}</span>)}
      </div>

      <p className="rating-scale-description">{tier.description}</p>
    </div>
  );
};

export default RatingScaleExplainer;