const logger = require('../config/logger');

const errorHandler = (err, req, res, next) => {
  logger.error(`Unhandled Error: ${err.message}`);

  const statusCode = err.statusCode || 500;

  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal server error.',
  });
};

module.exports = errorHandler;
