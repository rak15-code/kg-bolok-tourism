// middleware/logger.js — concise request logger for production + dev.
// Logs: method, path, status, duration. Skips noisy health checks.

export default function logger(req, res, next) {
  if (req.path === '/health' || req.path === '/api/health') return next()
  const start = Date.now()
  res.on('finish', () => {
    const ms = Date.now() - start
    const line = `${req.method} ${req.originalUrl} ${res.statusCode} ${ms}ms`
    if (res.statusCode >= 500) console.error('✖', line)
    else if (res.statusCode >= 400) console.warn('▲', line)
    else console.log('•', line)
  })
  next()
}
