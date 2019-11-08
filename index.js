const Discord = require('discord.js');
const {
	prefix,
	token,
} = require('./config.json');
	console.log(prefix);
var y = 0;

const ytdl = require('ytdl-core');
const fs = require('fs');
const fetch = require('node-fetch');

const client = new Discord.Client();
const queue = new Map();

var Users_list = [];

const helpmsg = require("./help.js");
const music = require("./musicbot.js")
const folder = './Playlists';


client.once('ready', () => {
	console.log('Ready!');
});

client.once('reconnecting', () => {
	console.log('Reconnecting!');
});

client.once('disconnect', () => {
	console.log('Disconnect!');
});

client.on('message', async message => {
	
	if (message.author.bot) return;
	if (!message.content.startsWith(prefix)) return;

	const serverQueue = queue.get(message.guild.id);

	if (message.content.startsWith(`${prefix}play`)) {
		music.execute(message, serverQueue);
		return;
	} 
	else if (message.content.startsWith(`${prefix}skip`)) {
		music.skip(message, serverQueue);
		
		return;
	} 
	
	else if (message.content.startsWith(`${prefix}stop`)) {
		music.stop(message, serverQueue);
		return;
	} 
	else if (message.content.startsWith(`${prefix}ping`)){
		message.channel.send('Pong.');
	}
	else if (message.content.startsWith(`${prefix}cat`)){
		const { file } = await fetch('https://aws.random.cat/meow').then(response => response.json());
		message.channel.send(file);	
	}
	
	else if (message.content.startsWith(`${prefix}eidolon`)){
		daystate(message);
	}
	else if(message.content.startsWith(`${prefix}create_list`)){
		music.listc(message,serverQueue);
		
	}
	else if(message.content.startsWith(`${prefix}listadd`)){
		music.listadd(message,serverQueue);
		return;
	}
	else if(message.content.startsWith(`${prefix}startlist`)){
		music.list(message,serverQueue);
		
	}
	else if(message.content.startsWith(`${prefix}help`)){
		helpmsg.help(message);
		
	}
	/*else if (message.content.startsWith(`${prefix}setprefix`)) {
		setprefix(message);
		console.log(prefix);
		return;
	} */
	
	else {
		message.channel.send('You need to enter a valid command!');
	}
})

/*function setprefix(message){
	
	const args = message.content.slice(setprefix).split(' ')
	 pref = args[1];
	
	
	var data = fs.readFileSync('config.json', 'utf-8');
  var newValue = data.replace(prefix, pref);

  fs.writeFileSync('config.json', newValue, 'utf-8');

  console.log('readFileSync complete');
}*/

async function daystate(message){
const { isDay } = await fetch('https://api.warframestat.us/pc/cetusCycle').then(response => response.json());
		
		if(isDay == true ){
		const { timeLeft } = await fetch('https://api.warframestat.us/pc/cetusCycle').then(response => response.json());
		message.channel.send(`time until night `+timeLeft);	
		}
		else 
		{
	        const { timeLeft } = await fetch('https://api.warframestat.us/pc/cetusCycle').then(response => response.json());
		message.channel.send(`is night` + timeLeft);
		}
	}	
}




client.login(token);
