/**
 * Centralized error handler. Every route can now just `throw` (or let a
 * rejected promise propagate via asyncHandler) instead of hand-writing
 * res.status(...).json(...) in every catch block — this is the single
 * place that decides the response shape for failures.
 */
const errorHandler = (err, req, res, next) => {
  console.error(err);
  const status = err.status || 500;
  const message = status === 500 ? 'Internal server error' : err.message;
  res.status(status).json({ message });
};

module.exports = errorHandler;