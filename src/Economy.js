const Discord = require('discord.js')
class Economy extends EventEmitter {
    /**
     * @param {Discord.Client} client Discord.js client
     * @param {BotPrefix} prefix Discord Bot Prefix
     */
    constructor (client, options = {}) {
        if (!client) throw new SyntaxError('Invalid Discord client')
        super()
}{
