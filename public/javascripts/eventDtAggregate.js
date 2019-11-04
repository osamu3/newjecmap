//キロポスト毎に事象をaggregte(集計)
 function aggregteKp(jsonArr) {
	let groupByKpArr = {
		"9": {},
		"27": {}
	};

	for (let item in jsonArr) {
		let route = jsonArr[item]["号"];
		let kp = jsonArr[item]["KP"];
		let evnt = jsonArr[item]["事象"];
		let target = jsonArr[item]["対象"];

		//事象とkpでインクリメント
		//↓テクニック！　cf: http://nakawake.net/?p=831 //配列アイテムをセットしてからでないと count++できない(プロパティーが見つかりませんエラー)
		if (kp in groupByKpArr[route]) {
			//この連想配列(号線)に既に同じkpがあれば
			if (evnt in groupByKpArr[route][kp]) {
				//この連想配列に既登録のevntがあれば(死骸処理、落下物...)
				if (target in groupByKpArr[route][kp][evnt]) {
					//この連想配列に既登録のtargetがあれば(シカ、イノシシ、...)
					groupByKpArr[route][kp][evnt][target].count++;
				} else {
					//targetが未登録であれば
					groupByKpArr[route][kp][evnt][target] = { count: 0 };
				}
			} else {
				//既登録のevntがなければ
				groupByKpArr[route][kp][evnt] = { [target]: { count: 0 } };
			}
		} else {
			//同じkpがなければ
			groupByKpArr[route][kp] = { [evnt]: { [target]: { count: 0 } } };
		}
	}
	return groupByKpArr;
}

function createAnimalMarkerIcon(item, eventType, animalType,offsetCount) {//同じkpに異なる事象があるときはオフセットする
	let eventMarkerIcon;
	let counterStrings;//同一KPにおける事象発生件数（文字列）
	if (item[eventType][animalType].count <10){
		counterStrings = String(item[eventType][animalType].count + 1);
	}else{
		counterStrings = "P";
	}

	switch (animalType) {
		case "イノシシ":
			eventMarkerIcon = {
				url:"images/inosisi" + counterStrings + ".png",
				scaledSize: new google.maps.Size(35, 35),
				origin: new google.maps.Point(0, 0), //画像描画位置（0,0=>左下) //原点
				anchor: new google.maps.Point(0 - (offsetCount*15), 35 + (offsetCount*15)) //マーカ位置と画像の接する点
			};
			break;
		case "シカ":
			eventMarkerIcon = {
				url:"images/shika" + counterStrings + ".png",
				scaledSize: new google.maps.Size(35, 35),
				origin: new google.maps.Point(0, 0), //原点
				anchor: new google.maps.Point(0 - (offsetCount*15), 35 + (offsetCount*15)) //マーカ位置と画像の接する点
			};
			break;
		case "小動物":
			eventMarkerIcon = {
				url:"images/animal" + counterStrings + ".png",
				scaledSize: new google.maps.Size(35, 35),
				origin: new google.maps.Point(0, 0), //原点
				anchor: new google.maps.Point(0 - (offsetCount*15), 35 + (offsetCount*15)) //マーカ位置と画像の接する点
			};
			break;
		default:
			//othersは、全てothers.png
			eventMarkerIcon = {
				url: "images/others.png",
				scaledSize: new google.maps.Size(35, 35),
				//原点
				origin: new google.maps.Point(0, 0),
				//マーカ位置と画像の接する点
				anchor: new google.maps.Point(0 - (offsetCount*15), 35 + (offsetCount*15))
			};
	}
	return eventMarkerIcon;
}

function createDefaultMarkerIcon(item, eventType, animalType,offsetCount) {//同じkpに異なる事象があるときはオフセットする
	return {
		url: "images/request9.png",
		scaledSize: new google.maps.Size(35, 35),
		origin: new google.maps.Point(0, 0),
		//マーカ位置と画像の接する点
		anchor: new google.maps.Point(0 - (offsetCount*15), 35 + (offsetCount*15))
	};
}

//キロポスト毎にaggregte(集計)
function groupByKpEvntArr(kpEvntArr){
return null;
}

