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
	CurrentKPListItem = elm;

	let latLng = new google.maps.LatLng(LatLngLst[elm.id].latlng.lat, LatLngLst[elm.id].latlng.lng);
	MyMap.panTo(latLng);
	Svp.setPosition(latLng);//ストリートビューも連動

	if (ArrowMarker != null) ArrowMarker.setMap(null);//いったん矢印マーカー削除
	//Pegman = L.marker(LatLngLst[elm.id].latlng, { icon: PegmanIcon, rotationAngle: LatLngLst[elm.id].heading, zIndexOffset: 999 }).bindPopup("マーカーをクリックしました。").addTo(map);//選択したリストに対応するペグマンをセット
	//map_pan(elm.id);//ファンクションに渡されたデータオブジェクトは、【e.data.sUid】で参照できる。
	ArrowMarker = new google.maps.Marker({//ストリートビューカメラの位置と方角を表すマーカー
		map: MyMap,
		icon: ArrowIcon
	});
	ArrowMarker.setPosition(latLng);
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

function openImgUploadForm() {
	var queryStr = '?' + $('#currentLatTag')[0].innerText + '&' + $('#currentLngTag')[0].innerText;
	//アップロード用の子フォームを表示、ここで子フォームの幅や高さ、ツールバーの表示などを指定していることに注意
	UpLoadWin = window.open('/imgUploadForm' + queryStr, 'imgUploadForm', 'width=600, height=580, status=no, resizable=yes, scrollbars=yes, toolbar=no, menubar=no');

	/*
	var marker01 = L.marker([svp.getLocation().latLng.lat(), svp.getLocation().latLng.lng()], {
		title: "マーカー",
		draggable: true
	}).addTo(map);
	marker01.bindPopup("<b>事象登録ポイント</b><br>一時マーカー<br>");
	*/

	/*	
		//子フォームが閉じたときに発火
		$(UpLoadWin).on('unload', function () {//子フォームが閉じた時点でも、UpLoadWin.$("#id_HeadLat")…が使えるので使っているが、、、
			setTimeout(function () {
				if (!UpLoadWin.closed) return;
	
				alert("子フォームが閉じられました");
				//オープン時にも呼び出されるので(？)、UpLoadWin.$("#id_HeadLat")[0].valueがヌルであれば何もせずリターンする
				//var marker01 = L.marker([UpLoadWin.$("#id_HeadrLat")[0].value, UpLoadWin.$("#id_HeadrLng")[0].value], {
				var marker01 = L.marker([svp.getLocation().latLng.lat(), svp.getLocation().latLng.lng()], {
					title: UpLoadWin.$("#id_HeadrTarget")[0].value, //'落木現場',
					draggable: true
				}).addTo(map);
				marker01.bindPopup("<b>現場写真</b><br>H30年3月11日<br><img src='photo/DSC_0672.JPG' width=200 height=112 alt=''><img src='photo/DSC_0676.JPG' width=200 height=112 alt=''>");
			}, 100);
		});
	*/
}

function eventListClick() {
	alert('EVENT栗生');
}

function dropDownMnClick(trget) {
	//bootstrapのフェード・エフェクトタブを使っての画面遷移がうまくいかなかったため、強制的に "active show"する。
	$('.tab-content').children('div').each(function () {
		//alert($(this).attr("class"));
		if ($(this).hasClass('tab-pane fade active show')) {
			$(this).removeClass('tab-pane fade active show').addClass('tab-pane fade');
		}
	})

	$(trget).removeClass('tab-pane fade').addClass('tab-pane fade active show');
}

