const Discord = require('discord.js');
const ytdl = require('ytdl-core');

const fs = require('fs');

const client = new Discord.Client();

const queue = new Map();

const fetch = require('node-fetch');
 var Users_list = [];
 const folder = './Playlists';

/*Regular play cmds*/
async function execute(message, serverQueue) {
	const args = message.content.split(' ');
	const voiceChannel = message.member.voiceChannel;
	if (!voiceChannel) return message.channel.send('You need to be in a voice channel to play music!');
	const permissions = voiceChannel.permissionsFor(message.client.user);
	if (!permissions.has('CONNECT') || !permissions.has('SPEAK')) {
		return message.channel.send('I need the permissions to join and speak in your voice channel!');
	}
	try{
	const songInfo = await ytdl.getInfo(args[1]);}
	catch(err){
		return message.channel.send(`Sorry but we cant add this song. Please try different link`);
	}
	const song = {
		title: songInfo.title,
		url: songInfo.video_url,
	};

	if (!serverQueue) {
		const queueContruct = {
			textChannel: message.channel,
			voiceChannel: voiceChannel,
			connection: null,
			songs: [],
			volume: 5,
			playing: true,
			
		};
		
		queue.set(message.guild.id, queueContruct);

		queueContruct.songs.push(song);
		console.log('queueContruct');
		try {
			var connection = await voiceChannel.join();
			queueContruct.connection = connection;
			play(message.guild, queueContruct.songs[0]);
			
		    console.log('try');
		} catch (err) {
			console.log(err);
			queue.delete(message.guild.id);
			console.log('catch');
			return message.channel.send(err);
		}
	}
	else {
		serverQueue.songs.push(song);
		console.log(serverQueue.songs);
		console.log('else');
	
		return message.channel.send(`${song.title} has been added to the queue!`);
	}

}
function skip(message, serverQueue) {
	if (!message.member.voiceChannel) return message.channel.send('You have to be in a voice channel to stop the music!');
	if (!serverQueue) return message.channel.send('There is no song that I could skip!');
	serverQueue.connection.dispatcher.end();

}
function stop(message, serverQueue) {
	if (!message.member.voiceChannel) return message.channel.send('You have to be in a voice channel to stop the music!');
	serverQueue.songs = [];
	serverQueue.connection.dispatcher.end();

}
function play(guild, song) {
	const serverQueue = queue.get(guild.id);

	if (!song) {
		serverQueue.voiceChannel.leave();
		queue.delete(guild.id);
		return;
	}

	const dispatcher = serverQueue.connection.playStream(ytdl(song.url))
		.on('end', () => {
			
			console.log('Music ended!');
			serverQueue.songs.shift();
			play(guild, serverQueue.songs[0]);
			
		})
		.on('error', error => {
			console.error(error);
		});
	dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
}


/*play list cmds*/
async function listc(message, serverQueue){
	  console.log('tf');
	
	Users_list = [];
	 console.log('tf2');
	fs.readdirSync('./Playlists').map(fileName => {
	 fileName.toString();  

	 console.log(fileName);
	 Users_list.push(fileName); 
   console.log(Users_list);
  });
  
  var ID = message.author.id;
    ID_input = [],
    sID = ID.toString();
	for (var i = 0, len = sID.length; i < len; i += 1) {
    ID_input.push(+sID.charAt(i));
  }
  for(k=0;k<=Users_list.length-1;)
  {
	var File = Users_list[k].split(".");
	var File_ID = File[0];
	ID_output = [];
	for (var z = 0, len = File_ID.length; z < len; z += 1) {
    ID_output.push(+File_ID.charAt(z));
    }
	console.log(ID_output +" File ID " + k);
    console.log(ID_input.length +" ID lenght" + k);
	console.log(ID +" ID " + k);
	var p = 0;
	for(var p =0; p < ID_input.length;)
	{
	 var inp = parseInt(ID_input[p]);	
	 var out = parseInt(ID_output[p]);
	    if(p == ID_input.length-1 && inp == out)
		{
			return  message.channel.send(`your playlist already exist`);
		} 
		else if(inp == out)
		{
			p+=1; 
		}
		
	
		 
		else if(inp != out){p=ID_input.length;}
	   
    }
	 	 console.log(" k= "+k);
	 if ( k == Users_list.length-1)
	{ 
		message.channel.send(`playlist `+ message.author.username+` created`);	
	    filename = message.author.id + '.json';
		console.log('im here');
		
		fs.writeFileSync("./Playlists/"+filename,'{ "song": []}' );
		console.log('playlist  ' + filename);
		return;
	}
     else{k++;}
   };	
	
}
async function listadd(message, serverQueue){
    const ID = message.author.id;
	filename = ID +'.json';
	try{
	if(ID_CHECK(message)==true){
	const args = message.content.slice(listadd).split(' ')

	const songsInfo = await ytdl.getInfo(args[1]);
	const songs = {
		title: songsInfo.title,
		url: songsInfo.video_url,
	};

	fs.readFile('./Playlists/'+filename, 'utf-8', function(err, data) {
	if (err) throw err
	var arrayOfObjects = JSON.parse(data)
	
	arrayOfObjects.song.push({
		title: songsInfo.title,
		url: songsInfo.video_url,
	})
	console.log(arrayOfObjects);
	message.channel.send(`A song **"`+ songsInfo.title +`"** has been add to ` + message.author.username +`'s playlist`);
	fs.writeFile('./Playlists/'+filename, JSON.stringify(arrayOfObjects), 'utf-8', function(err) {
	if (err) throw err
	console.log('Done!');
	return message.channel.send(`Sorry but we cant add this song. Please try different link`);
	})
	
	return;
	
	})
	}
	else {return message.channel.send(`First create playlist `+prefix+`create_list`);}
	}
	catch(err){
		return message.channel.send(`Sorry but we cant add this song. Please try different link`);	
	}
}
async function list (message,serverQueue){
	
	if(ID_CHECK(message) == true){
	const voiceChannel = message.member.voiceChannel;
	if (!voiceChannel) return message.channel.send('You need to be in a voice channel to play music!');
	const permissions = voiceChannel.permissionsFor(message.client.user);
	if (!permissions.has('CONNECT') || !permissions.has('SPEAK')) {
		return message.channel.send('I need the permissions to join and speak in your voice channel!');
	}
	
	 filename = message.author.id;
	let data = fs.readFileSync('./Playlists/'+filename+'.json');
	let song = JSON.parse(data);

	const queueContruct = {
			textChannel: message.channel,
			voiceChannel: voiceChannel,
			connection: null,
			songs: [],
			volume: 5,
			playing: true,
			
		};

	for(var k = 0;k<=song.song.length-1;){
	stringurl = song.song[k].url.toString();
	const songInfo = await ytdl.getInfo(stringurl);
	
	const song_a = {
		title: songInfo.title,
		url: songInfo.video_url,
	};
		queue.set(message.guild.id, queueContruct);
		queueContruct.songs.push(song_a);
		k++;

	}
	queueContruct.connection = await voiceChannel.join();
	play(message.guild, queueContruct.songs[0]);
	
}
else {return message.channel.send(`First create playlist `+prefix+`create_list`);}



}
	
function ID_CHECK(message){
	var ID_check = false;
	 const ID = message.author.id;
	filename = ID +'.json';
	
	Users_list = [];
	fs.readdirSync(folder).map(fileName => {
	 fileName.toString();  
	
	 console.log(fileName);
	 Users_list.push(fileName); 
   });
   
    ID_input = [],
    sID = ID.toString();
	for (var i = 0, len = sID.length; i < len; i += 1) {
    ID_input.push(+sID.charAt(i));
    }
	for(var j=0;j<=Users_list.length-1;)
  {
	var File = Users_list[j].split(".");
	var File_ID = File[0];
	ID_output = [];
	for (var z = 0, len = File_ID.length; z < len; z += 1) {
    ID_output.push(+File_ID.charAt(z));
    }
	console.log(ID_output +" File ID " + j);
    console.log(ID_input.length +" ID lenght" + j);
	console.log(ID +" ID " + j);
	var p = 0;
	for(var p =0; p < ID_input.length;)
	{
	 var inp = parseInt(ID_input[p]);	
	 var out = parseInt(ID_output[p]);
	    if(p == ID_input.length-1 && inp == out)
		{
			return ID_check=true;
		} 
		else if(inp == out)
		{
			p+=1; 
		}	 
		else if(inp != out){p=ID_input.length;
		}
	   
    }
	 	 console.log(" j= "+j);
	 if ( j == Users_list.length-1)
	 {
		return ID_check=false;
	 }
     else{j++;}
   };		
	
}	
	
module.exports.execute = execute;
module.exports.skip = skip;
module.exports.stop = stop;
module.exports.play = play;
module.exports.listc = listc;
module.exports.listadd = listadd;
module.exports.list = list;
