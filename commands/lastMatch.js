const axios = require("axios");
const matchDetails = require("../embeds/match");

async function sendLastMatchDetailsForUser(db, message) {

	db.get(`SELECT steam_id from users WHERE discord_id = ${message.author.id}`, [], async (err, row) => {
		if (!row || !row.steam_id) {
			message.channel.send("```diff" + 
				"\nYou don't have a Steam ID registered." +
				"\nYou must first register your Steam ID using the --regd command." +
				"\n```");
			return;
		}

		const data = await fetchLastMatchForPlayer(row.steam_id);

		if (!data || !data[0]) {
			message.channel.send("`Unable to retrieve the last match.`");
		}

		message.channel.send({
			embed: matchDetails(message.author, data[0])
		});

	});
}

async function fetchLastMatchForPlayer(playerID) {
	try {
		const response = await axios.get(`https://api.opendota.com/api/players/${playerID}/recentmatches`);
		return response.data;
	} catch (error) {
		console.log(error);
		return null;
	}
}

module.exports = sendLastMatchDetailsForUser;