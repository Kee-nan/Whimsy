let refreshTimer = null;

async function refreshAccessToken() {
  try {
    const res = await fetch(`${process.env.REACT_APP_API_URL}/api/accounts/refresh`, {
      method: 'POST',
      credentials: 'include', // sends the httpOnly refresh cookie
    });
    if (!res.ok) throw new Error('Refresh failed');
    const data = await res.json();
    localStorage.setItem('user_token', data.user_token);
    localStorage.setItem('tokenExpiry', data.expiresAt);
    scheduleRefresh(data.expiresAt);
    return true;
  } catch (err) {
    console.error('Token refresh failed:', err);
    localStorage.removeItem('user_token');
    localStorage.removeItem('tokenExpiry');
    window.location.href = '/login';
    return false;
  }
}

/** Refreshes 1 minute before actual expiry, so a slow request never races an already-dead token. */
function scheduleRefresh(expiresAt) {
  if (refreshTimer) clearTimeout(refreshTimer);
  const msUntilExpiry = Number(expiresAt) - Date.now();
  const refreshIn = Math.max(msUntilExpiry - 60_000, 5_000);
  refreshTimer = setTimeout(refreshAccessToken, refreshIn);
}

function initTokenManager() {
  const expiry = localStorage.getItem('tokenExpiry');
  const token = localStorage.getItem('user_token');
  if (!token || !expiry) return;
  if (Number(expiry) <= Date.now()) refreshAccessToken();
  else scheduleRefresh(Number(expiry));
}

function stopTokenManager() {
  if (refreshTimer) clearTimeout(refreshTimer);
  refreshTimer = null;
}

export { initTokenManager, stopTokenManager, refreshAccessToken, scheduleRefresh };