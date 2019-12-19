'use strict';

const ajvService = require('./ajvService'),
      UniqueKeyException = require('../errors/UniqueKeyException');

const schemata = {};

const schemaService = {
	get schemata() {
		return schemata;
	},

	schema(id) {
		return schemata[id];
	},

	addSchemata(newSchemata) {
		for (const key of Object.keys(newSchemata)) {
			if (schemata[key]) {
				throw new UniqueKeyException(
					`Schema key '${key}' already exists on this ObjectModel`,
					key
				);
			}
			schemata[key] = newSchemata[key];
		}
	},

	addSchema(key, newSchema) {
		if (schemata[key]) {
			throw new UniqueKeyException(
				`Schema key '${key}' already exists on this ObjectModel`,
				key
			);
		}
		schemata[key] = newSchema;
	}
}

Object.setPrototypeOf(schemaService, ajvService);
module.exports = schemaService;
