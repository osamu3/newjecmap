$(function () {
	MyMap = new google.maps.Map(document.getElementById('mapCanvas'), { // #mapAreaに地図を埋め込む
		center: { // 地図の中心を指定
			lat: InitLat, // 緯度
			lng: InitLng // 経度
		},
		zoom: 15,// 地図のズームを指定
		streetViewControl:  false //ペグマンを非表示
	});

	Svs = new google.maps.StreetViewService();
	Svp = new google.maps.StreetViewPanorama(
		document.getElementById("strtVwCanvas"),
		{//ストリートビューに表示する各種コントロールの指定
			addressControl: true,
			addressControlOptions: "BOTTOM_RIGHT",
			clickToGo: true, //移動
			disableDoubleClickZoom: true,
			imageDateControl: true,		//撮影日の表示
			enableCloseButton: false,	//閉じるボタンの表示
			linksControl: true,
			panControl: true,
			scrollwheel: true,
			visible: true,
			zoomControl: true,
			//fullscreenControl: true, //全画面ビューへのコントロールを表示
			//fullscreenControlOptions: { //↓表示されない
			//	position: google.maps.ControlPosition.TOP_CENTER ,
			//} ,
			position: MyMap.getCenter()
		}
	);
		//ペグマン初期表示
	ArrowIcon.rotation = 0;//ストリートビューカメラが向いている方角を示す矢印
	ArrowMarker = new google.maps.Marker({//ストリートビューカメラの位置と方角を表す矢印マーカー
		position:  new google.maps.LatLng( 	InitLat, InitLng ),
		map: MyMap,
		icon: ArrowIcon
	});
	
	//地図右クリックイベント定義
	google.maps.event.addListener(MyMap, 'rightclick', mapClick2PanEventFn);

	//svp.setPov({ heading: 0, pitch: 0, zoom: 0 });
	//ストリートビューパノラマ画像のイベントセット
	Svp.addListener('pov_changed', svpCameraRotaitionEventFn); //向きが変わった
	Svp.addListener('position_changed', svpCameraMoveEventFn);//{//パノラマ画像の基本（LatLng）位置が変更された
});