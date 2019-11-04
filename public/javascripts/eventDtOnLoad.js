//事象ファイルを読み込み、事象種別毎、100mPich毎に集約して地図上に表示する
$(window).on('load', () => {
	const eventDtFile = $('#eventDtFile')[0]	;//ファイルインプットタグ
	//  FileReaderオブジェクトを生成
	const fileReader = new FileReader();
  
	// ファイルが選択されたらFileReaderオブジェクトにファイルをテキストとして保存
	eventDtFile.addEventListener('change', function(e){
		fileReader.readAsText(e.target.files[0]);
	});
  
	// ファイルの読み込みが終わったら内容を表示
	fileReader.onload = function (e) {
		//JSonかどうかの判定
		if (!isJSon(e.target.result)) {//ファイルがJSonファイルでなければ、
			return ;
		}

		var jsonArr = JSON.parse(e.target.result);
		var groupByKpArr = aggregteKp(jsonArr);	//キロポスト毎にaggregte(集計)

//		groupByKpArr[9]['46.8']['死骸処理']['イノシシ'].count =0;
//		groupByKpArr[9]['71.0']['死骸処理']['イノシシ'].count =2;
//		groupByKpArr[9]['71.0']['死骸処理']['シカ'].count =2;
//		groupByKpArr[9]['71.0']['落下物']['ゴミ'].count =0;
//		groupByKpArr[9]['71.0']['通報']['苦情'].count =0;

//		Object.keys(groupByKpArr[9]["71.0"]).length=3 ('死骸処理'、'落下物'、'通報')
//		Object.keys(groupByKpArr[9]["71.0"]['死骸処理']).length=2 ('シカ、'イノシシ')


		//var groupByKpEvntArr = aggregteKpEvnt(groupByKpArr);	//キロポスト毎にaggregte(集計)

		let eventKpArr =  new Array();//事象毎の集計後の同じkpの毎の件数を保存

		
///////////////////////////////////////////////////////////////////////////////////////////////
/////                                                                                           ///////
///// MakerWithLabel で、かっこいいラベルを作ろう！  /////// 
/////    cf:https://maps.multisoup.co.jp/blog/2579/                   ///////
///////////////////////////////////////////////////////////////////////////////////////////////

		//集計後のカウンター値に基づき、マーカーアイコンの数をセット
		//先ず、マーカー配列の全ての要素を削除
		deleteAllMakers(EventMarkerArr);
		let eventMarkerIcon;
		let eventType;
		let animalType;
		let offsetCount;//あるKPに置ける事象の数分オフセットする
		//groupByKpArr{9:{71.0:{ 死骸処理:{シカ:{},イノシシ{}} }}}
			eventKpArr[999] = 1; //ダミーデータをセット//nullだと↓のif (key in eventKpArr)でエラーが出る。
		$.each(groupByKpArr[9], function (kp, item) {//９号グループでループ、key=KP, item=事象内容
			offsetCount = 0;
			//同じKpに異なる事象グループがないか調べてオフセットをセットする。
			//let ofsetXY = 5 * eventKpArr[key]//同じKpに異なる事象が重なった場合のオフセットは5ドット×事象数
			$.each(item,function(eventType,subItem){//現在のキロポストの事象要素でループ(71.0kpだと死骸処理、落下物、通報)
				$.each(subItem,function(target,sub2Item){//現在の事象でループ(死骸処理だと、シカ、イノシシ)⇐ここから
					console.log('KP：'+kp+'　オフセットカウント：'+offsetCount+'　事象名：'+eventType+'　対象：'+target+' '+sub2Item.count+'件');
					//eventType = Object.keys(item)[0];//死骸処理、通報。。。
					switch (eventType) {
						case "死骸処理":
							//animalType = Object.keys(item["死骸処理"])[0];
							eventMarkerIcon = createAnimalMarkerIcon(item, eventType, target,offsetCount); //動物アイコンセット
							break;
						default:
							eventMarkerIcon = createDefaultMarkerIcon(item, eventType, target,offsetCount); //othersは、全てothers1.png
					}
					let latLngObj = getkp2LatLng(9, kp);//キロポストから緯度経度取得
					let latLng = new google.maps.LatLng(latLngObj.lat, latLngObj.lng);
					EventMarkerArr.push(new google.maps.Marker({
						map: MyMap,
						icon: eventMarkerIcon,
						position: latLng,
						zIndex: 999-offsetCount,//重ねて表示させるため、後のマーカーほど下になるようにする。
						title: 	kp+"kp"+" 事象名:" + eventType+ " 対象:" + target
					}));
					++offsetCount; 
				});
			});
		});
	};
 });

