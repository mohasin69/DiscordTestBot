var Discord = require('discord.io');

var bot = new Discord.Client({
    token: "NDQ5MTE0NjUxMjY3OTU2NzM2.DegNAA.qdaY7zTxJDT4n4JWBw03d_nueh4",
    autorun: true
});

bot.on('ready', function() {
    console.log('Logged in as %s - %s\n', bot.username, bot.id);
});

bot.on('message', function(user, userID, channelID, message, event) {
    if (message === "ping") {
        bot.sendMessage({
            to: channelID,
            message: "pong"
        });
    }
});








// const Discord = require('discord.js');

// const bot = new Discord.Client();

// bot.on('message', (message) => {
//     console.log(message.content);
//    if (message.content.substring(0, 1) == '!') {
//         var args = message.content.substring(1).split(' ');
//         var cmd = args[0];
       
//         args = args.splice(1);
//         switch(cmd) {
//             // !ping
//             case 'ping':
//                 message.channel.reply('pong');
//             break;
//             // Just add any case commands if you want to..
//          }
//      }
    
// });

// var token = process.env.BOT_TOKEN;

// bot.login(token);








// var logger = require('winston');
// const Discord = require('discord.io'); 


// var bot = new Discord.Client({
//     token: process.env.BOT_TOKEN,
//     autorun: true
//   });



// // Configure logger settings
// logger.remove(logger.transports.Console);
// logger.add(logger.transports.Console, {
//    colorize: true
// });
// logger.level = 'debug';
// // Initialize Discord Bot

// bot.on('ready', function (evt) {
//    logger.info('Connected');
//    logger.info('Logged in as: ');
//    logger.info(bot.username + ' - (' + bot.id + ')');
// });

// bot.on('message', function (user, userID, channelID, message, evt) {
//    // Our bot needs to know if it will execute a command
//    // It will listen for messages that will start with `!`
//    if (message.content.substring(0, 1) == '!') {
//             var args = message.content.substring(1).split(' ');
//             var cmd = args[0];
           
//             args = args.splice(1);
//             switch(cmd) {
//                 // !ping
//                 case 'ping':
//                     message.channel.reply('pong');
//                 break;
//                 // Just add any case commands if you want to..
//              }
//          }
// });

// bot.login;