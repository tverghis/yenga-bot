const fuzzy = require("fuzzy");
const heroes = require("../build/heroNames");

function heroSearch(input) {
	return fuzzy.filter(input, heroes, {
		extract: (heroObj) => {
			return heroObj.name;
		}
	})
	.map((e) => {
		return e.string;
	})[0];
}

module.exports = heroSearch;