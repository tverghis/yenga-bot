const Discord = require("discord.js");
const sqlite3 = require("sqlite3").verbose();
const config = require("./yenga-config.json");
const commands = require("./commands");

const client = new Discord.Client();

let db = new sqlite3.Database(config.sqlite3, sqlite3.OPEN_READWRITE , err => {
	if (err) {
		console.log("Unable to open a connection to the database.");
		return;
	}

	console.log("Connected to the database.");
});

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
		let userForMatch = message.mentions.users.first() || message.author;
		commands.lastMatch(db, client, message, userForMatch);
	}

	if (command === "registerDota" || command === "regd") {
		commands.registerDota(db, message, args[0]);
	}
}

function messageStartsWithPrefix(prefix, message) {
	return message.content.indexOf(prefix) === 0;
}

client.login(config.token);