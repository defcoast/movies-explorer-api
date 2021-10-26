const jwt = require('jsonwebtoken');
const AuthError = require('../errors/auth');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    next(new AuthError('Необходима авторизация'));
  }

  const token = authorization.replace('Bearer', '');
  let payload;

  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'some-secret-key');
  } catch (error) {
    next(new AuthError('Необходима авторизация'));
  }

  req.user = payload;

  next();
};
