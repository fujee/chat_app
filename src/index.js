var _ = require('lodash');
var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var users = {
	male: [],
	female: []
};
var active_users = {};

var checkGender = function(id) {
	var foundMale = _.find(users.male, { id: id });
	if (foundMale) {
		return foundMale;
	}
	return _.find(users.female, { id: id });
};
server.listen(3000);

app.get('/', function(request, response) {
	response.sendFile(__dirname + '/index.html');
});
io.on('connection', function(socket){
	socket.on('chat.login', function(data) {
	    socket.join(data.gender);
	    socket.join(socket.id);
	    console.log(socket.id);
	    console.log('--------');
	    users[data.gender].push({ id: socket.id, name: data.name });
   		io.sockets.in(data.gender).emit('chat.users', users[data.gender])
    });
    socket.on('chat.send', function(data) {
    	var user ;	
    	console.log(data.to);
    	console.log(data.message);
    	io.sockets.in(data.to).emit('chat.sendPrivateMessage', data.message);
    });

	socket.on('chat.message', function(message){
		console.log(checkGender(socket.id), message, 'hit');
		var selected_user = checkGender(socket.id);
		console.log(selected_user);
	});
});
