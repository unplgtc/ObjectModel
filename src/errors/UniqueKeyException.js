class UniqueKeyException extends Error {
	constructor(message, key) {
		super(message);

		Object.defineProperty(this, 'name', {
			value: 'UniqueKeyException',
			writable: false,
			configurable: false,
			enumerable: false
		});

		Object.defineProperty(this, 'nonUniqueKey', {
			value: key,
			writable: false,
			configurable: false,
			enumerable: false
		});
	}
}

module.exports = UniqueKeyException;
