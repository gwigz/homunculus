class Collection<K, V> extends Map<K, V> {
	/**
	 * Returns all items in the collection as an array.
	 * @returns {Array} Array of values
	 */
	public toArray(): Array<any> {
		return [...this.values()]
	}

	/**
	 * Executes a function on all values.
	 * @param {Function} function forEach function parameters
	 * @returns {Array} forEach result
	 */
	public forEach(...args): Array<any> {
		return this.toArray().forEach.apply(this, args)
	}

	/**
	 * Filter values by function.
	 * @param {Function} function filter function parameters
	 * @returns {Array} Array of filtered values
	 */
	public filter(...args): Array<any> {
		return this.toArray().filter.apply(this, args)
	}

	/**
	 * Find values by function.
	 * @param {Function} function find function parameters
	 * @returns {*} Value that was found
	 */
	public find(...args): any {
		return this.toArray().find.apply(this, args)
	}

	/**
	 * Map values by function.
	 * @param {Function} function map function parameters
	 * @returns {Array} Array of mapped values
	 */
	public map(...args): Array<any> {
		return this.toArray().map.apply(this, args)
	}

	/**
	 * Reduce values by function.
	 * @param {Function} function reduce function parameters
	 * @returns {Array} Array of reduced values
	 */
	public reduce(...args): Array<any> {
		return this.toArray().reduce.apply(this, args)
	}

	/**
	 * Pluck values with key by function.
	 * @param {string} key The matching key
	 * @returns {Array} Array of keyed values
	 */
	public pluck(key: string): Array<any> {
		return this.toArray().reduce((index, object) => {
			if (!object[key]) {
				return index
			}

			index.push(object[key])

			return index
		}, [])
	}

	/**
	 * Group values by key.
	 * @param {string} key The matching key
	 * @returns {object} Object containing grouped values
	 */
	public groupBy(key: string): any {
		return this.toArray().reduce((index, object) => {
			const value = object[key]

			index[value] = index[value] || []
			index[value].push(object)

			return index
		}, {})
	}

	/**
	 * Get unique values.
	 * @returns {Array} unique Array of unique values
	 */
	public unique(): Array<Set<any>> {
		return [...new Set(this.toArray())]
	}
}

export default Collection
