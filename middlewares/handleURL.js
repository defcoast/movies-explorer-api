const validator = require('validator');
const ValidationError = require('../errors/validation');

const { incorrectLinkFormat } = require('../constants/errorMessages');

const handleURL = (value) => {
  if (!validator.isURL(value, { require_protocol: true })) {
    throw new ValidationError(incorrectLinkFormat);
  }
  return value;
};

module.exports = handleURL;
