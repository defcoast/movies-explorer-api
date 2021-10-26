const Movie = require('../models/movie');
const NotFoundError = require('../errors/notFound');
const ValidationError = require('../errors/validation');
const ForbiddenError = require('../errors/forbidden');

/** Получить все фильмы. */
const getAllMovies = async (req, res, next) => {
  try {
    const movie = await Movie.find({});
    res.status(200).send(movie);
  } catch (err) {
    next(err);
  }
};

/** Создать новый фильм. */
const createNewMovie = async (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
  } = req.body;

  try {
    const movie = await Movie.create({
      country,
      director,
      duration,
      year,
      description,
      image,
      trailer,
      nameRU,
      nameEN,
      thumbnail,
      movieId,
    });
    res.status(201).send(movie);
  } catch (err) {
    if (err.name === 'ValidationError') {
      next(new ValidationError(`${Object.values(err.errors).map((error) => error.message).join(', ')}`));
    } else {
      next(err);
    }
  }
};

/** Удалить фильм. */
const deleteMovie = async (req, res, next) => {
  try {
    const movie = await Movie.findById(req.params.movieId);

    if (!movie) {
      next(new NotFoundError('Такой карточки не существует'));
    } else if (!movie.owner.equals(req.user._id)) {
      next(new ForbiddenError('Вы не можете удалять чужие карточки'));
    } else {
      Movie.deleteOne(movie).then(() => res.send({ data: movie }));
    }
  } catch (err) {
    if (err.name === 'CastError') {
      next(new ValidationError('Некорректный id'));
    } else {
      next(err);
    }
  }
};

module.exports = {
  getAllMovies,
  createNewMovie,
  deleteMovie,
};
