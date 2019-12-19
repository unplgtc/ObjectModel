const UniqueKeyException = require('./UniqueKeyException'),
      ValidationError = require('./ValidationError');

const errors = {
	UniqueKeyException: UniqueKeyException,
	ValidationError: ValidationError
}

module.exports = errors;
