const { Prefix, deschtimesToken, prefix} = require('../config.json');
const { EmbedBuilder } = require('discord.js');

module.exports = {
    async Blame(text, message) {
        
        series = text[1]
        let fulldata, unreleased
        try{
            fulldata = await fetch(`https://deschtimes.com/api/v1/groups/${deschtimesToken}/shows/${series}.json`)
            .then(data => data.json())
            unreleased = fulldata.episodes.filter(item => item.released === false)
            // console.log(fulldata.episodes)
        }
        catch(error) {
            message.reply("Series could not be found.")
            console.log(error)
            return
        }
        let episode
        if (text[2]) {
            console.log("Ep given,", text[2])
            try {
                episode = fulldata.episodes[parseInt(text[2]) - fulldata.episodes[0].number]
            }
            finally {
                if (episode === undefined) {
                    message.reply("No data on that episode")
                    return
                }
            }
        } else {
            episode = fulldata.episodes[fulldata.episodes.filter(item => item.released === false)[0].number - fulldata.episodes[0].number]
        }
        console.log(episode)

        let rollString = "" 
        for (i in episode.staff){
            roll = episode.staff[i]
            if (roll.finished) {
                rollString += `~~${roll.position.acronym}~~ `
            } else {
                rollString += roll.position.acronym + " "
            }

        }
        console.log("building embed")
        const emb = new EmbedBuilder()
            .setTitle(fulldata.name + " #" + episode.number)
            .setColor("#ffffff")
            .setThumbnail(fulldata.poster)
            .addFields(
                { name: "Status", value: rollString},
            )
            .setTimestamp()
        console.log("sending")
        message.channel.send({ embeds: [emb] });
    }
}