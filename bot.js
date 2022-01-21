
const Discord = require("discord.js"); //baixar a lib
const client = new Discord.Client({ intents: ["GUILDS", "GUILD_MESSAGES", "GUILD_MESSAGE_REACTIONS"] })
const config = require("./config.json"); 
const { MessageButton, MessageActionRow } = require('discord.js')
const getGameTournaments = require("./getGameTournaments");


client.on("ready", () => {
  console.log('Bot foi iniciado'); 
});

client.on('messageCreate', (message) => {
  if(message.content.startsWith(`${config.prefix}torneios`)){

    const emojis = {
      top: client.emojis.cache.find(emoji => emoji.name === 'top'),
      jg: client.emojis.cache.find(emoji => emoji.name === 'jg'),
      mid: client.emojis.cache.find(emoji => emoji.name === 'mid'),
      adc: client.emojis.cache.find(emoji => emoji.name === 'adc'),
      sup: client.emojis.cache.find(emoji => emoji.name === 'sup'),
    }


    getGameTournaments('league-of-legends').then(response => {
      const tournaments = response;

      tournaments.map(tournament =>{
        if(tournament.type === 'team' && tournament.region === 'Brazil'){
        message.channel.send(
            '.' +'\n'+
            'Nome do Torneio: ' + tournament.name
            + '\n'+
            'Dia: ' + tournament.startTime.slice(0, 10)
            + '\n' +
            'Horário: ' + tournament.startTime.slice(11, 19)
            + '\n' +
            'Link do Torneio: ' + `https://battlefy.com/${tournament.organization.slug}/${tournament.slug}/${tournament._id}/info?`
            + '\n' +
            'Bora Jogar? Reaja com a sua lane e monte sua equipe!'
            ).then(sentEmbed => {
              sentEmbed.react(emojis.top)
              sentEmbed.react(emojis.jg)
              sentEmbed.react(emojis.mid)
              sentEmbed.react(emojis.adc)
              sentEmbed.react(emojis.sup)
          })

        }
      })

    });
  }

  if(message.content.startsWith(`${config.prefix}somenzi`)){

    message.channel.send('linde');

}

})

client.login(config.token);