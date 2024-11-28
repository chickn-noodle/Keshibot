const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const {spawn} = require('child_process')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('upload-chapter')
		.setDescription('upload a manga chapter to Mangadex')
        .addStringOption(option => {
            return option.setName('number')
                .setDescription('chapter number')
                .setRequired(true)
        })
		.addStringOption(option =>
			option.setName('title')
				.setDescription('chapter title (if none, set to NONE)')
                .setRequired(true))
        .addStringOption(option => {
            return option.setName('volume')
                .setDescription('chapter volume (if none, set to NONE)')
                .setRequired(true)
        })
        .setDefaultMemberPermissions(PermissionFlagsBits.MentionEveryone),
	async execute(interaction) {
        // get title, or leave null
        if (interaction.options.getString('title')) {
            title = interaction.options.getString('title')
        } else {
            title = null
        }

        // get volume, or leave null
        if (interaction.options.getString('volume')) {
            volume = interaction.options.getString('volume')
        } else {
            volume = null
        }

        // get chapter number
        chapNum = interaction.options.getString('number')

        // spawn child process
        pyChild = spawn('python', ['./commands/utility/mdex-endpoint.py', title, chapNum, volume])

        interaction.reply("Uploading...")
        
        pyChild.stdout.on('data', (data) => {
            interaction.channel.send(`data : ${data}`);
        })
        
        pyChild.stderr.on('data', (data) => {
            console.log(data.toString());
        })
        
    }
};