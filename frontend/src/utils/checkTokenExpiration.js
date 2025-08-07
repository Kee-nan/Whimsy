// src/utils/checkTokenExpiration.js

export const checkTokenExpiration = (navigate) => {
  const token = localStorage.getItem('user_token');
  const expiresAt = localStorage.getItem('tokenExpiry');

  // If there's no token or expiry, redirect to login
  if (!token || !expiresAt) {
    localStorage.removeItem('user_token');
    localStorage.removeItem('tokenExpiry');
    navigate('/login');
    return true;
  }

  // Compare expiry with current time
  const now = Date.now();
  if (now >= parseInt(expiresAt)) {
    console.log('Token expired, logging out...');
    localStorage.removeItem('user_token');
    localStorage.removeItem('tokenExpiry');
    navigate('/login');
    return true;
  }

  return false;
};

