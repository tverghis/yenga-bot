const heroes = require('dotaconstants').heroes;
const moment = require('moment');
const links = require('../lib/links');
const gameModes = require('../lib/gameModes');
const lobbies = require('../lib/lobbies');

function matchEmbed(user, matchDetails) {
	const matchID = matchDetails.match_id;
	const dotabuffLink = links.dotabuff.match(matchID);
	const opendotaLink = links.opendota.match(matchID);
	const playerSlotBits = parsePlayerSlotData(matchDetails.player_slot);
	const playerFaction = playerSlotBits.charAt(0);
	const duration = `${Math.floor(matchDetails.duration / 60)}:${("00" + matchDetails.duration % 60).substr(-2, 2)}`;
	const matchEnd = matchDetails.start_time + matchDetails.duration;

	return {
		title: `${user.username} ${getWonLostString(matchDetails.radiant_win, playerFaction)} a game as ${heroes[matchDetails.hero_id].localized_name} ${moment(matchEnd, "X").fromNow()}.`,
		description: `[Dotabuff](${dotabuffLink}) | [OpenDota](${opendotaLink})`,
		fields: [{
			name: duration,
			value: getFactionString(playerFaction),
			inline: true
		}, {
			name: gameModes[matchDetails.game_mode],
			value: lobbies[matchDetails.lobby_type],
			inline: true
		}, {
			name: getKDAString(matchDetails),
			value: getGPMXPMString(matchDetails),
			inline: true
		}]
	};
}

function parsePlayerSlotData(playerSlot) {
	return padTo8Bits(parseInt(playerSlot).toString(2));
}

function padTo8Bits(binaryValue) {
	return binaryValue.padStart(8, "0");
}

function getFactionString(faction) {
	return faction === '0' ? "Radiant" : "Dire";
}

function getWonLostString(radiantWin, playerFaction) {
	const didPlayerWin = ((radiantWin && (playerFaction === '0')) || (!radiantWin && (playerFaction === '1')));

	return didPlayerWin ? "won" : "lost";
}

function getKDAString(matchDetails) {
	return ` :crossed_swords: ${matchDetails.kills} :skull_crossbones: ${matchDetails.deaths} :handshake: ${matchDetails.assists}`;
}

function getGPMXPMString(matchDetails) {
	return `${matchDetails.gold_per_min} GPM · ${matchDetails.xp_per_min} XPM`;
}

module.exports = matchEmbed;