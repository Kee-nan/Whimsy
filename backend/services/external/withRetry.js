/**
 * Retries a request-making function on transient failures (5xx, timeouts,
 * connection resets) with a short backoff. Does NOT retry on 4xx errors
 * (bad request, not found) since retrying those just wastes time — those
 * are expected to fail again.
 */
async function withRetry(fn, retries = 2, delayMs = 400) {
  let lastErr;
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await fn();
    } catch (err) {
      lastErr = err;
      const status = err.response?.status;
      const isRetryable = !status || status >= 500 || err.code === 'ECONNABORTED';
      if (!isRetryable || attempt === retries) break;
      await new Promise((resolve) => setTimeout(resolve, delayMs * (attempt + 1)));
    }
  }
  throw lastErr;
}

module.exports = withRetry;