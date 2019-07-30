$(function(){
	var map;
	map = new google.maps.Map(document.getElementById('mapCanvas'), { // #mapAreaに地図を埋め込む
		center: { // 地図の中心を指定
			lat: 34.7019399, // 緯度
			lng: 135.51002519999997 // 経度
		},
		zoom: 19 // 地図のズームを指定
	});
});
