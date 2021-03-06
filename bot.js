//
// Mohasin Shaikh
//

//
// Constant variables
//
const prefix = "!!"
const API_TOKEN = process.env.API_TOKEN;;
const BOT_TOKEN = process.env.BOT_TOKEN;
const DEBUG = process.env.DEBUG;
const PORT = process.env.PORT;
const Hapi = require('hapi');
let autoInterval = process.env.AUTO_INTERVAL;// 600000; //miliseconds 30000 = 10 minutes
var previousMessage = {
	msgId : "",
	channelID : "",
	guildID : "",
	tournamentID : "",
	timestamp : ""
 };
 var interval;


//
// Variable area
//
var Discord = require('discord.io');

var tournamentID = "elitegunztournament";


const server = new Hapi.Server({ port: PORT || 3000 });

var participantList = [];

const API = require("./internal/EGPilot.js");

server.start((err) => {

    if (err) {
        throw err;
    }
    console.log(`Server running at: ${server.info.uri}`);
});

var bot = new Discord.Client({
	token: BOT_TOKEN,
	autorun: true
});


//
// EVENTS
//
bot.on("ready", function (event) {
	console.log("Connected!");
	console.log("Logged in as: ");
	console.log(bot.username + " - (" + bot.id + ")");
});
bot.on("message", function (user, userID, channelID, message, event) {

	if (1 == DEBUG) {
		console.log(user + " - " + userID);
		console.log("in " + channelID);
	}

	if (message.substring(0, 2) == prefix) {
		if (1 == DEBUG) {
			console.log(message);
			console.log("----------");
		}
		const args = message.slice(prefix.length).trim().split(/ +/g);
		const command = args.shift().toLowerCase();

		switch (command) {
			case "ping":
				sendMessages(channelID, ["Pong"]); break;
			case "tournament":
				API.getTournamentList(channelID, function(reply){
					sendMessage(channelID, reply);
				}); break;
			case "participant":
				if( args.length > 0 )
					tournamentID = args.shift().toLowerCase();
				API.getParticipantList(channelID, tournamentID, true, false, function(reply){
					sendMessage(channelID, reply);
				}); break;
			case "open":
				if( args.length > 0 )
				{
					tournamentID = args.shift().toLowerCase();
				}
				getMatches(channelID, tournamentID, "open"); break;
			case "matches":
				if( args.length > 0 )
				{
					tournamentID = args.shift().toLowerCase();
				}
				getMatches(channelID, tournamentID); break;
			case "pending":
				if( args.length > 0 )
				{
					tournamentID = args.shift().toLowerCase();
				}
				getMatches(channelID, tournamentID, "pending"); break;

			case "auto_start":
				if( args.length > 0 )
					tournamentID = args.shift().toLowerCase();
				
				sendMessage(channelID, "Auto messaging started...");
				previousMessage.channelID = channelID;
				previousMessage.tournamentID = tournamentID;
				

				interval = setInterval (function (){
					
					bot.getMessages( { channelID: previousMessage.channelID,limit : 50}, (error, messageArray) => {
							
						for( var i = 0; i < messageArray.length; i++ )
						{
							if( messageArray[i].content != undefined && messageArray[i].content.indexOf("### AutoBot ### ") != -1 )
							{
								previousMessage.msgId = messageArray[i].id;
								bot.deleteMessage({channelID:previousMessage.channelID, messageID : messageArray[i].id}, (error, response )=>{
									
								});
							}
							else
								previousMessage.msgId = "";
						}



						API.getParticipantList(previousMessage.channelID, previousMessage.tournamentID, true, true, function(reply){

							reply = "### AutoBot ### \n";
							reply = reply + "**Participant List in " + tournamentID.toUpperCase() + "** ```"; 
							sendMessage(channelID, reply);
	
							// bot.getMessages( { channelID: previousMessage.channelID,limit : 5}, (error, messageArray) => {
	
							// 	console.log("messageArray \n ******************************\n " + messageArray);
							// 	for( var i = 0; i < messageArray.length; i++ )
							// 	{
							// 		if( messageArray[i].content != undefined && messageArray[i].content.indexOf("### AutoBot ### ") != -1 )
							// 		{
							// 			previousMessage.msgId = messageArray[i].id;
							// 			previousMessage.timestamp = messageArray[i].timestamp;
							// 			break;
							// 		}
							// 		else
							// 			previousMessage.msgId = "";
							// 	}
								
								
							// })
	
	
						});
						
					})
					
					}, autoInterval); // time between each interval in milliseconds
				
				break;

			case "auto_stop":
				clearInterval(interval);
				sendMessage(channelID, "Auto messaging stopped..");
				break;
			case "admin_disconnect":
				bot.disconnect();
				break;
			default:
				sendMessages(channelID, ["I am still learning pilot!!!"]); break;
		}
	}
});

bot.on("presence", function (user, userID, status, game, event) {
	/*console.log(user + " is now: " + status);*/
});

bot.on("any", function (event) {
	/*console.log(rawEvent)*/ //Logs every event
});

bot.on("disconnect", function (erMsg, code) {
	console.log('----- Bot disconnected from Discord with code', code, 'for reason:', erMsg, '-----');
	bot.connect(); //Auto reconnect
});

/*Function declaration area*/
function sendMessage(ID, messageArr, interval) {

	var resArr = [], len = messageArr.length;
	if (1 == DEBUG) {
		console.log("messageArr.length;" + messageArr.length);
	}
	var callback = typeof (arguments[2]) === 'function' ? arguments[2] : arguments[3];
	if (typeof (interval) !== 'number') interval = 500;


	if (1 < messageArr.length) {
		bot.sendMessage({
			to: ID,
			message: messageArr
		}, function (err, res) {
			resArr.push(err || res);
			if (resArr.length === len) if (typeof (callback) === 'function') callback(resArr);
		});
	}

}

/*Function declaration area*/
function sendMessages(ID, messageArr, interval) {
	var resArr = [], len = messageArr.length;
	console.log("messageArr.length;" + messageArr.length);
	var callback = typeof (arguments[2]) === 'function' ? arguments[2] : arguments[3];
	if (typeof (interval) !== 'number') interval = 500;

	function _sendMessages() {
		setTimeout(function () {
			if (messageArr[0]) {
				bot.sendMessage({
					to: ID,
					message: messageArr.shift()
				}, function (err, res) {
					resArr.push(err || res);
					if (resArr.length === len) if (typeof (callback) === 'function') callback(resArr);
				});
				_sendMessages();
			}
		}, interval);
	}
	_sendMessages();
}



function sendFiles(channelID, fileArr, interval) {
	var resArr = [], len = fileArr.length;
	var callback = typeof (arguments[2]) === 'function' ? arguments[2] : arguments[3];
	if (typeof (interval) !== 'number') interval = 500;

	function _sendFiles() {
		setTimeout(function () {
			if (fileArr[0]) {
				bot.uploadFile({
					to: channelID,
					file: fileArr.shift()
				}, function (err, res) {
					resArr.push(err || res);
					if (resArr.length === len) if (typeof (callback) === 'function') callback(resArr);
				});
				_sendFiles();
			}
		}, interval);
	}
	_sendFiles();
}



function getMatches(channelID, tournamentID, matchType = "" )
{
	
	  


	request(CHALLONGE_URL, { json: true }, (err, res, response) => {
		if (err) {
			return console.log(err);
		}
		var roundID = 1;
		var tournamentList = new Array();
		if (1 == DEBUG)
			console.log("response.length" + response.length);

		var playersList = [];
		//participantList.splice(0,participantList.length);
		
		API.getParticipantList(channelID, tournamentID, false, false,  function(playersList){
			
			sendMessage(channelID, reply);
		});
		
	});
}


    
function getMatches(channelID, tournamentID, matchType = "" )
{
	const request = require('request');
	var CHALLONGE_URL = 'https://api.challonge.com/v1/tournaments/' + tournamentID + '/matches.json?api_key=' + API_TOKEN;
	if (1 == DEBUG)
	{
		console.log(CHALLONGE_URL);
	}
	request(CHALLONGE_URL, { json: true }, (err, res, response) => {
		if (err) {
			return console.log(err);
		}
		var roundID = 1;
		var tournamentList = new Array();
		if (1 == DEBUG)
			console.log("response.length" + response.length);

		var playersList = [];
		//participantList.splice(0,participantList.length);
		
		API.getParticipantList(channelID, tournamentID, false, false, function(playersList){
			

			// console.log("PLAYERS LIST");
			// for( id in playersList)
			// {
			// 	console.log("\n key -" + id +" value - "+ playersList[id].display_name);
			// };

			var matchesList = { "0": []};

			//var testist = require("./test.json");

			var reply = "**Bracktes** ";

			if (0 < response.length && typeof response[0].match != undefined) {
				response.forEach(function (element, index) {
					if( !('"'+ element.match.round +'"' in matchesList) )
						matchesList['"'+ element.match.round +'"'] = new Array();
					if( matchType.length > 0 && element.match.state == matchType )
						matchesList['"'+ element.match.round +'"'].push(element.match);
					else if( matchType.length == 0 && element.match.state != "complete" )
						matchesList['"'+ element.match.round +'"'].push(element.match);
				});
			}
			else {
				reply = reply + "\n" + "No matches scheduled. Tournament might have not started yet...";
				sendMessage(channelID, reply);
				return;
			}

			if (1 == DEBUG)
			{
				for( roundID in matchesList )
				{
					if( matchesList[roundID].length > 0 )
					{
						console.log("ROUND ID : "+ roundID);
						matchesList[roundID].forEach(function(value, key){
							console.log("KEY :: " + key + "\n PALYER ID " + value.player1_id + " and " + value.player2_id);
							//console.log( playersList['"'+value.player1_id+'"'].display_name + " VS " + playersList['"'+value.player2_id+'"'].display_name);
						});
					}
				}
			}
			for( roundID in matchesList )
			{
				
				var matchCounter = 1;
				var printHeaderFlag = true;
				matchesList[roundID].forEach(function(match,matchID)
				{
					if(1 == DEBUG )
					{
						console.log("Player 1 : " + match.player1_id + " Player 2 : " + match.player2_id);
						console.log(playersList["'"+match.player1_id+"'"] + "  vs " + playersList["'"+match.player2_id+"'"] );
					}
					if( match.player1_id != undefined || match.player2_id != undefined)
					{

						if( true == printHeaderFlag && matchesList[roundID].length > 0  )
						{
							reply = reply+"\n\n";
							if( (matchesList[roundID])[0].round < 0 )
								reply = reply+ "Level6 Round "+(matchesList[roundID])[0].round+" 	``` ";
							else
								reply = reply+ "Round "+(matchesList[roundID])[0].round+" 	``` ";
							printHeaderFlag = false;
						}
						if( false == printHeaderFlag )
						{
							reply = reply + "\n" + (matchCounter++) + ".\tMatch between  \t: \t";
							if( !(('"'+match.player1_id+'"') in playersList) )
							{
								reply = reply + "<--->";
							}
							else
								reply = reply +  playersList['"'+match.player1_id+'"'].display_name;
								reply = reply + "\tV/S\t";
							if( !(('"'+match.player2_id+'"') in playersList) )
							{
								reply = reply + " <--->";
							}
							else
								reply = reply + playersList['"'+match.player2_id+'"'].display_name;

							reply = reply + " \n  \tScheduled time \t: \t"+ (match.scheduled_time == null ? "NA" : match.scheduled_time) + "";
							reply = reply + " \n  \tState \t\t\t : \t"+ match.state +"\n";
						}
						else
							return;

						
					}
				});
				if( false == printHeaderFlag && matchesList[roundID].length > 0 )
					reply = reply + "```";
				matchCounter = 1;
			}
			

			//
			// Send the messages
			//
			sendMessage(channelID, reply);
		});
		
	});
}
