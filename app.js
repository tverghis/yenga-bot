const Discord = require("discord.js");
const axios = require("axios");
const config = require("./yenga-config.json");

const matchDetails = require("./embeds/match");

const client = new Discord.Client();

client.on("ready", () => {
	const guilds = client.guilds.array();
	console.log(`Successfully logged in and joined ${guilds.length} server(s):`);
	for (guild of guilds) {
		console.log(`  ${guild.name} (${guild.memberCount})`);
	}
});

client.on("message", handleMessage);

async function handleMessage(message) {
	if (message.author.bot) return;

	if (!messageStartsWithPrefix(config.prefix, message)) return;

	const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
	const command = args.shift().toLowerCase();

	if (command === "ping") {
		message.reply("Pong!");
	}

	if (command === "pong") {
		message.reply("Why?");
	}

	if (command === "lm" || command === "lastmatch") {
		const data = await fetchLastMatchForPlayer("133268862");
		message.channel.send({
			embed: matchDetails(message.author, data[0])
		});
	}
}

function messageStartsWithPrefix(prefix, message) {
	return message.content.indexOf(prefix) === 0;
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

client.login(config.token);