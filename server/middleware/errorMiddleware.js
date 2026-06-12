export const errorHandler = (err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || 'An unexpected server error occurred';

  // Only log severe server errors
  if (status >= 500) {
    console.error(`[Internal Server Error] ${status} - ${message}`);
    if (err.stack) console.error(err.stack);
  } else {
    console.warn(`[Client-Facing Warning] ${status} - ${message}`);
  }

  res.status(status).json({
    status,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};
