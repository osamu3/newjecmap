var fs = require("fs");
var AllEvntData = [];//サーバーに保存してある全てのイベントデータ

function scktIoDfn(server) {
	var sIo = require('socket.io')(server);

	// 接続
	sIo.on('connection', function (socket) {
		console.log("SOCKET IO CONNECTED!!!!!!!!");

		//socket.on('C2S:sendRequestEventFilesData', function (msg) {
		//	console.log('クライアントから着信！： ' + msg);
		//	console.log('イベントデータを送ります： ');
		//	socket.emit('S2C:sendAllEventData', 'AllEvntData');//どうも配列としてsocket送信する訳だが、送信時に文字列(JSON)に変換されるようだ。
		//});
		socket.on("disconnect", function () {
			console.log('切断されました。 ');
		});

		//クライアントから全てのイベントファイルデータの送信要求があった。。
		socket.on('C2S:sendRequestEventFilesData', function (msg) {
			console.log('クライアントから着信！： ' + msg);

			//イベントデータファイル一覧を配列に入れて、ソケットでクライアントへ送信。
			AllEvntData = [];//配列を空にしておく。←これをしておかないと、ブラウザの再読み込みで、同じ要素が追加される。
			let flist;
			//ファイル一覧取得
			flist = fs.readdirSync('./eventData');
			for (let fnm of flist) {
				if (fnm.match(/.json$/)) {//JSONファイルなら
					AllEvntData.push(//ファイルの読み込み。読み込んだファイルはJSON文字列
						fs.readFileSync('./eventData/' + fnm, 'utf8',
							function (err, jsnDt) {
								if (err) { throw err; }
								return JSON.parse(jsnDt);//読み込まれた「jsnDt」はJSON文字列なので、配列に変換してリターンする。
							}
						)
					);
				}
			}
			console.log('クライアントへイベントデータ送ります。');
			socket.emit("S2C:sendAllEventData", AllEvntData);//どうも配列としてsocket送信する訳だが、送信時に文字列(JSON)に変換されるようだ。
		});

		//クライアントの子画面から、
		socket.on('CC2S:sendRequestImgData', function (phtNm, elmId) {//
			console.log('きたきた:imgNM=' + phtNm + ' elmId=' + elmId);
			var fs = require('fs');
			const path = './eventData/photos/' + phtNm;
			fs.stat(path, (error, stats) => {
				if (error) {
					console.log('ファイル【' + path + '】が見つからない。');
					socket.emit('S2CC:ErrNoSuchFile', path);
				} else {
					//画像ファイルをBase64データにしてソケットで送る
					fs.readFile(path, function (err, data) {
						var prefix = 'data:image/jpeg;base64,',
							base64 = new Buffer(data, 'binary').toString('base64'),
							sendData = prefix + base64;
						//子画面(イベント編集画面)へソケットで画像送信
						console.log('【クライアントへメッセージ送信】S2CC:sendBase64PhtData');
						socket.emit('S2CC:sendBase64PhtData', sendData, elmId);
					});
				}
			});
		})
	});
}

module.exports = scktIoDfn;//ソケットIO通信の定義実装