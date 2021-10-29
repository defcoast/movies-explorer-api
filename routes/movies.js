const router = require('express').Router();
const { Joi, celebrate } = require('celebrate');
const handleURL = require('../middlewares/handleURL');

const { getAllMovies, createNewMovie, deleteMovie } = require('../controllers/movies');

router.get('/', getAllMovies);

router.post('/', celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().required().custom(handleURL),
    trailer: Joi.string().required().custom(handleURL),
    thumbnail: Joi.string().required().custom(handleURL),
    movieId: Joi.string().required().min(1),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
  }),
}), createNewMovie);

router.delete('/:movieId', celebrate({
  params: Joi.object().keys({
    movieId: Joi.string().hex().length(24),
  }),
}), deleteMovie);

module.exports = router;
