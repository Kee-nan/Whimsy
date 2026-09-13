import React from 'react';

const DEFAULT_AVATAR = 'https://via.placeholder.com/150';

const Avatar = ({ src, size = 40, className = '' }) => (
  <div
    className={`whimsy-avatar ${className}`}
    style={{ width: size, height: size, backgroundImage: `url(${src || DEFAULT_AVATAR})` }}
  />
);

export default Avatar;