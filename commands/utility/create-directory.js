const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

const dotenv = require('dotenv');
dotenv.config();
const hpkDirLink = process.env.hpkDirLink
const chiDirLink = process.env.chiDirLink

module.exports = {
	data: new SlashCommandBuilder()
		.setName('create-directory')
		.setDescription('create a new chapter folder in the google drive')
		.addStringOption(option =>
			option.setName('series')
				.setDescription('which series to create the folder for')
                .setRequired(true)
                .addChoices(
                    { name: 'Harapeko', value: 'harapeko' }
                ))
        .setDefaultMemberPermissions(PermissionFlagsBits.MentionEveryone),
	async execute(interaction) {
        // await interaction.deferReply();
        let appUrl;
        if(interaction.options.getString('series') === 'harapeko') {
            appUrl = hpkDirLink;
        } else {
            return interaction.reply("Invalid Series input.");
        }
		const response = await fetch(appUrl);
		if (response.status === 200) {
			await interaction.reply("Directory Created.");
		} else {
			await interaction.reply("Uh Oh, something wen't wrong.");
		}
	},
};