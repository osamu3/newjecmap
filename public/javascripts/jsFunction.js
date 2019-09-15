//kpから緯度経度求める
function getkp2LatLng(route,kp ) {
	let floatNmKp = parseFloat(kp); //文字列を浮動小数点数値に変換
	floatNmKp = Math.round(floatNmKp * 10) / 10 // 小数点1桁で四捨五入   ex)123.45→123.5

	if (route = 9) {
		return R9Kp100mPich[floatNmKp.toFixed(1)];//「toFixed」は、70.15 → 70.1  , 70 →70.0にする（小数点第１位まで０(ゼロ)でも表示）
  }
  if (route = 27) {
    return R27Kp100mPich[floatNmKp.toFixed(1)];
  }
}

//一番近いkpを求め、その号線番号とKPをトップ画面に表示
function setNearKp(lat, lng) {
  let nearRangeXY; //クリック位置とKp位置の離隔(緯度経度)
  let nearKp; //最も近いkp
  let nearKpRute; //最も近い号線

  let nearRangeXYTmp = 99999;
  let tmpRng;

  Object.keys(R9Kp100mPich).forEach(function(key) {
    tmpRng = Math.sqrt(
      Math.pow(lat - R9Kp100mPich[key].lat, 2) +
        Math.pow(lng - R9Kp100mPich[key].lng, 2)
    );
    if (tmpRng < nearRangeXYTmp) {
      nearRangeXYTmp = tmpRng;
      nearKp = key;
      nearKpRute = 9;
    }
  });

  Object.keys(R27Kp100mPich).forEach(function(key) {
    tmpRng = Math.sqrt(
      Math.pow(lat - R27Kp100mPich[key].lat, 2) +
        Math.pow(lng - R27Kp100mPich[key].lng, 2)
    );
    if (tmpRng < nearRangeXYTmp) {
      nearRangeXYTmp = tmpRng;
      nearKp = key;
      nearKpRute = 27;
    }
  });
  //alert("kp:" + nearKp + " Route:" + nearKpRute + " 距離:" + nearRangeXYTmp);

  if (nearRangeXYTmp < 0.00055) {
    //クリック位置と最寄りの100mピッチKpとの離隔が約60m以内であれば
    $("#route").html(nearKpRute);
    $("#kp").html(nearKp);
  } else {
    $("#route").html("？");
    $("#kp").html("？");
  }
}

//緯度経度住所に変換後、画面の住所タブに書き込む。戻り値なし
function latLng2AddressFn(latLng) {
  var geocoder = new google.maps.Geocoder();
  // geocodeリクエストを実行。
  // 第１引数はGeocoderRequest。緯度経度⇒住所の変換時はlatLngプロパティを入れればOK。
  // 第２引数はコールバック関数。
  geocoder.geocode(
    {
      latLng: latLng
    },
    function(results, status) {
      if (status === "OK" && results[0]) {
        //status を確認して処理開始
        //// 住所コンポーネントを取得
        var adrCmp = results[0].address_components;
        //住所コンポーネント配列長が5以上の時
        if (adrCmp.length > 5) {
          var i;
          for (i = 0; i < adrCmp.length; i++) {
            if (
              adrCmp[i].short_name.match(
                /^(舞鶴市|綾部市|福知山市|京丹波町)$/
              ) != null
            ) {
              switch (i) {
                case 2:
                  $("#city").html(adrCmp[2].short_name);
                  $("#address").html(adrCmp[1].short_name);
                  break;
                case 3:
                  $("#city").html(adrCmp[3].short_name);
                  $("#address").html(
                    adrCmp[2].short_name + adrCmp[1].short_name
                  );
                  break;
                case 4:
                  $("#city").html(adrCmp[4].short_name);
                  $("#address").html(
                    adrCmp[3].short_name +
                      adrCmp[2].short_name +
                      adrCmp[1].short_name
                  );
                  break;
                case 5:
                  $("#city").html(adrCmp[5].short_name);
                  $("#address").html(
                    adrCmp[4].short_name +
                      adrCmp[3].short_name +
                      adrCmp[2].short_name +
                      adrCmp[1].short_name
                  );
                  break;
                default:
                  $("#city").html("？");
                  $("#address").html("？");
              }
              break;
            }
          }
        } else {
          $("#city").html("？");
          $("#address").html("？");
        }
      } else {
        $("#city").html("？");
        $("#address").html("？");
        console.log("緯度経度→住所変更に失敗しました。理由: " + status);
      }
    }
  );
}

//ストリートビューカメラ回転時に発火
function svpCameraRotaitionEventFn() {
  //カメラの向きを取得
  ArrowIcon.rotation = Svp.pov.heading;
  //現在のマーカの緯度経度を取得
  latLng = ArrowMarker.getPosition();
  //一旦矢印マーカー（ペグマン）を削除後新たにセット
  ArrowMarker.setMap(null);
  ArrowMarker = new google.maps.Marker({
    //ストリートビューカメラの位置と方角を表すマーカー
    map: MyMap,
    icon: ArrowIcon,
    position: latLng
  });
}

//カメラ移動時
function svpCameraMoveEventFn() {
  //緯度経度を表示
  //$("#currentLatTag")[0].innerText = Svp.getLocation().latLng.lat();//現在位置を表示
  //$("#currentLngTag")[0].innerText = Svp.getLocation().latLng.lng();
  let latLng = new google.maps.LatLng(
    Svp.getLocation().latLng.lat(),
    Svp.getLocation().latLng.lng()
  );
  //住所を表示
  latLng2AddressFn(latLng);
  //最寄りの100mピッチKpと号線を表示
  setNearKp(latLng.lat(), latLng.lng());
  //一旦矢印マーカー（ペグマン）を削除後新たにセット
  ArrowMarker.setMap(null);
  ArrowMarker = new google.maps.Marker({
    //ストリートビューカメラの位置と方角を表すマーカー
    map: MyMap,
    icon: ArrowIcon,
    position: latLng
  });
}

//マーカー配列中のマーカーを削除し、配列を開放する。
function deleteAllMakers(markers) {
	//生成済マーカーを順次すべて削除する
	for (var i = 0; i < markers.length; i++) {
		markers[i].setMap(null);
	}
	markers = [];	//参照を開放
}

//事象のターゲットに応じたアイコンを返す
function getEventMarkerIcon(target) {
	switch (target) {
		case "落下物":
			return fallingObjIcon;
			break;
		case "事故":
			return accidentIcon;
			break;
		case "災害":
			return disasterIcon;
			break;
		case "苦情":
			return claimIcon;
			break;
		case "動物死骸":
			return animalSIcon;
			break;
		case "通報":
			return notificationIcon;
			break;
		case "その他":
			return notification;
			break;
		default:
			return null;
	}
}