const API_TOKEN = process.env.API_TOKEN;;
const BOT_TOKEN = process.env.BOT_TOKEN;
const DEBUG = process.env.DEBUG;
const PORT = process.env.PORT;
const Hapi = require('hapi');
var tournamentID = "elitegunztournament";


var participantList = [];
var checkedInParticipantList = [];
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

    getParticipantList : function (channelID, tournamentID, sendList = true, autoList = false, callback) {

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
            
            var reply = "";
            

            if( false == autoList)
                reply = reply + "**Participant List in " + tournamentID.toUpperCase() + "** ```";
                
            if (0 < response.length && typeof response[0].participant != undefined) {
                response.forEach(function (element, index) {
                    
                    if( checkedInList == false )
                    {
                        reply = reply + "\n" + (index + 1) + ". " + element.participant.display_name;
                        participantList['"'+element.participant.id+'"'] = {};
                        participantList['"'+element.participant.id+'"'] = element.participant;
                    }
                    else if( element.participant.checked_in_at !== null && element.participant.checked_in_at.length >4 )
                    {
                       
                        reply = reply + "\n" + (index + 1) + ". " + element.participant.display_name;
                        participantList['"'+element.participant.id+'"'] = {}; 
                        participantList['"'+element.participant.id+'"'] = element.participant;

                        console.log("\n "+ participantList['"'+element.participant.id+'"'].display_name);
                        console.log("\n "+ participantList['"'+element.participant.id+'"'].checked_in_at);
                    }

                    if (1 == DEBUG && undefined != participantList['"'+element.participant.id+'"'] ) {
                        console.log("\n "+ participantList['"'+element.participant.id+'"'].display_name);
                    }
                });
                
            }
            else {
                reply = reply + "\n" + "No Participants found...";
            }
            if( false == autoList)
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