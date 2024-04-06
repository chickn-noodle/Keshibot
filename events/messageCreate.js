// const { Prefix, deschtimesToken, prefix} = require('../config.json');
const prefix = process.env.prefix
const deschtimesToken = process.env.deschtimesToken
const { EmbedBuilder } = require('discord.js');

// text command list
const { Blame } = require('./blame.js')
const { Done } = require('./done.js')
const { Undone } = require('./undone.js')
const { Release } = require("./release.js")
const { CreateFile } = require("./createfile.js")

module.exports = {
    name:   'messageCreate',
    async execute(message) {
        if (message.content.substring(0,2) != prefix) {
            return
        }
        const text = message.content.slice(2).split(" ")
        // console.log(text)
        switch (text[0]) {
            case "blame":
                Blame(text, message)
                break
            case "done":
                Done(text, message)
                break
            case "undone":
                Undone(text, message)
                break
            case "release":
                Release(text, message)
                break
            case "createfile":
                CreateFile()
                break
        }
    }
}