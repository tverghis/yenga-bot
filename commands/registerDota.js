function register(db, message, args) {
	if (!validateProfile(args)) {
		handleInvalidReg(message);
		return;
	}

	registerProfileToUser(db, message, args);
}

function validateProfile(profile) {
	return (!!profile && !isNaN(profile));
}

function handleInvalidReg(message) {
	message.react("❌");
	message.channel.send("```diff" + 
		"\nInvalid format." + 
		"\nUse the ID from your Dotabuff or OpenDota profile page's URL." + 
		"\nFor example, if your Dotabuff profile is 'http://www.dotabuff.com/players/12345678', try again with:" + 
		"\n--regd 12345678" +
		"\n```");
}

function registerProfileToUser(db, message, profile) {
	db.get(`SELECT * FROM users WHERE discord_id = ${message.author.id}`, [], (err, row) => {
		if (!row) {
			db.run(`INSERT INTO users (discord_id, steam_id) VALUES (${message.author.id}, ${profile})`, [], err => {
				sendSuccessfulRegistrationMessage(message, profile);
			});
		} else {
			db.run(`UPDATE users SET steam_id = ${profile} WHERE discord_id = ${message.author.id}`, [], err => {
				sendSuccessfulRegistrationMessage(message, profile);
			});
		}
	});
}

function sendSuccessfulRegistrationMessage(message, profile) {
	message.react("✅");
	message.channel.send("```diff" + 
		`\nSuccessfully registered ${profile} to ${message.author.username}.` +
		"```");
}

module.exports = register;