$(function () {
	MyMap = new google.maps.Map(document.getElementById('mapCanvas'), { // #mapAreaに地図を埋め込む
		center: { // 地図の中心を指定
			lat: 35.29749372923729, // 緯度
			lng: 135.130990740549 // 経度
		},
		zoom: 15 // 地図のズームを指定
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
		});
		//地図右クリックイベント定義
		google.maps.event.addListener(MyMap, 'rightclick', mapClick2PanEventFn);
});

//地図を右クリック時に発火、クリック位置へ移動
function mapClick2PanEventFn(e) {
	let latLng = new google.maps.LatLng(e.latLng.lat(), e.latLng.lng());
	MyMap.panTo(latLng);
	Svp.setPosition(latLng);//ストリートビューを元に戻す
}
