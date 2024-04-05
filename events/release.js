// const { deschtimesToken } = require('../config.json');
const deschtimesToken = process.env.deschtimesToken
const { Blame } = require('./blame.js')

module.exports = {
    async Release(text, message) {
        if(!text[1]) {
            message.reply("Please give a series.")
            return
        }
        const series = text[1]
        const url = `https://deschtimes.com/api/v1/groups/${deschtimesToken}/shows/${series}/episodes?member=${message.author.id}`

        const returnData = await fetch(url, { method: "PATCH"})
        const data = await returnData.json()

        if (returnData.ok) {
            message.reply("Chapter released.")
        } else {
            message.reply(data.message)
            return
        }
        Blame(['blame', series], message)
    }
}