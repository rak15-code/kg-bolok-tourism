// errorHandler.js — final Express error catcher.
// Keeps the API response shape consistent and avoids leaking stack traces.

export default function errorHandler(err, _req, res, _next) {
  console.error('[api error]', err)
  const status = err.status || 500
  res.status(status).json({
    error: err.message || 'Internal Server Error',
  })
}
