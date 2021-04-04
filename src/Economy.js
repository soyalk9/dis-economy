const Discord = require('discord.js')
const { EventEmitter } = require('events')
const db = require("quick.db")
class Economy extends EventEmitter {
    /**
     * @param {Discord.Client} client Discord.js client
     * @param {BotPrefix} prefix Discord Bot Prefix
     */
    constructor (client, prefix) {
        if (!client) throw new SyntaxError('Invalid Discord client')
        super()

this.client = client;
this.prefix = prefix
this.db = db;
}


}
