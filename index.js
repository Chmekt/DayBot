// JavaScript source code```
const Discord = require('discord.js');
const { prefix, token } = require('./config.json');
const bot = new Discord.Client();
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

bot.on('message', message => {
    const args = message.content.slice(prefix.length).trim().split(' ');
    const command = args.shift().toLowerCase();
  
    if (command == "ac") {
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
            bot.destroy();
          
        });



    }
                   
               
     
            
    
   else if (array.includes(command) == true && message.content.charAt(0) == `${prefix}`) {
        var num = array.indexOf(command);
        message.channel.send(effect[num]);
        }
       
   
});
bot.login(token);
