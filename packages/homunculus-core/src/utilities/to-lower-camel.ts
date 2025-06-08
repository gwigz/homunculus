export function toLowerCamel(value: string) {
	if (value === value.toUpperCase()) {
		return value.toLowerCase()
	}

	return value
		.replace(/([A-Z]+)([A-Z][a-z])/g, "$1 $2")
		.replace(/([a-z\d])([A-Z])/g, "$1 $2")
		.split(" ")
		.map((word, i) => {
			if (i === 0) {
				// for the first word, if it's all uppercase, lowercase the entire word
				if (word === word.toUpperCase()) {
					return word.toLowerCase()
				}

				// otherwise, just lowercase the first character
				return word.charAt(0).toLowerCase() + word.slice(1)
			}

			// for subsequent words, capitalize first letter and lowercase the rest
			return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
		})
		.join("")
}
