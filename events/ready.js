const { Events } = require('discord.js');

module.exports = {
	name: Events.interactionCreate,
	once: false,
	execute(client) {
		console.log(`interaction created`);
	},
};