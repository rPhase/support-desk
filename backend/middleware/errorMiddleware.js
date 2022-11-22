const errorHandler = (err, _req, res, _next) => {
  // Make sure to send bad status code if an error occurs
  const statusCode = res.statusCode < 400 ? 500 : res.statusCode;
  res.status(statusCode);
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};

module.exports = { errorHandler };
