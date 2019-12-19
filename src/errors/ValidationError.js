class ValidationError extends Error {
	constructor(message, schema, ajvErrors) {
		super(message);

		Object.defineProperty(this, 'name', {
			value: 'ValidationError',
			writable: false,
			configurable: false,
			enumerable: false
		});

		if (schema) {
			this.message = `[${schema.id}:${schema.version}] ${message}`

			Object.defineProperty(this, 'schemaId', {
				value: schema.id,
				writable: false,
				configurable: false,
				enumerable: false
			});

			Object.defineProperty(this, 'schemaVersion', {
				value: schema.version,
				writable: false,
				configurable: false,
				enumerable: false
			});
		}

		if (ajvErrors) {
			this.message += ` at \`${ajvErrors.dataPath}\``;

			Object.defineProperty(this, 'failedProperty', {
				value: ajvErrors.keyword,
				writable: false,
				configurable: false,
				enumerable: false
			});

			Object.defineProperty(this, 'failedPropertyPath', {
				value: ajvErrors.dataPath,
				writable: false,
				configurable: false,
				enumerable: false
			});

			Object.defineProperty(this, 'schemaPath', {
				value: ajvErrors.schemaPath,
				writable: false,
				configurable: false,
				enumerable: false
			});

			Object.defineProperty(this, 'parentSchema', {
				value: ajvErrors.parentSchema,
				writable: false,
				configurable: false,
				enumerable: false
			});

			Object.defineProperty(this, 'data', {
				value: ajvErrors.data,
				writable: false,
				configurable: false,
				enumerable: false
			});
		}
	}
}

module.exports = ValidationError;
