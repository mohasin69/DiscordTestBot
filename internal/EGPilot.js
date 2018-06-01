const API_TOKEN = process.env.API_TOKEN;;//"mlrst8bC4RziA1YiyhDYJplGe87KkzDKS8J2lHFY";
const BOT_TOKEN = process.env.BOT_TOKEN;//"NDQ5MzMyODc5MTIyNzU5Njkx.DejJYQ.ulATCbUrgmyoocE0Vbr7_dxz0SM";//
const DEBUG = process.env.DEBUG;//1;

var participantList = [];
var tournamentList = [];
module.exports =
{
    getTournamentList : function (channelID, callback) {

        const request = require('request');
        var CHALLONGE_URL = 'https://api.challonge.com/v1/tournaments.json?api_key=' + API_TOKEN + '&state=all';
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

            callback(reply);

        });
    },

    getParticipantList : function (channelID, tournamentID, sendList = true, callback) {

        const request = require('request');

        var CHALLONGE_URL = 'https://api.challonge.com/v1/tournaments/' + tournamentID + '/participants.json?api_key=' + API_TOKEN;

        if (1 == DEBUG) {
            console.log(CHALLONGE_URL);
            console.log("Parameters tournamentID - " + tournamentID);
        }
        request(CHALLONGE_URL, { json: true }, (err, res, response) => {
            if (err) {
                return console.log(err);
            }
            
            var reply = "**Participant List in " + tournamentID.toUpperCase() + "** 	```";
            if (0 < response.length && typeof response[0].participant != undefined) {
                response.forEach(function (element, index) {
                    reply = reply + "\n" + (index + 1) + ". " + element.participant.display_name;
                    participantList['"'+element.participant.id+'"'] = {};
                    participantList['"'+element.participant.id+'"'] = element.participant;
                    
                    if (1 == DEBUG) {
                        console.log("\n "+ participantList['"'+element.participant.id+'"'].display_name);
                    }
                });
                
            }
            else {
                reply = reply + "\n" + "No Participants found...";
            }
            reply = reply + "```";
            if( true == sendList )
            {
                callback(reply);
            }
            else
                callback(participantList);
        });


    }




}