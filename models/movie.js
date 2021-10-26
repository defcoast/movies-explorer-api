const mongoose = require('mongoose');
const validator = require('validator');

const movieSchema = mongoose.Schema({
  country: {
    type: String,
    required: true,
  },

  director: {
    type: String,
    required: true,
  },

  duration: {
    type: Number,
    required: true,
  },

  year: {
    type: String,
    required: true,
  },

  description: {
    type: String,
    required: true,
  },

  image: {
    type: String,
    required: true,
    validate: (v) => validator.isURL(v),
  },

  trailer: {
    type: String,
    required: true,
    validate: (v) => validator.isURL(v),
  },

  thumbnail: {
    type: String,
    required: true,
    validate: (v) => validator.isURL(v),
  },

  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },

  movieId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'movie',
    required: true,
  },

  nameRU: {
    type: String,
    required: true,
  },

  nameEN: {
    type: String,
    required: true,
  },
});

const model = mongoose.model('movie', movieSchema);
module.exports = model;
