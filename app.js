'use strict';
var createError = require('http-errors');
var express = require('express');
var path = require('path');
//var cookieParser = require('cookie-parser');
//var logger = require('morgan');
var multer = require('multer');
var fs = require("fs");

var app = express();

// view engine setup
//app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//app.use(logger('dev'));
//app.use(express.json());
//app.use(express.urlencoded({ extended: false }));
//app.use(cookieParser());

//クライアント側で、パス文字列無しで"public"ディレクトリを使用できるように設定。
// express.static ミドルウェア関数に、静的ファイルが格納されているディレクトリをセット。
app.use(express.static(path.join(__dirname, 'public')));

//ルータを使ったルートへのアクセス処理（index.ejsを返す？
//var indexRouter = require('./routes/index');//".ejs"は省略されている？
//app.use('/', indexRouter);
// GETリクエストでの"/"へのアクセス処理　/views/index.ejsを表示する。拡張子（.ejs）は省略されていることに注意。
app.get("/", function (req, res, next) {
	console.log('Address-'+req.connection.remoteAddress);
	
	var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
	console.log('ip=' + ip);
	console.log('req.ip=' + req.ip);
	console.log('req.ips'+ req.ips);
	res.render("index", {});
});

// "/imgUplodForm"へのGETリクエストで/views/imgUpLoadForm.ejsを表示する。拡張子（.ejs）は省略されていることに注意。
app.get("/evntDtUploadForm", function (req, res, next) {
  res.render("evntDtUploadForm", {});
});

// "/imgUplodForm"へのPOSTリクエスト処理
//↓https://dev.classmethod.jp/server-side/node-express-multer-file-upload/
const storage = multer.diskStorage({
	// ファイルの保存先を指定
	destination: function (req, file, cllBk) {
		cllBk(null, './eventDatac/photos');//保存ディレクトリセット
	},
	filename: function (req, file, cllBk) {				//↓こうすることであえてファイル拡張子をつけなくてもよい。
		//cllBk(null, Date.now() + '-' + file.originalname);//保存するファイル名を現在時+オリジナル名とします。
		cllBk(null, Date.now() + '.JPG');//ファイル名がどんどん長くなることを防ぐためオリジナル名は使わない。※『JPG』は大文字
	}
});
var uploaderByMlter = multer({ storage: storage }).array('eventPhoto');//eventPhotoは、HTML内のフィールド名のこと
//↑https://dev.classmethod.jp/server-side/node-express-multer-file-upload/
//↑で定義してある『uploaderByMlter』関数にて↓で『req.filename』としてファイル名が取り出せる。
app.post('/evntDtUploadForm', uploaderByMlter, function (req, res, next) {
	var pstDt = JSON.stringify(req.body);//ポストされたデータをJSON文字列としてセット
	pstDt = pstDt.replace(/,/g, ',\n');//","で改行する。
	
	const fileUniqueName = "./eventData/" + JSON.parse(pstDt).eventId + ".json";//ポスト時の、submitButtonに付加されたUDIをポストデータ保存時のUIDとする。

	//写真の添付があれば、ファイル名を追加するため、一旦最後の"}"を","に変更
	if (req.files.length > 0) {
		pstDt = pstDt.replace("}", ",");
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

		//ポストデータに写真ファイル名を追加する
		pstDt += '"imgFiles":{' + imgFileNames + "," + mimetypes + "," + filePaths + "}}"
	}

	//ファイル保存
	fs.writeFile(fileUniqueName, pstDt, function (err) {
		if (err) { throw err; }
		console.log("アップロード完了");
		//res.status(200).json({ msg: 'アップロード完了\nこの画面を閉じてください。' });
		res.writeHead(200, { 'Content-Type': 'text/html; charset=UTF-8' });

		res.write('<div style="text-align:center;">');
		res.write('<h1> 事象登録完了</h1>');
		res.write('<h2>この画面を閉じてください。</h2>');
		res.write('<button type="button" onClick = "function closeWin(){window.close()} closeWin(); return false;">画面を閉じる。</button>');
		res.write('</div>');
		res.end();
	});
});

// catch 404 and forward to error handler
//app.use(function (req, res, next) {
//  next(createError(404));
//});

// error handler
/*
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});
*/

module.exports = app;