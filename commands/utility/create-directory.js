const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

const dotenv = require('dotenv');
dotenv.config();
const motoDirLink = process.env.motoDirLink
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
                    { name: 'Harapeko', value: 'harapeko' },
                    { name: "Chi", value: 'chi'}
                ))
        .setDefaultMemberPermissions(PermissionFlagsBits.MentionEveryone),
	async execute(interaction) {
        // await interaction.deferReply();
        let appUrl;
        if(interaction.options.getString('series') === 'harapeko') {
            appUrl = motoDirLink;
        } else if (interaction.options.getString('series') === 'chi') {
            appUrl = chiDirLink;
        }
        console.log(appUrl)
        await fetch(appUrl)
                    .then(data => console.log(data))
                    .then(interaction.reply("Directory Created."));
	},
};