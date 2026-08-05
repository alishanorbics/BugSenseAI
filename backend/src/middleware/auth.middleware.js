const logger = require('../config/logger');
const { verifyToken } = require('../helpers/token');

const AuthVerifier = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'Authentication required.' });
    }

    const token = authHeader.split(' ')[1];
    req.decoded = verifyToken(token);

    return next();
  } catch (error) {
    logger.error(`AuthVerifier Error: ${error.message}`);
    return res.status(401).json({ success: false, message: 'Invalid or expired token.' });
  }
};

const OptionalAuthVerifier = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      req.decoded = verifyToken(token);
    }

    return next();
  } catch (error) {
    return next();
  }
};

module.exports = { AuthVerifier, OptionalAuthVerifier };
