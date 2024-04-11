const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { EmbedBuilder } = require('discord.js');
const prefix = process.env.prefix;

module.exports = {
    data: new SlashCommandBuilder()
        .setName("help-scan")
        .setDescription("Display a list of all the scanlation related commands.")
        .setDefaultMemberPermissions(PermissionFlagsBits.MentionEveryone),
    async execute(interaction) {
        const helpEmb = new EmbedBuilder()
            .setTitle("Scanlation Commands")
            .setDescription("Here are a list of all my scanlation related commands")
            .setFields(
                { name:"__**Text Commands**__", value:`
                *prefix: ${prefix}*
                \`blame [series] {number}\`: Displays the status of the last unreleased chapter, or the chapter number given
                \`done [role] [series] {number}\`: Marks [role] as done on the given [series] for the last unreleased chapter, or the chapter number given
                \`undone [role] [series] {number}\`: Marks [role] as __not__ done on the given [series] for the last unreleased chapter, or the chapter number given
                \`release [series]\`: Releases the last unreleased chapter if all the roles are done
                `, inline: false},
                { name: " ", value: " ", inline: false},
                { name: "__**Slash Commands**__", value:`
                \`/help-scan\`: Displays this embed
                \`/create-directory [series]\`: Creates a new folder in the Google drive, including the required file templates and subfolders, for the given series (currently only for moto or chi)
                `, inline: false },
            )
            .setColor('0ed8ea');
        
    interaction.reply({ embeds: [helpEmb] });
    }
}