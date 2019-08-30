$(function () {
	console.log('サーバーへメッセージを送ってみます。\n');
	/////////////////////////////////////////////////
	//サーバーにある全てのイベントファイルのデータ送信要求
	/////////////////////////////////////////////////
	MySocketIo.emit('C2S:sendRequestEventFilesData', 'データおくれ');

	//==========socketIO(サーバーからメッセージが届いた時に発火）=========================
	//MySocketIo.on('S2C:sendAllEventData', function (data) {
	//	console.log(':サーバーからメッセージがありました。\n');
	//});

	MySocketIo.on('S2C:sendAllEventData', function (allEvntData) {
		console.log('サーバーから全てのイベントデータが届きました。\n');
		let linkStr;
		for (let itm of allEvntData) {//イベントデータを一つづつ取り出す。 itmはJSonStrings
			itm = itm.replace(/\\/g, "\\\\");//サーバー側のデータ中の画像ファイルへのパスに"\"が含まれており、JSON.parseでエラーになるため
			itm = JSON.parse(itm);//JSオブジェクト配列に変換
			AllEventData.push(itm);//グローバル変数(JsObj)にも保存しておく→他所で参照することあり。 
			linkStr = '[' + itm.HeadrCategory + ']' + itm.HeadrYear + '/' + itm.HeadrMonth + '/' + itm.HeadrDay + ' ' + itm.HeadrHour + ':' + itm.HeadrMinute + ' 地先:' + itm.HeadrCity + itm.HeadrAddres;

			//①全ての事象に登録
			$('#ulListEvnt-0').append('<a href="#"><li class="evntList" id="' + itm.eventId + '" onClick=eventListClick(this)>' + linkStr + '</li></a>');
			//②カテゴリー落下物に登録
			if (itm.HeadrCategory == '落下物')
				$('#ulListEvnt-1').append('<a><li class="evntList" id="' + itm.eventId + '" onClick=eventListClick(this)>' + linkStr + '</li></a>');
			//③カテゴリー事故に登録
			if (itm.HeadrCategory == '事故')
				$('#ulListEvnt-2').append('<a><li class="evntList" id="' + itm.eventId + '" onClick=eventListClick(this)>' + linkStr + '</li></a>');
			//④カテゴリー災害に登録
			if (itm.HeadrCategory == '災害')
				$('#ulListEvnt-3').append('<a><li class="evntList" id="' + itm.eventId + '" onClick=eventListClick(this)>' + linkStr + '</li></a>');
			//⑤カテゴリー動物死骸に登録
			if (itm.HeadrCategory == '動物死骸')
				$('#ulListEvnt-4').append('<a><li class="evntList" id="' + itm.eventId + '" onClick=eventListClick(this)>' + linkStr + '</li></a>');
			//⑥カテゴリー苦情に登録
			if (itm.HeadrCategory == '苦情')
				$('#ulListEvnt-5').append('<a><li class="evntList" id="' + itm.eventId + '" onClick=eventListClick(this)>' + linkStr + '</li></a>');
			//⑦カテゴリー通報に登録
			if (itm.HeadrCategory == '通報')
				$('#ulListEvnt-6').append('<a><li class="evntList" id="' + itm.eventId + '" onClick=eventListClick(this)>' + linkStr + '</li></a>');
			//⑧カテゴリーその他に登録
			if (itm.HeadrCategory == 'その他')
				$('#ulListEvnt-7').append('<a><li class="evntList" id="' + itm.eventId + '" onClick=eventListClick(this)>' + linkStr + '</li></a>');
		}
	});





});