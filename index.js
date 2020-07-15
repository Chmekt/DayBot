// JavaScript source code```
const Discord = require('discord.js');
const { prefix, token } = require('./config.json');
const bot = new Discord.Client();
const ytdl = require('ytdl-core');
const queue = new Map();
const sd = require('string_decoder').StringDecoder;
const utf8 = new sd('utf8');
var fs = require('fs');
var results = JSON.parse(fs.readFileSync('./commands.json', 'utf8'));
var array = [];
var effect = [];
for (var i in results) {

    array.push(results[i]['Command']);
    effect.push(results[i]['Effect']);
  
}
console.log(array[0]+effect[0]+0);
bot.on('ready', () => { console.log('this bot is online'); });

bot.on("message", async message =>  {
    const args = message.content.slice(prefix.length).trim().split(' ');
    const command = args.shift().toLowerCase();
  
    if (command === "ac" && message.content.length > 4 && message.content.indexOf('\*')) {
        var data = JSON.parse(fs.readFileSync('./commands.json', 'utf8'));
        var arraycommand = [];
        var effectcommand = [];
        for (var i in results) {

            arraycommand.push(data[i]['Command']);
            effectcommand.push(data[i]['Effect']);

        }
      let newValue = "["+"\n";
        var length = arraycommand.length;
        for (d = 0; d <= length; d++) {
            newValue += '{' + "\n";;
            newValue += '"Command": '
            newValue += '"' + arraycommand[d]+ '",' + "\n";;
            newValue += '"Effect":  ';
            newValue += '"' + effectcommand[d] + '"' + "\n";;
            if (d < length) {
                newValue += "}," + "\n";
            }
            else {
                newValue += "}" + "\n";
            }
            
        }
       
                newValue += ',' + '{' + '\n' + '"Command":"' + args[0] + '",' + '\n' + '\"Effect\": "' + args[1] + '"\n' + '}' + '\n' + ']';
        fs.readdir('./', function (err, files) {
            if (err) return console.log(err);
            fs.writeFileSync('commands.json', newValue, function (err) {
                if (err) return console.log(err);

            });
            var arrayfix = [];
           resultat =  JSON.parse(fs.readFileSync('./commands.json', 'utf8'));
            for (var i in resultat) {

                arrayfix.push(resultat[i]);
               

            }
            for (b = 0; b < arrayfix.length; b++) {
                if (arrayfix[b]['Command'] === "undefined") {
                    arrayfix.splice(b, 1);
                }
            }
            arrayfix = JSON.stringify(arrayfix);
            fs.readdir('./', function (err, files) {
                if (err) return console.log(err);
                fs.writeFileSync('commands.json', arrayfix, function (err) {
                    if (err) return console.log(err);

                });
            });
            

          
        });



    } //End of add command



if (array.includes(command) == true && message.content.charAt(0) == `${prefix}`) {
        var num = array.indexOf(command);
        message.channel.send(effect[num]);
        }
       
if (message.author.bot) return;
  if (!message.content.startsWith(prefix)) return;

  const serverQueue = queue.get(message.guild.id);

  if (message.content.startsWith(`${prefix}play`)) {
    execute(message, serverQueue);
    return;
  } else if (message.content.startsWith(`${prefix}skip`)) {
    skip(message, serverQueue);
    return;
  } else if (message.content.startsWith(`${prefix}stop`)) {
    stop(message, serverQueue);
    return;
  } else {
    message.channel.send("You need to enter a valid command!");
  }
});


async function execute(message, serverQueue) {
  const arga = message.content.split(" ");

  const voiceChannel = message.member.voice.channel;
  if (!voiceChannel)
    return message.channel.send(
      "You need to be in a voice channel to play music!"
    );
  const permissions = voiceChannel.permissionsFor(message.client.user);
  if (!permissions.has("CONNECT") || !permissions.has("SPEAK")) {
    return message.channel.send(
      "I need the permissions to join and speak in your voice channel!"
    );
  }

  const songInfo = await ytdl.getInfo(arga[1]);
  const song = {
    title: songInfo.title,
    url: songInfo.video_url
  };

  if (!serverQueue) {
    const queueContruct = {
      textChannel: message.channel,
      voiceChannel: voiceChannel,
      connection: null,
      songs: [],
      volume: 5,
      playing: true
    };

    queue.set(message.guild.id, queueContruct);

    queueContruct.songs.push(song);

    try {
      var connection = await voiceChannel.join();
      queueContruct.connection = connection;
      play(message.guild, queueContruct.songs[0]);
    } catch (err) {
      console.log(err);
      queue.delete(message.guild.id);
      return message.channel.send(err);
    }
  } else {
    serverQueue.songs.push(song);
    return message.channel.send(`${song.title} has been added to the queue!`);
  }
}

function skip(message, serverQueue) {
  if (!message.member.voice.channel)
    return message.channel.send(
      "You have to be in a voice channel to stop the music!"
    );
  if (!serverQueue)
    return message.channel.send("There is no song that I could skip!");
  serverQueue.connection.dispatcher.end();
}

function stop(message, serverQueue) {
  if (!message.member.voice.channel)
    return message.channel.send(
      "You have to be in a voice channel to stop the music!"
    );
  serverQueue.songs = [];
  serverQueue.connection.dispatcher.end();
}

function play(guild, song) {
  const serverQueue = queue.get(guild.id);
  if (!song) {
    serverQueue.voiceChannel.leave();
    queue.delete(guild.id);
    return;
  }

  const dispatcher = serverQueue.connection
    .play(ytdl(song.url))
    .on("finish", () => {
      serverQueue.songs.shift();
      play(guild, serverQueue.songs[0]);
    })
    .on("error", error => console.error(error));
  dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
  serverQueue.textChannel.send(`Start playing: **${song.title}**`);
}
bot.login(token);
