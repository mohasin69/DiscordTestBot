//
// Mohasin Shaikh
//

//
// Constant variables
//

const API_TOKEN = "mlrst8bC4RziA1YiyhDYJplGe87KkzDKS8J2lHFY"; //process.env.API_TOKEN
const BOT_TOKEN = "NDQ5MzMyODc5MTIyNzU5Njkx.DejJYQ.ulATCbUrgmyoocE0Vbr7_dxz0SM"; //process.env.BOT_TOKEN
const DEBUG = 1; // process.env.DEBUG


/*Variable area*/
var Discord = require('discord.io');

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
bot.connect();
bot.on("message", function (user, userID, channelID, message, event) {

	if (DEBUG) {
		console.log(user + " - " + userID);
		console.log("in " + channelID);
	}
	console.log(message);
	console.log("----------");

	if (message.substring(0, 1) == prefix) {

		const args = message.slice(prefix.length).trim().split(/ +/g);
		const command = args.shift().toLowerCase();

		switch (command) {
			case "ping":
				sendMessages(channelID, ["Pong"]); break;
			case "tournament":
				getTournamentList(channelID); break;
			case "participant":
				//var tournamentID = args.shift().toLowerCase();
				getParticipantList(channelID); break;
			case "admin_disconnect":
				bot.disconnect();
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
	console.log("messageArr.length;" + messageArr.length);
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

function getTournamentList(channelID) {

	const request = require('request');
	var CHALLONGE_URL = 'https://api.challonge.com/v1/tournaments.json?api_key=' + API_TOKEN + '&state=all';
	if (DEBUG)
	{
		console.log(CHALLONGE_URL);
	}
	request(CHALLONGE_URL, { json: true }, (err, res, response) => {
		if (err) {
			return console.log(err);
		}
		var tournamentList = new Array();
		if (DEBUG)
			console.log("response.length" + response.length);


		tournamentList.push("```");


		var reply = "**TournamentList** 	```";
		if (0 < response.length && typeof response[0].tournament != undefined) {
			response.forEach(function (element, index) {
				reply = reply + "\n" + (index + 1) + ". " + element.tournament.url;
			});
		}
		else {
			reply = reply + "\n" + "No tournaments found...";
		}
		reply = reply + "```";

		//
		// Send the messages
		//
		sendMessage(channelID, reply);

	});
}

function getParticipantList(channelID, tournamentID = "elitegunztournament") {

	const request = require('request');

	var CHALLONGE_URL = 'https://api.challonge.com/v1/tournaments/' + tournamentID + '/participants.json?api_key=' + API_TOKEN;

	if (DEBUG) {
		console.log(CHALLONGE_URL);
		console.log("Parameters tournamentID - " + tournamentID);
	}
	request(CHALLONGE_URL, { json: true }, (err, res, response) => {
		if (err) {
			return console.log(err);
		}
		var participantList = new Array();
		
		var reply = "**Participant List in " + tournamentID.toUpperCase() + "** 	```";
		if (0 < response.length && typeof response[0].participant != undefined) {
			response.forEach(function (element, index) {
				reply = reply + "\n" + (index + 1) + ". " + element.participant.display_name;
			});
		}
		else {
			reply = reply + "\n" + "No Participants found...";
		}
		reply = reply + "```";
		sendMessage(channelID, reply);
	});


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