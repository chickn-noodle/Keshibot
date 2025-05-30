// Require the necessary discord.js classes
// TEST 1
const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, Events, GatewayIntentBits} = require('discord.js');
const dotenv = require('dotenv');
dotenv.config();
const token = process.env.token

// for the TCP health checks
const port = process.env.PORT
const express = require('express')
const app = express()


// Create a new client instance
// const allIntents = new Intents(34511); // create an intent object for all intents
const client = new Client({
    intents: [
        // List all the intents your bot needs explicitly
        GatewayIntentBits.Guilds,             // For general guild (server) related events (creation, deletion, updates)
        GatewayIntentBits.GuildMessages,      // For messages sent in guild channels (text channels)
        GatewayIntentBits.MessageContent,     // <--- **VERY IMPORTANT:** Required to read the actual content of messages (e.g., for prefix commands, keyword replies)
        // Add other intents based on your bot's functionality:
        // GatewayIntentBits.GuildMembers,     // Required for fetching member lists, member join/leave events, role changes on members. (Privileged)
        // GatewayIntentBits.GuildPresences,   // Required for user presence updates (online/offline status, activities). (Privileged)
        // GatewayIntentBits.GuildMessageReactions, // For reactions added/removed from messages in guilds
        // GatewayIntentBits.GuildVoiceStates, // For voice state changes (joining/leaving voice channels)
        // GatewayIntentBits.DirectMessages,   // For messages sent in direct messages
        // GatewayIntentBits.DirectMessageReactions, // For reactions in direct messages
        // GatewayIntentBits.GuildModeration, // For moderation events like bans, kicks, mutes
        // ... and so on for other specific needs
    ],
});

client.commands = new Collection(); // create commands collection

// loads all command files from ./commands
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		// Set a new item in the Collection with the key as the command name and the value as the exported module
		if ('data' in command && 'execute' in command) {
			client.commands.set(command.data.name, command);
		} else {
			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}

// listen for interactions, find the command in the collection, and run the command's .execute() method
client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand()) return;

	const command = interaction.client.commands.get(interaction.commandName);

	if (!command) {
		console.error(`No command matching ${interaction.commandName} was found.`);
		return;
	}

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		if (interaction.replied || interaction.deferred) {
			await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
		} else {
			await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
		}
	}
});

// retrive events from ./events
const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
	const filePath = path.join(eventsPath, file);
	const event = require(filePath);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	} else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}

// ...
// Define your health check route
app.get('/health', (req, res) => {
    if (client.isReady()) { // Check if the Discord client is ready
        res.status(200).send('OK');
    } else {
        res.status(503).send('Bot not ready'); // Service Unavailable
    }
});

// Log in to Discord
client.login(token);

// After successful login, start the Express server
client.once(Events.ClientReady, c => {
    console.log(`Ready! Logged in as ${c.user.tag}`);
    app.listen(port, () => {
        console.log(`App is listening on port ${port} for health checks.`);
    });
});