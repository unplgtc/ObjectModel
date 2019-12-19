'use strict';

const ajvService = require('./ajvService'),
      ValidationError = require('../errors/ValidationError');

const ajv = ajvService.ajv;

const validationService = {
	buildValidator(schema) {
		return {
			validate: (data) => validate(schema, data)
		}
	}
}

function validate(schema, data) {
	if (!schema) {
		throw new ValidationError('Invalid Schema');
	}

	const validator = ajv.compile(schema);

	if (!validator(data)) {
		const ajvErrors = validator.errors[0];
		
		throw new ValidationError(
			`\`${ajvErrors.keyword}\` ${ajvErrors.message}`,
			{ id: schema.title, version: `v${schema.version}` },
			ajvErrors
		);
	}

	return true;
}

module.exports = validationService;
