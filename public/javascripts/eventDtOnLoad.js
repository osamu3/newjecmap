$(window).on('load',() =>{
	const eventDtFile = $('#eventDtFile')[0]	;
	//  FileReaderオブジェクトを生成
	const fileReader = new FileReader();
  
	// ファイルが選択されたらFileReaderオブジェクトにファイルをテキストとして保存
	eventDtFile.addEventListener('change', function(e){
		fileReader.readAsText(e.target.files[0]);
	});
  
	// ファイルの読み込みが終わったら内容を表示
	fileReader.onload = function (e) {
		var jsonArr = JSON.parse(e.target.result);
		//paneを利用したイベントマーカーのZIndex設定
		//https://qiita.com/kkdd/items/a406cbde0d343d2061aa
		//http://nobmob.blogspot.com/2018/06/leaflet-13-4-10-working-with-map-panes.html

		let groupByKpArr = {
			"9": {},
			"27": {}
		};

		//キロポスト毎に集計
		for (let item in jsonArr) {
			let route = jsonArr[item]["号線"];
			let kp = jsonArr[item]["KP"];
			let evnt = jsonArr[item]["事象"];
			let target = jsonArr[item]["対象"];

			//事象とkpでインクリメント
			//↓テクニック！　cf: http://nakawake.net/?p=831 //配列アイテムをセットしてからでないと count++できない(プロパティーが見つかりませんエラー)
			if (kp in groupByKpArr[route]) {//この連想配列(号線)に既に同じkpがあれば
				if (evnt in groupByKpArr[route][kp]) {//この連想配列にevntがあれば(死骸処理、落下物...)
					if (target in groupByKpArr[route][kp][evnt]) {//この連想配列にtargetがあれば(シカ、イノシシ、...)
						groupByKpArr[route][kp][evnt][target].count++
					} else {//targetがなければ
						groupByKpArr[route][kp][evnt][target] = { count: 0 }
					}
				} else {//evntがなければ
					groupByKpArr[route][kp][evnt] = { [target]: { count: 0 } }
				}
			} else {	//kpがなければ
				groupByKpArr[route][kp] = { [evnt]: { [target]: { count: 0 } } }
			}
		}

///////////////////////////////////////////////////////////////////////////////////////////////
/////                                                                                           ///////
///// MakerWithLabel で、かっこいいラベルを作ろう！  /////// 
/////    cf:https://maps.multisoup.co.jp/blog/2579/                   ///////
///////////////////////////////////////////////////////////////////////////////////////////////
		


		//集計後のカウンター値に基づき、マーカーアイコンの数をセット
		//先ず、マーカー配列の全ての要素を削除
		deleteAllMakers(EventMarkerArr);
		let eventMarkerIcon;
		$.each(groupByKpArr[9], function (key, item) {
			//console.log(key + ": " + value);
			//let markerIcon, iconFileNm;
			switch (Object.keys(item)[0]) {
				case "動物死骸":
					switch (Object.keys(item[Object.keys(item)[0]])[0]) {
						case "イノシシ":
							eventMarkerIcon = {
								//『item["死骸処理"]["イノシシ"].count』の形式、countは、０(ゼロ)スタート 
								//Object.keys(item)[0] =>死骸処理、item[Object.keys(item)[0]][Object.keys(item[Object.keys(item)[0]])[0]=>イノシシ
								url: "images/shika" + String(item[Object.keys(item)[0]][Object.keys(item[Object.keys(item)[0]])[0]].count + 1) + ".png",
								scaledSize: new google.maps.Size(35, 35),
								//原点
								origin: new google.maps.Point(0, 0),//画像描画位置（0,0=>左下)
								//マーカ位置と画像の接する点
								anchor: new google.maps.Point(0, 35)
							}
							break;
						case "シカ":
							eventMarkerIcon = {
								url: "images/shika" + String(item[Object.keys(item)[0]][Object.keys(item[Object.keys(item)[0]])[0]].count + 1) + ".png",
								scaledSize: new google.maps.Size(35, 35),
								//原点
								origin: new google.maps.Point(0, 0),
								//マーカ位置と画像の接する点
								anchor: new google.maps.Point(0,35)
							}
							break;
						default://othersは、全てothers1.png
							eventMarkerIcon = {
								url: "images/others1.png",
								scaledSize: new google.maps.Size(35, 35),
								//原点
								origin: new google.maps.Point(0, 0),
								//マーカ位置と画像の接する点
								anchor: new google.maps.Point(0,35)
					}
					}
					break;
				default://othersは、全てothers1.png
					eventMarkerIcon = {
						url: "images/request9.png",
						scaledSize: new google.maps.Size(35, 35),
						origin: new google.maps.Point(0,0),
						anchor: new google.maps.Point(0,35)
					}
			}
			
			let latLngObj = getkp2LatLng(9, key);
			let latLng = new google.maps.LatLng(latLngObj.lat, latLngObj.lng);
//			let eventMarkerIcon = getEventMarkerIcon();

			EventMarkerArr.push(new google.maps.Marker({
				map: MyMap,
				icon: eventMarkerIcon,
				position: latLng,
				title: key+"latLng("+latLng.lat()+":"+latLng.lng()+")"　
			}));
		});
	};
 });

