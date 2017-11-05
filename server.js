var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var path = require('path');

var commands = [
	{command: '/setColor', style: 'color: '},
	{command: '/setBold' , style: 'font-weight: bold'},
	{command: '/setItalic' , style: 'font-style: italic;'}
];

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res){
	res.sendFile(__dirname + '/public/views/index.html');
});

io.on('connection', function(socket){
	console.log('a user connected');
	socket.on('disconnect', function(){
		console.log('user disconnected');
	});

	socket.on('chat message', function(user, msg){
		var style = '';
		var firsCommandIndex = msg.indexOf('/');
		var actualMsg = firsCommandIndex == -1 ? msg : msg.substring(0, firsCommandIndex);

		for (var i=0; i < commands.length; i++){
			var currCommand = commands[i];
			var currCommandIndex = msg.indexOf(currCommand.command);

			if (currCommandIndex != -1){
				var nextCommandIndex = msg.indexOf('/',currCommandIndex + 1) == -1 ?
											msg.length : msg.indexOf('/',currCommandIndex + 1);

				style += currCommand.style +
					     msg.substring(currCommandIndex + currCommand.command.length, nextCommandIndex) + ';';
			}
		}

		socket.broadcast.emit('chat message', user + ": " + actualMsg, style);
	});
});

http.listen(3000, function(){
	console.log('listening on *:3000');
});