let refreshTimer = null;

async function attemptRefresh() {
  const res = await fetch(`${process.env.REACT_APP_API_URL}/api/accounts/refresh`, {
    method: 'POST',
    credentials: 'include',
  });
  if (!res.ok) throw new Error(`Refresh failed with status ${res.status}`);
  return res.json();
}

async function refreshAccessToken(retryOnce = true) {
  try {
    const data = await attemptRefresh();
    localStorage.setItem('user_token', data.user_token);
    localStorage.setItem('tokenExpiry', data.expiresAt);
    scheduleRefresh(data.expiresAt);
    return true;
  } catch (err) {
    if (retryOnce) {
      // One retry covers transient issues — a Render cold-start, a brief
      // network blip — rather than logging someone out over a fluke.
      await new Promise((r) => setTimeout(r, 3000));
      return refreshAccessToken(false);
    }
    console.error('Token refresh failed:', err);
    localStorage.removeItem('user_token');
    localStorage.removeItem('tokenExpiry');
    window.location.href = '/login';
    return false;
  }
}

function scheduleRefresh(expiresAt) {
  if (refreshTimer) clearTimeout(refreshTimer);
  const msUntilExpiry = Number(expiresAt) - Date.now();
  const refreshIn = Math.max(msUntilExpiry - 120_000, 5_000); // refresh 2 min early
  refreshTimer = setTimeout(refreshAccessToken, refreshIn);
}

/** Backup for when a background tab's setTimeout gets throttled by the
    browser — checks on every tab-focus whether the token is stale. */
function handleVisibilityChange() {
  if (document.visibilityState !== 'visible') return;
  const expiry = localStorage.getItem('tokenExpiry');
  const token = localStorage.getItem('user_token');
  if (!token || !expiry) return;
  if (Number(expiry) - Date.now() < 120_000) refreshAccessToken();
}

function initTokenManager() {
  const expiry = localStorage.getItem('tokenExpiry');
  const token = localStorage.getItem('user_token');
  if (token && expiry) {
    if (Number(expiry) <= Date.now()) refreshAccessToken();
    else scheduleRefresh(Number(expiry));
  }
  document.addEventListener('visibilitychange', handleVisibilityChange);
}

function stopTokenManager() {
  if (refreshTimer) clearTimeout(refreshTimer);
  refreshTimer = null;
  document.removeEventListener('visibilitychange', handleVisibilityChange);
}

export { initTokenManager, stopTokenManager, refreshAccessToken, scheduleRefresh };