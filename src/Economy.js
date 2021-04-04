const Discord = require('discord.js')
const { EventEmitter } = require('events')
const db = require("quick.db")


const defaultOptions = {
currency: '$'
}

class Economy extends EventEmitter {
    /**
     * @param {Discord.Client} client Discord.js client
     * @param {BotPrefix} prefix Discord Bot Prefix
     */
    constructor (client, prefix, options = {}) {
        if (!client) throw new SyntaxError('Invalid Discord client')
        if (!prefix) throw new SyntaxError('Invalid Bot Prefix')
        super()

this.client = client;
this.prefix = prefix
this.db = db;
        this.options = defaultOptions
        for (const prop in options) {
            this.options[prop] = options[prop]
        }
}
start() {
this.client.on("message", async message => {
    if(message.author.bot) return;
    if(message.channel.type === "dm") return;
    let prefix = this.prefix
    let messageArray = message.content.split(" ");
    let args = message.content.slice(prefix.length).trim().split(/ +/g);
    let cmd = args.shift().toLowerCase();

if(cmd === "bal" || cmd === "balance") {
  let user = message.mentions.members.first() || message.guild.members.cache.find(c => c.user.username === args.join(" ")) || message.guild.members.cache.find(m => m.user.id === args[0]) || message.member;
  let money = await this.db.get(`money_${user.user.id}`);
  let bank = await this.db.get(`bank_${user.user.id}`);
  let job = await this.db.get(`job_${user.user.id}`)
  let limit = await this.db.get(`limit_${message.author.id}`)
  
 if(limit === null) this.db.set(`limit_${message.author.id}`, 1000)
  if(limit === null) limit = 1000
  
  if(!money) money = 0;
  if(!bank) bank = 0;
  if(job === 10) this.db.add(`limit_${message.author.id}`, 2000)
  if(job === 20) this.db.add(`limit_${message.author.id}`, 4000)
  if(job === 50) this.db.add(`limit_${message.author.id}`, 8000)
  if(job === 75) this.db.add(`limit_${message.author.id}`, 10000)
  if(job === 100) this.db.add(`limit_${message.author.id}`, 15000)
  
  
  let total = bank+money;
  
  const embed = new Discord.MessageEmbed()
  .setAuthor(`${user.user.username}'s Balance`, user.user.displayAvatarURL({dynamic: true}))
  .setDescription(`**💸 Cash**: ${money}${this.options.currency}\n**🏦 Bank**: ${bank}/${limit}${this.options.currency}\n**⚖️ Total Currency**: ${total}${this.options.currency}`)
  .setColor(this.options.color)
  .setFooter(client.user.username, client.user.avatarURL())
  message.channel.send(embed).catch(console.log)

}


})

}


}
module.exports = Economy;
