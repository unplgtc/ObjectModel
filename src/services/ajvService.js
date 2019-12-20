'use strict';

const Ajv = require('ajv');
const ajv = new Ajv({ verbose: true });

const TYPES = {
	Object: Object,
	Array: Array,
	Function: Function,
	Number: Number,
	String: String,
	Date: Date,
	RegExp: RegExp,
	Buffer: Buffer,
	Promise: Promise
}

const isKeyword = {
	compile: function(schema) {
		if (typeof schema === 'string') {
			const type = getType(schema);
			return function(data) {
				try {
					return type.isPrototypeOf(data) || data instanceof type;
				} catch (err) {
					// Not the prototype, and cannot call instanceof on this Object
					return false;
				}
			}
		} else {
			const types = schema.map(getType);
			return function(data) {
				for (const type of types) {
					try {
						if (type.isPrototypeOf(data) || data instanceof type) {
							return true;
						}
					} catch (err) {}
				}
				return false;
			}
		}
	},

	metaSchema: {
		anyOf: [
			{ type: 'string' },
			{
				type: 'array',
				items: { type: 'string' }
			}
		]
	}
}

function getType(type) {
	if (TYPES[type]) {
		return TYPES[type];
	}
	throw new Error(`Invalid 'is' keyword type '${type}'`);
}

ajv.addKeyword('is', isKeyword);

const ajvService = {
	get ajv() {
		return ajv;
	},

	addKeyword(keyword, validator) {
		ajv.addKeyword(keyword, validator);
	},

	addTypes(types) {
		for (const [name, type] of Object.entries(types)) {
			this.addType(name, type);
		}
	},

	addType(name, type) {
		if (!TYPES[name]) {
			TYPES[name] = type;
		} else {
			throw new Error(`Type '${name}' already added to AJV`);
		}
	}
}

module.exports = ajvService;
