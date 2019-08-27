var MyMap;
var Svs;
var Svp;
var MySocketIo = io.connect();
var LatLngLst; //緯度経度リスト　定義は、myLatLngLst.js にて
var CurrentKPListItem = "";//現在選択しているサイドメニューのKPリスト、初期値は空文字

//ペグマンアイコン定義
var ArrowAangle = 0;//カメラの角度
var ArrowIcon = {  //ストリートビューカメラの方向を示す矢印アイコン
	path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
	scale: 6,
	fillColor: "red",
	fillOpacity: 0.8,
	strokeWeight: 2,
	rotation: 90 //this is how to rotate the pointer
	//url: "images/pegman.png",
	//scaledSize:new google.maps.Size(19,19)			//scaledSize?:Size		リサイズ
};
//ペグマン定義
var ArrowMarker;

var InitLat = 35.29749372923729; // 緯度
var InitLng = 135.130990740549;// 経度

var AllEventData = [];//イベントデータ
var EventEditWindow;
