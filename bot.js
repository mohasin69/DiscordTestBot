
const Discord = require("Discord.js");
const client = New Discord.Client();
client.on('ready', () => {
    console.log("I am ready!");
});

client.on('message', () => {
    if(message.content === 'ping')
    {
        message.reply('pong');
    }
});

client.login(process.env.BOT_TOKEN);