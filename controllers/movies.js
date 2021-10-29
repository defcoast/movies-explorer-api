const Movie = require('../models/movie');
const NotFoundError = require('../errors/notFound');
const ValidationError = require('../errors/validation');
const ForbiddenError = require('../errors/forbidden');

const { notFoundFilm, notDeleteFilmsByOtherUsers, incorrectId } = require('../constants/errorMessages');

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
      owner: req.user._id,
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
      next(new NotFoundError(notFoundFilm));
    } else if (!movie.owner.equals(req.user._id)) {
      next(new ForbiddenError(notDeleteFilmsByOtherUsers));
    } else {
      Movie.deleteOne(movie).then(() => res.send({ data: movie }));
    }
  } catch (err) {
    if (err.name === 'CastError') {
      next(new ValidationError(incorrectId));
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
