function dotabuffMatchLink(matchID) {
	return `https://www.dotabuff.com/matches/${matchID}`;
}

function opendotaMatchLink(matchID) {
	return `https://www.opendota.com/matches/${matchID}`;
}

module.exports = {
	dotabuff: {
		match: dotabuffMatchLink
	},
	opendota: {
		match: opendotaMatchLink
	}
};