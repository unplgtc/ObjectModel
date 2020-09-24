'use strict';

const ajvService = require('./ajvService'),
      UniqueKeyException = require('../errors/UniqueKeyException');

const schemas = {};

const schemaService = {
	get schemas() {
		return schemas;
	},

	schema(id) {
		return schemas[id];
	},

	addSchemas(newSchemas) {
		for (const key of Object.keys(newSchemas)) {
			if (schemas[key]) {
				throw new UniqueKeyException(
					`Schema key '${key}' already exists on this ObjectModel`,
					key
				);
			}
			schemas[key] = newSchemas[key];
		}
	},

	addSchema(key, newSchema) {
		if (schemas[key]) {
			throw new UniqueKeyException(
				`Schema key '${key}' already exists on this ObjectModel`,
				key
			);
		}
		schemas[key] = newSchema;
	}
}

Object.setPrototypeOf(schemaService, ajvService);
module.exports = schemaService;
