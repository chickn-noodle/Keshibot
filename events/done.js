// const { deschtimesToken } = require('../config.json');
const deschtimesToken = process.env.deschtimesToken
const dotenv = require('dotenv');
const { Blame } = require('./blame.js')

module.exports = {
    async Done(text, message) {
        if (!text[1]) {
            // console.log("no pos")
            message.reply("Please give a roll")
            return
        } else if (!text[2]) {
            // console.log("No series")
            message.reply("Please give a series.")
            return
        }
        const position = text[1]
        const series = text[2]
        let url = `https://deschtimes.com/api/v1/groups/${deschtimesToken}/shows/${series}/staff?finished=true&member=${message.author.id}&position=${position}`
        
        if (text[3]) {
            url = url.concat(`&episode_number=${text[3]}`)
        }

        const returnData = await fetch(url, { method: "PATCH" })
        const data = await returnData.json()
        if (returnData.ok) {
            message.reply(`${position} marked done.`)
        } else {
            message.reply(data.message)
            return
        }
        Blame(['blame', series, text[3] ? text[3] : null], message)
    }
}