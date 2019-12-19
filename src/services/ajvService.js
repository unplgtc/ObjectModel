'use strict';

const Ajv = require('ajv');
const ajv = new Ajv({ verbose: true });

// Add the `instanceof` keyword to our ajv instance
require('ajv-keywords')(ajv, 'instanceof');

const ajvInstanceof = require('ajv-keywords/keywords/instanceof').definition;

const ajvService = {
	get ajv() {
		return ajv;
	},

	addTypes(types) {
		for (const nameAndType of types) {
			this.addType(...nameAndType);
		}
	},

	addType(name, type) {
		ajvInstanceof.CONSTRUCTORS[name] = type;
	}
}

module.exports = ajvService;
