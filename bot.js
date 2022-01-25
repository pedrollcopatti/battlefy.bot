
const Discord = require("discord.js"); //baixar a lib
const client = new Discord.Client({ intents: ["GUILDS", "GUILD_MESSAGES", "GUILD_MESSAGE_REACTIONS", "GUILD_EMOJIS_AND_STICKERS"] })
const config = require("./config.json"); 
const { MessageButton, MessageActionRow } = require('discord.js')
const getGameTournaments = require("./getGameTournaments");

const channelId = '780919291024769084';
var teams = [];

client.on("ready", () => {
  console.log('Bot foi iniciado'); 
});

client.on('messageCreate', (message) => {
  if(message.content.startsWith(`${config.prefix}torneios`)){


    getGameTournaments('league-of-legends').then(response => {
      const tournaments = response;

      const emojis = {
        top: client.emojis.cache.find(emoji => emoji.name === 'top'),
        jg:  client.emojis.cache.find(emoji => emoji.name === 'jg'),
        mid: client.emojis.cache.find(emoji => emoji.name === 'mid'),
        adc: client.emojis.cache.find(emoji => emoji.name === 'adc'),
        sup: client.emojis.cache.find(emoji => emoji.name === 'sup'),
      }

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
            ).then(sent => { 
              let id = sent.id;

              teams.push({torneio: id, top: '', jg: '', mid: '', adc: '', sup: ''})
              
              sent.react(emojis.top)
              sent.react(emojis.jg)
              sent.react(emojis.mid)
              sent.react(emojis.adc)
              sent.react(emojis.sup)
            
            })
        }
      })
    });
  }
})

const handleReaction = (reaction, user, add) => {
  const emoji = reaction.emoji.name

  if(user.id === '844055016792260638'){
    return
  }

  for (let i = 0; i < teams.length; i++) {

    if(teams[i].torneio === reaction.message.id){
        if(emoji === 'top'){
          teams[i].top = '<@'+user+'>';
        } else if(emoji === 'jg'){
          teams[i].jg = '<@'+user+'>';
        } else if(emoji === 'mid'){
          teams[i].mid = '<@'+user+'>';
        } else if(emoji === 'adc'){
          teams[i].adc = '<@'+user+'>';
        } else if(emoji === 'sup'){
          teams[i].sup = '<@'+user+'>';
        }

        if(teams[i].top != '' && teams[i].jg != '' && teams[i].mid != '' && teams[i].adc != '' && teams[i].sup != ''){
          reaction.message.reply(
            '.' + '\n' +
            '✅ <Time fechado e pronto para a batalha> 🏆' + '\n'
            + 'Toplaner: ' + teams[i].top + '\n' 
            + 'Jungle: ' + teams[i].jg + '\n' 
            + 'Midlaner: ' + teams[i].mid + '\n' 
            + 'Adcarry: ' + teams[i].adc + '\n' 
            + 'Support: ' + teams[i].sup + '\n'
          );
        }else {
          reaction.message.reply( '.' + '\n' +
            'Escalação para o torneio ' + teams[i].torneio + ':' + '\n'
            + 'Toplaner: ' + teams[i].top + '\n' 
            + 'Jungle: ' + teams[i].jg + '\n' 
            + 'Midlaner: ' + teams[i].mid + '\n' 
            + 'Adcarry: ' + teams[i].adc + '\n' 
            + 'Support: ' + teams[i].sup + '\n' 
          )
        }
    }
  }
}

client.on('messageReactionAdd', async (reaction, user) => {
    if(reaction.message.channel.id === channelId){
      handleReaction(reaction, user, true);
    }

})

client.login(config.token);