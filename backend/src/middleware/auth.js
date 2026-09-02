const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../config/auth');

function authenticate(req, res, next) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Требуется авторизация' });
  }
  try {
    const decoded = jwt.verify(header.split(' ')[1], jwtSecret);
    req.user = decoded;
    next();
  } catch (e) {
    return res.status(401).json({ error: 'Неверный или просроченный токен' });
  }
}

function optionalAuth(req, res, next) {
  const header = req.headers.authorization;
  if (header && header.startsWith('Bearer ')) {
    try { req.user = jwt.verify(header.split(' ')[1], jwtSecret); } catch (e) {}
  }
  next();
}

module.exports = { authenticate, optionalAuth };
