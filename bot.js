// var Discord = require('discord.io');

// var bot = new Discord.Client({
//     token: "NDQ5MTE0NjUxMjY3OTU2NzM2.DegNAA.qdaY7zTxJDT4n4JWBw03d_nueh4",
//     autorun: true
// });

// bot.on('ready', function() {
//     console.log('Logged in as %s - %s\n', bot.username, bot.id);
// });

// bot.on('message', function(user, userID, channelID, message, event) {
//     if (message === "ping") {
//         bot.sendMessage({
//             to: channelID,
//             message: "pong"
//         });
//     }
// });




// const Discord = require('discord.io');

// var options = {
//     host: 'https://api.challonge.com/v1/tournaments.json?api_key=mlrst8bC4RziA1YiyhDYJplGe87KkzDKS8J2lHFY&state=all'
// };

// const request = require('request');
 
// function loadtest(message)
// {
//     request('https://api.challonge.com/v1/tournaments.json?api_key=mlrst8bC4RziA1YiyhDYJplGe87KkzDKS8J2lHFY&state=all', { json: true }, (err, res, response) => {
//     if (err) { return console.log(err); }
    
//         response.forEach(element => {
//             message.reply(element.tournament.url);
//         });
    
//     });
// }

var tokenString = "NDQ5MTE0NjUxMjY3OTU2NzM2.DegNAA.qdaY7zTxJDT4n4JWBw03d_nueh4";

// //const bot = new Discord.Client();
// var bot = new Discord.Client({
//     token: tokenString,
//     autorun: true
// });


// bot.on('message', (message) => {
//     console.log(message.content);
//    if (message.content.substring(0, 1) == '!') {
//         var args = message.content.substring(1).split(' ');
//         var cmd = args[0];
       
//         args = args.splice(1);
//         switch(cmd) {
//             // !ping
//             case 'ping':
//             loadtest(message);
//                 message.reply('<html><h1>TEST</h1></html>');
//             break;
//             // Just add any case commands if you want to..
//          }
//      }
    
// });


// console.log("Connecting...");
//bot.login(token);








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




/*Variable area*/
var Discord = require('discord.io');
var bot = new Discord.Client({
	token: process.env.BOT_TOKEN,
	autorun: true
});

/*Event area*/
bot.on("ready", function(event) {
	console.log("Connected!");
	console.log("Logged in as: ");
	console.log(bot.username + " - (" + bot.id + ")");
});

bot.on("message", function(user, userID, channelID, message, event) {
	console.log(user + " - " + userID);
	console.log("in " + channelID);
	console.log(message);
	console.log("----------");

    if (message.substring(0, 1) == '!') {

        var args = message.substring(1).split(' ');
            var cmd = args[0];
           

        switch(cmd)
        {
            case "ping" : 
                            sendMessages(channelID, ["Pong"]); break;
            case "tournament" :
                            getTournamentList(channelID); break;
            case "participant" : 
                            getParticipantList(channelID); break;
            default:
                            sendMessages(channelID,["I am still learning pilot!!!"]); break;
        }
    }
});

bot.on("presence", function(user, userID, status, game, event) {
	/*console.log(user + " is now: " + status);*/
});

bot.on("any", function(event) {
	/*console.log(rawEvent)*/ //Logs every event
});

bot.on("disconnect", function(erMsg, code) {
    console.log('----- Bot disconnected from Discord with code', code, 'for reason:', erMsg, '-----');
	//bot.connect(); //Auto reconnect
});

/*Function declaration area*/
function sendMessages(ID, messageArr, interval) {
	var resArr = [], len = messageArr.length;
	var callback = typeof(arguments[2]) === 'function' ?  arguments[2] :  arguments[3];
	if (typeof(interval) !== 'number') interval = 1000;

	function _sendMessages() {
		setTimeout(function() {
			if (messageArr[0]) {
				bot.sendMessage({
					to: ID,
					message: messageArr.shift()
				}, function(err, res) {
					resArr.push(err || res);
					if (resArr.length === len) if (typeof(callback) === 'function') callback(resArr);
				});
				_sendMessages();
			}
		}, interval);
	}
	_sendMessages();
}

function getTournamentList(channelID)
{

    const request = require('request');
    
        request('https://api.challonge.com/v1/tournaments.json?api_key='+process.env.API_TOKEN+'&state=all', { json: true }, (err, res, response) => {
        if (err) { return console.log(err); }
        
            response.forEach(element => {
                sendMessages(channelID, [element.tournament.url]);
            });
        
        });


}


function getParticipantList(channelID, tournamentID ="EliteGunz1")
{

    const request = require('request');
    
        request('https://api.challonge.com/v1/tournaments/'+tournamentID +'/participants.json?api_key=' +  process.env.API_TOKEN, (err, res, response) => {
        if (err) { return console.log(err); }
            console.log(response);
        if(response.count)
        {
            response.forEach(element => {
                sendMessages(channelID, [element.participant.name]);
            });
        }   
        else     sendMessages(channelID, ["No participants"]);
        });
}

function sendFiles(channelID, fileArr, interval) {
	var resArr = [], len = fileArr.length;
	var callback = typeof(arguments[2]) === 'function' ? arguments[2] : arguments[3];
	if (typeof(interval) !== 'number') interval = 1000;

	function _sendFiles() {
		setTimeout(function() {
			if (fileArr[0]) {
				bot.uploadFile({
					to: channelID,
					file: fileArr.shift()
				}, function(err, res) {
					resArr.push(err || res);
					if (resArr.length === len) if (typeof(callback) === 'function') callback(resArr);
				});
				_sendFiles();
			}
		}, interval);
	}
	_sendFiles();
}