const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('create-directory')
		.setDescription('create a new chapter folder in the google drive')
		.addStringOption(option =>
			option.setName('series')
				.setDescription('which series to create the folder for')
                .setRequired(true)
                .addChoices(
                    { name: 'Moto', value: 'moto' },
                    { name: "Chi", value: 'chi'}
                ))
        .setDefaultMemberPermissions(PermissionFlagsBits.MentionEveryone),
	async execute(interaction) {
        // await interaction.deferReply();
        let appURL;
        if(interaction.options.getString('series') === 'moto') {
            appUrl = 'https://script.google.com/macros/s/AKfycbyRZgfMn-khz2ITEnXL_07FbsYESjo2SXSIs5bcv-9opJZoQtY796gpQqK1ZAhWuD_yWQ/exec';
        } else if (interaction.options.getString('series') === 'chi') {
            appUrl = 'https://script.google.com/macros/s/AKfycbxE6SD0_YyD0OTpmK1u6NE5Fzb85RECxEGcfHHC85OEI4lv5SQmMe1BrSP6WpfxHsRr/exec';
        }
        await fetch(appUrl)
                    .then(data => console.log(data))
                    .then(interaction.reply("Directory Created."));
	},
};