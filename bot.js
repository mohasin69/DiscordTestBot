//
// Mohasin Shaikh
//

//
// Constant variables
//
/*Variable area*/
var Discord = require('discord.io');


const API_TOKEN = process.env.API_TOKEN;;//"mlrst8bC4RziA1YiyhDYJplGe87KkzDKS8J2lHFY";
const BOT_TOKEN = process.env.BOT_TOKEN;//"NDQ5MzMyODc5MTIyNzU5Njkx.DejJYQ.ulATCbUrgmyoocE0Vbr7_dxz0SM";//
const DEBUG = process.env.DEBUG;//1;
const PORT = process.env.PORT;//65644;
const Hapi = require('hapi');
var tournamentID = "elitegunztournament";//"jstestbot1";;

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

//console.log(pilotList);
const prefix = "!"
/*Event area*/
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
	

	if (message.substring(0, 1) == prefix) {
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
				API.getParticipantList(channelID, tournamentID, true, function(reply){
					sendMessage(channelID, reply);
				}); break;
            
			case "matches":
				if( args.length > 0 )
				{
					tournamentID = args.shift().toLowerCase();
				}
				getMatches(channelID, tournamentID); break;
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




    
function getMatches(channelID, tournamentID, roundID = 1 )
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
		var tournamentList = new Array();
		if (1 == DEBUG)
			console.log("response.length" + response.length);

		var playersList = [];
		//participantList.splice(0,participantList.length);
		
		API.getParticipantList(channelID, tournamentID, false, function(playersList){
			

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
					if( element.match.state != "complete" )
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
				if( matchesList[roundID].length > 0 )
				{
					reply = reply+"\n\n"+ "Round "+roundID+" 	``` ";
				}
				else
					continue;
				var matchCounter = 1;
				matchesList[roundID].forEach(function(match,matchID)
				{
					if(1 == DEBUG )
					{
						console.log("Player 1 : " + match.player1_id + " Player 2 : " + match.player2_id);
						console.log(playersList["'"+match.player1_id+"'"] + "  vs " + playersList["'"+match.player2_id+"'"] );
					}
					if( match.player1_id != undefined || match.player2_id != undefined)
					{
						reply = reply + "\n" + (matchCounter++) + ".\tMatch between  \t: \t";
						if( !(('"'+match.player1_id+'"') in playersList) )
						{
							reply = reply + "NA";
						}
						else
							reply = reply + playersList['"'+match.player1_id+'"'].display_name;
							reply = reply + "\tV/S\t";
						if( !(('"'+match.player2_id+'"') in playersList) )
						{
							reply = reply + " <--->";
						}
						else
							reply = reply + playersList['"'+match.player2_id+'"'].display_name;

						reply = reply + " \n  \tScheduled time \t: \t"+ (match.scheduled_time == null ? "NA" : match.scheduled_time) + "";
						reply = reply + " \n  \tState \t\t\t: \t"+ match.state +"";
					}
				});
				if( matchesList[roundID].length > 0 )
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
