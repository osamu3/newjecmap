var MyMap;
var Svs;
var Svp;
var MySocketIo = io.connect();
var LatLngLst; //緯度経度リスト　定義は、myLatLngLst.js にて
var CurrentKPListItem = "";//現在選択しているサイドメニューのKPリスト、初期値は空文字
var CurrentLat;//カレント緯度
var CurrentLng;//カレント経度

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

var EventMarker;//事象クリック時のイベント用のマーカー
var EventMarkerArr=[];//統計データ読み込み時のイベント用のマーカー配列

var InitLat = 35.29749372923729; // 緯度
var InitLng = 135.130990740549;// 経度

var AllEventData = [];//イベントデータ
var EventEditWindow;

var shikaIcon = {
	url:"images/shika.png",
	scaledSize:new google.maps.Size(30,30)
}
var inosisiIcon = {
	url:"images/inosisi.png",
	scaledSize:new google.maps.Size(30,20)
}
var animalSIcon = {
	url:"images/animalS.png",
	scaledSize:new google.maps.Size(30,20)
}
var accidentIcon = {//事故
	url:"images/accident.png",
	scaledSize:new google.maps.Size(40,25)
}
var reportIcon = {//通報
	url:"images/report.png",
	scaledSize:new google.maps.Size(20,15)
}
var fallingObjIcon = {//落とし物
	url:"images/object.png",
	scaledSize:new google.maps.Size(30,25)
}
var disasterIcon = {//災害
	url:"images/disaster.png",
	scaledSize:new google.maps.Size(30,30)
}
var claimIcon = {//苦情
	url:"images/claim.png",
	scaledSize:new google.maps.Size(20,30)
}
var othersIcon = {//その他
	url:"images/others.png",
	scaledSize:new google.maps.Size(20,30)
}
