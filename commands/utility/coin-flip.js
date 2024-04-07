const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('coin-flip')
		.setDescription('flip a coin to make a decision')
		.addStringOption(option =>
			option.setName('options')
				.setDescription('which options to choose from (comma separated)')
                .setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.MentionEveryone),
	async execute(interaction) {
        if(Math.floor(Math.random() * 1000) == 0) {
            interaction.reply("The coin landed on its side!")
            return
        }

        const optionArray = interaction.options.getString('options').split(",");
        optionArray.forEach(element => {element = element.trim()});
        console.log(optionArray);
        
        interaction.reply(`The coin chose ${optionArray[Math.floor(Math.random() * optionArray.length)]}!`)
    }
};