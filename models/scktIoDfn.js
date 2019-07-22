function scktIoDfn(server) {
	var sIo = require('socket.io')(server);

	// 接続
	sIo.on('connection', function (socket) {
		console.log("SOCKET IO CONNECTED!!!!!!!!");
	
		socket.on('C2S:sendRequestEventFilesData', function(msg){
			console.log('クライアントから着信！： ' + msg);
			console.log('イベントデータを送ります： ');
			socket.emit('S2C:sendAllEventData', 'AllEvntData');//どうも配列としてsocket送信する訳だが、送信時に文字列(JSON)に変換されるようだ。
		});
		socket.on("disconnect", function() {
			console.log('切断されました。 ');
		});
	});
}

module.exports = scktIoDfn;//ソケットIO通信の定義実装