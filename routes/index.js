const router = require('express').Router();
const usersRoutes = require('./users');
const moviesRoutes = require('./movies');
const authRoutes = require('./authorization');
const NotFoundError = require('../errors/notFound');
const auth = require('../middlewares/auth');
const { incorrectURL } = require('../constants/errorMessages');

router.use('/', authRoutes);
router.use(auth);
router.use('/users', usersRoutes);
router.use('/movies', moviesRoutes);

router.use('*', () => {
  throw new NotFoundError(incorrectURL);
});

module.exports = router;
