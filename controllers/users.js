const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const DuplicateError = require('../errors/duplicate');
const ValidationError = require('../errors/validation');
const AuthError = require('../errors/auth');
const NotFoundError = require('../errors/notFound');

const { JWT_SECRET } = require('../config');

const { notFoundUser, busyEmail, incorrectLoginOrPwd } = require('../constants/errorMessages');

const saltRounds = 10;

/** Получить информацию о пользователе. */
const getUserInfo = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    res.send(user);
  } catch (err) {
    next(err);
  }
};

/** Обновить информацию о пользователе. */
const updateUserInfo = async (req, res, next) => {
  const { name, email } = req.body;

  try {
    const user = await User.findByIdAndUpdate(req.user._id,
      { name, email },
      { new: true, runValidators: true });

    if (!user) {
      next(new NotFoundError(notFoundUser));
    }
    res.send({ data: user });
  } catch (err) {
    next(err);
  }
};

/** Создать нового пользователя. */
const createUser = async (req, res, next) => {
  const { name, email, password } = req.body;

  try {
    const hashPassword = await bcrypt.hash(password, saltRounds);

    if (hashPassword) {
      await User.create({
        name,
        email,
        password: hashPassword,
      });

      res.status(201).send({
        name,
        email,
      });
    }
  } catch (err) {
    if (err.name === 'ValidationError') {
      next(new ValidationError(`${Object.values(err.errors)
        .map((error) => error.message)
        .join(', ')}`));
    } else if (err.name === 'MongoServerError' && err.code === 11000) {
      next(new DuplicateError(busyEmail));
    } else {
      next(err);
    }
  }
};

/** Авторизировать пользователя. */
const login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      next(new AuthError(incorrectLoginOrPwd));
      return;
    }

    bcrypt.compare(password, user.password, (err, result) => {
      if (!result) {
        next(new AuthError(incorrectLoginOrPwd));
        return;
      }
      const token = jwt.sign({ _id: user._id },
        JWT_SECRET,
        { expiresIn: '7d' });
      res.send({ token });
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getUserInfo,
  updateUserInfo,
  createUser,
  login,
};
