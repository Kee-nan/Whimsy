import React, { useState, useMemo } from 'react';
import '../styles/ratingScale.css';

const TIERS = [
  { max: 2,  label: 'Abysmal',     description: 'A disaster. Avoid at all costs.',              color: '#8b0000' },
  { max: 5,  label: 'Horrible',         description: "Didn't work for me at all.",                    color: '#c0392b' },
  { max: 8, label: 'Bad',        description: 'Below average, with noticeable flaws.',          color: '#d35400' },
  { max: 10, label: 'Poor',        description: 'Below average, with noticeable flaws.',          color: '#d35400' },
  { max: 13, label: 'Meh',     description: 'Decent — nothing special, nothing bad.',         color: '#cc890d' },
  { max: 16, label: 'Average',        description: 'Solidly enjoyable, worth your time.',            color: '#f1c40f' },
  { max: 19, label: 'Good',       description: 'Really impressed — I recommend this.',           color: '#27ae60' },
  { max: 22, label: 'Great',   description: 'Nearly perfect. A genuine standout.',             color: '#29b9a6ff' },
  { max: 25, label: 'Excellent',   description: 'Nearly perfect. A genuine standout.',             color: '#126eacff' },
  { max: 29, label: 'Outstanding',   description: 'Nearly perfect. A genuine standout.',             color: '#4829b9ff' },
  { max: 30, label: 'Masterpiece', description: 'One of the best. An all-time favorite.',          color: '#84308d' },
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