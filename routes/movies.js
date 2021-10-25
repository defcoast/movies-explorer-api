const router = require('express').Router();

const {getAllMovies, createNewMovie, deleteMovie} = require('../controllers/movies');

router.get('/', getAllMovies);
router.post('/', createNewMovie);
router.delete('/:movieId', deleteMovie);

module.exports = router;
