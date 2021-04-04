const Discord = require('discord.js')
const { EventEmitter } = require('events')
const db = require("quick.db")


const defaultOptions = {
currency: '$',
color: "RANDOM"
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
  .setFooter(this.client.user.username, this.client.user.avatarURL())
  message.channel.send(embed).catch(console.log)

}
else if(cmd == "dep" || cmd === "deposit") {
  
  let money = await this.db.get(`money_${message.author.id}`)
  let job = await this.db.get(`job_${message.author.id}`)
  let bank = await this.db.get(`bank_${message.author.id}`) 
  let limit = await this.db.get(`limit_${message.author.id}`)
  let amount = parseInt(args[0])
  let bankk = limit-bank
  
  if(!money) money = 0;
  if(!bank) bank = 0;
  if(bank === limit) return message.channel.send(`Your bank is full! you cannot deposit anymore money in bank\nYou can increase your bank limit by working`)   
  if(amount > bankk) return message.channel.send(`You don't have enough space in bank to deposit ${amount} <:meowcoin:759993220108648509>`) 
  if(amount > money) return message.channel.send(`You cannot deposit more than you have .-.`)
  if(args[0].includes("-")) return message.channel.send(`You cannot deposit negative amount`)
  
 if(args[0] === "all".toLowerCase()) {
   
   let bal;
   if(money > limit) bal = bankk
   if(money === limit) bal = money
   if(money < limit) bal = money
   if(money === 0) return message.channel.send(`You cannot deposit empty balance`)
    
   
    const embed = new discord.MessageEmbed()
    .setAuthor(`Successfully Deposited!`, message.author.avatarURL({dymamic: true}))
    .setDescription(`Successfully deposited all your money`)
    .setColor(this.options.color)
    .setFooter(`You cannot deposit more than the limit of bank`)
    
    message.channel.send(embed)
    
    this.db.add(`bank_${message.author.id}`, bal)
    this.db.subtract(`money_${message.author.id}`, bal)
 } else {
   
   if(!amount) return message.channel.send(`Please provide a valid amount of money to deposit`)
   if(amount === 0) return message.channel.send(`\`0\` ?? you cannot deposit 0 coins`)
   
   const embed = new discord.MessageEmbed()
   .setAuthor(`Successfully Deposited!`, message.author.avatarURL({dynamic: true}))
   .setDescription(`Successfully deposited ${amount}${this.options.currency}`)
   .setColor(this.options.color)
    
   message.channel.send(embed)
   
   this.db.add(`bank_${message.author.id}`, amount)
   this.db.subtract(`money_${message.author.id}`, amount) 
 }
} //deposit command
else if(cmd == "with" || cmd == "withdraw") {
  let amount = parseInt(args[0])
  let bank = await this.db.get(`bank_${message.author.id}`)
  
  if(amount > bank) return message.channel.send(`You cannot withdraw more than you have ._.`)
  if(args[0].includes("-")) return message.channel.send(`You cannot withdraw negative amount`)
  
  if(args[0].toLowerCase() === "all") {
    
    if(!bank) return message.channel.send(`You don't have any money to withdraw.`)
    
    const embed = new discord.MessageEmbed()
    .setAuthor(`Successfully withdrew!`, message.author.avatarURL({dynamic: true}))
    .setDescription(`Successfully withdew all your money`)
    .setColor(this.options.color)
    .setFooter(this.client.user.username, this.client.user.avatarURL())
    
    message.channel.send(embed)
    
    this.db.delete(`bank_${message.author.id}`)
    this.db.add(`money_${message.author.id}`, bank)
  } else {
    
    if(!bank) return message.channel.send(`You don't have any money to withdraw.`)
    if(!amount) return message.channel.send(`Please provide a valid amount of money to withdraw.`)
    
    const embed = new discord.MessageEmbed()
    .setAuthor(`Successfully withdrew!`, message.author.avatarURL({dynamic: true}))
    .setDescription(`Successfully withdrew ${amount}${this.options.currency}`)
    .setColor(this.options.color)
    .setFooter(this.client.user.username, this.client.user.avatarURL())
    
    message.channel.send(embed)
    
    this.db.add(`money_${message.author.id}`, amount)
    this.db.subtract(`bank_${message.author.id}`, amount)
  }
}
})

}


}
module.exports = Economy;
