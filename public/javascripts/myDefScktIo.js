var app = require('../../app');
var http = require('http').Server(app);
var io = require('socket.io')(http);

//ソケットIOを使った通信手順の定義
function myDefScktIo() {
  // Socket.IO
	 http.listen(app.get('port'), function() {
    	  console.log('listening!!!');
  	});

 	io.on('connection', function(socket){
		console.log('Nconnection！！！！!!!');
	
		  socket.on('chat message', function (msg) {
            console.log('message: ' + msg);
            io.emit('chat message', msg);
      });
  });
}

module.exports = myDefScktIo;