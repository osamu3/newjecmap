'use strict';
const express = require("express");
const app = express();
//サーバデブロイ時には、「https」にすると、ワーニングが出なくなる。ローカル接続では、https証明の発行ができいないので、だめ。

var multer = require('multer');
var mkdirp = require("mkdirp");
var fs = require("fs");

var async = require('async');

//Express での静的ファイルの提供 ←重要
//http://expressjs.com/ja/starter/static-files.htmlより
	app.use('/static', express.static('public'));//←別名定義例(クライアント側で使用)これで、"public"を"/static" で利用できる。
	app.use(express.static('public'));	//パス文字列無しで"public"を使用できるように設定。

// (クライアント側設定)View EngineにEJSを指定。
app.set('view engine', 'ejs');

// "/"へのGETリクエストで/views/index.ejsを表示する。拡張子（.ejs）は省略されていることに注意。
app.get("/", function (req, res, next) {
	res.render("index", {});
});

// "/imgUplodForm"へのGETリクエストで/views/imgUpLoadForm.ejsを表示する。拡張子（.ejs）は省略されていることに注意。
app.get("/imgUploadForm", function (req, res, next) {
	res.render("imgUploadForm", {});
});

//↓https://dev.classmethod.jp/server-side/node-express-multer-file-upload/
const storage = multer.diskStorage({
	// ファイルの保存先を指定
	destination: function (req, file, cllBk) {
		cllBk(null, './public/UploadPhotos');//保存ディレクトリセット
	},
	filename: function (req, file, cllBk) {				//↓こうすることであえてファイル拡張子をつけなくてもよい。
		//cllBk(null, Date.now() + '-' + file.originalname);//保存するファイル名を現在時+オリジナル名とします。
		cllBk(null, Date.now() + '.JPG');//ファイル名がどんどん長くなることを防ぐためオリジナル名は使わない。※『JPG』は大文字
	}
});

var uploaderByMlter = multer({ storage: storage }).array('eventPhoto');//eventPhotoは、HTML内のフィールド名のこと
//↑https://dev.classmethod.jp/server-side/node-express-multer-file-upload/

//↑で定義してある『uploaderByMlter』関数にて↓で『req.filename』としてファイル名が取り出せる。
app.post('/images', uploaderByMlter, function (req, res, next) {
	var pstDt = JSON.stringify(req.body);//ポストされたデータをJSON文字列としてセット
	const fileUniqueName = "./public/eventData/" + JSON.parse(pstDt).eventId + ".json";//ポスト時の、submitButtonに付加されたUDIをポストデータ保存時のUIDとする。

	//ポストされたデータに、ファイル名を追加するため、一旦最後の"}"を","に変更
	pstDt = pstDt.replace("}", ",");
	//pstDt = JSON.parse(pstDt); //ジャバスクリプトオブジェクトにする。←必要性検証済み

	var imgFileNames = '"imgFileNames":[';
	var mimetypes = '"mimetype":[';
	var filePaths = '"filePath":[';
	for (var i = 0; i < req.files.length; i++) {//添付ファイルの個数だけループ
		imgFileNames += '"' + req.files[i].filename + '",';
		mimetypes += '"' + req.files[i].mimetype + '",'; //画像ファイルのタイプ
		filePaths += '"' + req.files[i].path + '",';
	}
	//最後のカンマを削除し"]"を付け加える
	imgFileNames = imgFileNames.substr(0, imgFileNames.length - 1) + "]";
	mimetypes = mimetypes.substr(0, mimetypes.length - 1) + "]";
	filePaths = filePaths.substr(0, filePaths.length - 1) + "]";

	//写真ファイル名を配列に追加すること
	pstDt += '"imgFiles":{' + imgFileNames + "," + mimetypes + "," + filePaths + "}}"

	//ファイル保存
	fs.writeFile(fileUniqueName, pstDt, function (err) {
		if (err) { throw err; }
		console.log("アップロード完了");
		res.status(200).json({ msg: 'アップロード完了\nこの画面を閉じてください。' });
	});
});

//listen()メソッドを実行してポートで待ち受け。
var port = process.env.PORT || 1337;
http.listen(port, () => {
	console.log(`listening on *:${port}`);
});

//IOソケットイベント
io.sockets.on('connection', function (socket) {
	var AllEvntData = [];//サーバーに保存してある全てのイベントデータ
	//socket Emit send Event All Data.
	console.log('=== クライアントの接続がありました。==');
	console.log(JSON.stringify(socket.handshake));

	//クライアントから全てのイベントファイルデータの送信要求があった。。
	socket.on('C2S:sendRequestEventFilesData', function () {
		//イベントデータファイル一覧を配列に入れて、ソケットでクライアントへ送信。
		let flist;
		//ファイル一覧取得
		flist = fs.readdirSync('./public/eventData');
		for (let fnm of flist) {
			if (fnm.match(/.json$/)) {//JSONファイルなら
				AllEvntData.push(//ファイルの読み込み。読み込んだファイルはJSON文字列
					fs.readFileSync('./public/eventData/' + fnm, 'utf8',
						function (err, jsnDt) {
							if (err) { throw err; }
							return JSON.parse(jsnDt);//読み込まれた「jsnDt」はJSON文字列なので、配列に変換してリターンする。
						}
					)
				);
			}
		}
		socket.emit("S2C:sendAllEventData", AllEvntData);//どうも配列としてsocket送信する訳だが、送信時に文字列(JSON)に変換されるようだ。
	});

	//孫クライアントから全てのイベントファイルデータの送信要求があった。。
	socket.on('CC2S:sendRequestEventFilesData', function () {
		if (AllEvntData != null)
			socket.emit("S2CC:sendAllEventData", AllEvntData);//配列が、送信時に文字列(JSON)に変換されるようだ。
	});



	//孫クライアントからの画像データ送信要求があった。。
	socket.on('CC2S:sendRequestImgData', function (fileNm) {
		var fs = require('fs');
		const path = './public/UploadPhotos/' + fileNm;

		fs.stat(path, (error, stats) => {
			if (error) {
				console.log('ファイル【' + path + '】が見つからないない。');
				socket.emit("S2CC:ErrNoSuchFile", path);
			} else {
				//KnowHw画像ファイルをBase64データにしてソケットで送る
				fs.readFile(path, function (err, data) {
					var prefix = 'data:image/jpeg;base64,',
						base64 = new Buffer(data, 'binary').toString('base64'),
						sendData = prefix + base64;
					//孫へソケットにて画像送信
					socket.emit("S2CC:sendBase64ImgData", sendData);
				});
			}
		});
	});
});