const Discord = require('discord.js');

function help(message){
const helpmsg = {
	color: 0x0099ff,
	title: 'Commadlist',
	fields: [
		/*{
			name: 'Setprefix',
			value: 'cahnge prefix',
			
		},*/
		{
			
			name: 'Play',
			value: 'Start music and add to queue, message must contain youtube song link',
		},
		{
			name: 'Skip',
			value: 'Skip current song',
		},
		{
			name: 'Stop',
			value: 'Stop music',
			
		},
		{
			name: 'Create_list',
			value: 'Create your personal playlist',
			
		},
		{
			name: 'Listadd',
			value: 'Add song in your playlist, must contain youtube song link',
			
		},
		{
			name: 'Startlist',
			value: 'Start your list, skip and stop have same function as before',
			
		},
		{
			name: 'Cat',
			value: 'Send random cat picture',
			
		},
		{
			name: 'Eidolons',
			value: 'Send time and day state on Plain of Eidolons',
			
		},
			
	],

	timestamp: new Date(),
	
};
return message.channel.send({ embed: helpmsg });
}
module.exports.help = help; // export your functuion
