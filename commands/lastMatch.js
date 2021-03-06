const axios = require("axios");
const matchDetails = require("../embeds/match");

async function sendLastMatchDetailsForUser(db, client, message, userForMatch) {
	let isRequestForMessageAuthor = (message.author.id === userForMatch.id);

	db.get(`SELECT steam_id from users WHERE discord_id = ${userForMatch.id}`, [], async (err, row) => {
		if (!row || !row.steam_id) {
			let failureMessage;

			if (isRequestForMessageAuthor) {
				failureMessage = "```diff" + 
				"\nYou don't have a Steam ID registered." +
				"\nYou must first register your Steam ID using the --regd command." +
				"\n```";
			} else {
				failureMessage = "```diff" +
					`\n${userForMatch.username} hasn't registered their Steam ID yet.` +
					"\nI can't pull up their last match." +
					"\n```";
				message.react("🤦");
			}

			message.channel.send(failureMessage);
			return;
		}

		const data = await fetchLastMatchForPlayer(row.steam_id);

		if (!data || !data[0]) {
			message.react("❌");
			message.channel.send("`Unable to retrieve the last match.`");
		}

		message.channel.send({
			embed: matchDetails(userForMatch, data[0])
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