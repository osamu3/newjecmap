var socket = io.connect();

$(function () {
	console.log('サーバーへメッセージを送ってみます。\n');
	/////////////////////////////////////////////////
	//サーバーにある全てのイベントファイルのデータ送信要求
	/////////////////////////////////////////////////
	socket.emit('C2S:sendRequestEventFilesData', 'データおくれ');

	//==========socketIO(サーバーからメッセージが届いた時に発火）=========================
	socket.on('S2C:sendAllEventData', function (data) {
		console.log(data + ':サーバーからメッセージがありました。\n');
		//alert("サーバーからメッセージがありました。["+data+"]");
	});
});