const Utilities = {
	/*
	 * Transpose an object into a new object whose keys and values are the same
	 * 
	 * Ex: enumerate({ KEY: 'someVal' }) === { KEY: KEY }
	 */
	enumerate(object) {
		const keys = Object.keys(object);

		return keys.length > 0
			? Object.assign(
				...keys
				.map(key => (
					{ [key]: key }
				)))
			: {};
	}
}

module.exports = Utilities;
