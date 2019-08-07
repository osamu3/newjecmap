//緯度経度リストがクリックされた時に発火
function listClick(elm) {
	//訪問済みリンクの色を変える？
	if (CurrentKPListItem != "") {//直前にクリックしていたキロリストポイントの、スタイルを元に戻す。
		//CurrentKPListItem.style.backgroundColor = '#ffffff';
		CurrentKPListItem.style.color = 'black';
	}
	//elm.style.backgroundColor = '#ccccca';
	//elm.style.fontWeight = 'bold';
	elm.style.color = 'orangered';
	CurrentKPListItem  = elm;

	let latLng = new google.maps.LatLng(LatLngLst[elm.id].latlng.lat, LatLngLst[elm.id].latlng.lng);
	MyMap.panTo(latLng);
	Svp.setPosition(latLng);//ストリートビューも連動



	if (Pegman != null) map.removeLayer(Pegman);//既存のペグマンがいれば、それを削除
	Pegman = L.marker(LatLngLst[elm.id].latlng, { icon: PegmanIcon, rotationAngle: LatLngLst[elm.id].heading, zIndexOffset: 999 }).bindPopup("マーカーをクリックしました。").addTo(map);//選択したリストに対応するペグマンをセット
	map_pan(elm.id);//ファンクションに渡されたデータオブジェクトは、【e.data.sUid】で参照できる。
}

//地図を右クリック時に発火、クリック位置へ移動
function mapClick2PanEventFn(e) {
	let latLng = new google.maps.LatLng(e.latLng.lat(), e.latLng.lng());
	MyMap.panTo(latLng);
	Svp.setPosition(latLng);//ストリートビューも連動

	//一旦矢印マーカーを削除後新たにセット
	ArrowMarker.setMap(null);
	ArrowMarker = new google.maps.Marker({//ストリートビューカメラの位置と方角を表すマーカー
		map: MyMap,
		icon: ArrowIcon
	});
	ArrowMarker.setPosition(latLng);
}

//ストリートビューカメラ回転時に発火
function svpCameraRotaitionEventFn() {
	//カメラの向きを取得
	ArrowIcon.rotation = Svp.pov.heading;
	//現在のマーカの緯度経度を取得
	latLng = ArrowMarker.getPosition();
	//一旦矢印マーカーを削除後新たにセット
	ArrowMarker.setMap(null);
	ArrowMarker = new google.maps.Marker({//ストリートビューカメラの位置と方角を表すマーカー
		map: MyMap,
		icon: ArrowIcon
	});
	ArrowMarker.setPosition(latLng);//緯度経度をセット
}

function svpCameraMoveEventFn() {
	//$("#currentLatTag")[0].innerText = svp.getLocation().latLng.lat();//現在位置を表示
	//$("#currentLngTag")[0].innerText = svp.getLocation().latLng.lng();
}


//イニシャル時に、ニューしてボタンクリックでいどうしてみては？
//switch (e.originalEvent.button) {
	//case 2: //右ボタンクリックでペグマン(カメラ)セット
		//if (Pegman != null) map.removeLayer(Pegman);//既存のペグマン(カメラ)がいれば、それを削除
		//ペグマン追加

		//Pegman = L.marker(
		//	{ lat: svp.getLocation().latLng.lat(), lng: svp.getLocation().latLng.lng() },
		//	{ icon: PegmanIcon, zIndexOffset: 999 }
		//).addEventListener("click", pegmanClickEvnt, false).addTo(map);//選択したリストに対応するペグマンをセット

	//break;




