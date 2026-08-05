const jwt = require('jsonwebtoken');

const JWT_EXPIRES_IN = '7d';

const signToken = (payload) => jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

const verifyToken = (token) => jwt.verify(token, process.env.JWT_SECRET);

module.exports = { signToken, verifyToken };
