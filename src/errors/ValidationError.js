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
			this.message += ` at ${ajvErrors.dataPath || 'top-level'}`;

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

			Object.defineProperty(this, 'schema', {
				value: ajvErrors.schema,
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

			Object.defineProperty(this, 'params', {
				value: ajvErrors.params,
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

			switch (ajvErrors.keyword) {
				case 'additionalProperties':
					return this.additionalPropertiesError();
				case 'is':
					return this.isError();
				case 'minProperties':
					console.log(ajvErrors)
					return this.minPropertiesError();
				case 'type':
					return this.typeError();
			}
		}
	}

	additionalPropertiesError() {
		this.message += ` but found \`${this.params.additionalProperty}\``;
	}

	isError() {
		let type = typeof this.data;

		if (type === 'object') {
			type = this.data.constructor.name;
		}

		this.message += ` (required type in [${this.schema}] but got \`${type}\`)`
	}

	minPropertiesError() {
		const missingProps = JSON.stringify(
			Object.keys(this.parentSchema.properties)
				.filter(it => !Object.keys(this.data).includes(it))
		);

		this.message += ` but found only ${Object.keys(this.data).length} properties (missing ${missingProps})`;
	}

	typeError() {
		this.message += ` but found ${typeof this.data}`;
	}
}

module.exports = ValidationError;
