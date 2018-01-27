const heroes = require("dotaconstants").heroes;
const fs = require("fs-extra");

function buildHeroes() {
	const heroArray = [];

	for (const key in heroes) {
		heroArray.push({
			id: heroes[key].id,
			name: heroes[key].localized_name
		});
	}

	const json = JSON.stringify(heroArray);
	fs.outputFile("./build/heroNames.json", json)
	.then(() => {
		console.log(`Finished writing ${heroArray.length} heroes to file.`);
	})
	.catch(err => {
		console.error(err);
	});
}

buildHeroes();