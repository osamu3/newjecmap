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
	//ストリートビューのカメラの向きをセット
	Svp.setPov({ heading: LatLngLst[elm.id].heading, pitch: LatLngLst[elm.id].pitch, zoom: LatLngLst[elm.id].zoom })

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

function eventListClick(elm) {
	if (EventEditWindow != null) {//アップロード用の画面定義が一度でもされており、且つ
		if (!EventEditWindow.closed) {//アップロード用が閉じていなければ
			alert("アップロード用の画面を閉じて再実行して下さい。");
			return false;
		}
	}

	//アップロード用の子フォームを表示、ここで子フォームの幅や高さ、ツールバーの表示などを指定していることに注意
	EventEditWindow = window.open('/imgUploadForm', 'imgUploadForm', 'width=570, height=580, status=no, resizable=yes, scrollbars=yes, toolbar=no, menubar=no');
	$(EventEditWindow).on('load', function () {
		//以下、別ファンクションにまとめる。
		for (let itm of AllEventData) { //「AllEventData」はグローバル変数
			//全てのイベントデータから、今回クリックされた要素のIDと同じものであれば、アップロードフォームに転記する。
			if (itm.eventId == elm.id) {
/////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////                               /////////////////////////////////////////////////////
/////////////////                ING            /////////////////////////////////////////////////////
/////////////////                               /////////////////////////////////////////////////////
/////////////////↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓/////////////////////////////////////////////////////
				//既存のイベントマーカーを消してからマーカーを立てる。
				if (EventMarker != null) EventMarker.setMap(null);//いったん矢印マーカー削除
				EventMarker = new google.maps.Marker({
					map: MyMap,
					icon: shikaIcon
				});
				いんｇ　
				let latLng = {"lat": itm.HeadrLat, "lng": itm.HeadrLng}
				EventMarker.setPosition(latLng);←←←このlatLng定義ではエラーになる。
/////////////////↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑/////////////////////////////////////////////////////
/////////////////                               /////////////////////////////////////////////////////
/////////////////                ING            /////////////////////////////////////////////////////
/////////////////                               /////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////

				if (itm.HeadrCategory == "落下物") {
					$(EventEditWindow.document).find('#id_HdrCtgryRakkabutu')[0].checked = true;
					$(EventEditWindow.document).find('#id_HdrCtgryRakkabutu')[0].onchange();//チェックボックスが変化したときのイベントの強制呼出し。
				}
				if (itm.HeadrCategory == "事故") {
					$(EventEditWindow.document).find('#id_HdrCtgryJiko')[0].checked = true;
					$(EventEditWindow.document).find('#id_HdrCtgryJiko')[0].onchange();//チェックボックスが変化したときのイベントの強制呼出し。
				}
				if (itm.HeadrCategory == "災害") {
					$(EventEditWindow.document).find('#id_HdrCtgrySaigai')[0].checked = true;
					$(EventEditWindow.document).find('#id_HdrCtgrySaigai')[0].onchange();//チェックボックスが変化したときのイベントの強制呼出し。
				}
				if (itm.HeadrCategory == "苦情") {
					$(EventEditWindow.document).find('#id_HdrCtgryKujou')[0].checked = true;
					$(EventEditWindow.document).find('#id_HdrCtgryKujou')[0].onchange();//チェックボックスが変化したときのイベントの強制呼出し。
				}
				if (itm.HeadrCategory == "通報") {
					$(EventEditWindow.document).find('#id_HdrCtgryTuuhou')[0].checked = true;
					$(EventEditWindow.document).find('#id_HdrCtgryTuuhou')[0].onchange();//チェックボックスが変化したときのイベントの強制呼出し。
				}
				if (itm.HeadrCategory == "その他") {
					$(EventEditWindow.document).find('#id_HdrCtgrySonota')[0].checked = true;
					$(EventEditWindow.document).find('#id_HdrCtgrySonota')[0].onchange();//チェックボックスが変化したときのイベントの強制呼出し。
				}

				$(EventEditWindow.document).find('#eventId')[0].value = itm.eventId;
				$(EventEditWindow.document).find('#id_submitButton')[0].value = "上書き保存【実行】";//編集モードに設定
				$(EventEditWindow.document).find('#id_HeadrTarget')[0].value = itm.HeadrTarget;
				$(EventEditWindow.document).find('#id_HeadrAttender')[0].value = itm.HeadrAttender;
				$(EventEditWindow.document).find('#id_HeadrInformer')[0].value = itm.HeadrInformer;

				$(EventEditWindow.document).find('#id_HeadrYear')[0].value = itm.HeadrYear;
				$(EventEditWindow.document).find('#id_HeadrMonth')[0].value = itm.HeadrMonth;
				$(EventEditWindow.document).find('#id_HeadrDay')[0].value = itm.HeadrDay;
				$(EventEditWindow.document).find('#id_HeadrHour')[0].value = itm.HeadrHour;
				$(EventEditWindow.document).find('#id_HeadrMinute')[0].value = itm.HeadrMinute;

				$(EventEditWindow.document).find('#id_HeadrRoute')[0].value = itm.HeadrRoute;
				$(EventEditWindow.document).find('#id_HeadrCity')[0].value = itm.HeadrCity;
				$(EventEditWindow.document).find('#id_HeadrAddres')[0].value = itm.HeadrAddres;
				$(EventEditWindow.document).find('#id_HeadrKp')[0].value = itm.HeadrKp;
				$(EventEditWindow.document).find('#id_HeadrChisaki')[0].value = itm.HeadrChisaki;
				$(EventEditWindow.document).find('#id_HeadrLane')[0].value = itm.HeadrLane;

				$(EventEditWindow.document).find('#id_HeadrGaiyou')[0].value = itm.HeadrGaiyou;

				$(EventEditWindow.document).find('#id_HeadrLat')[0].value = itm.HeadrLat;
				$(EventEditWindow.document).find('#id_HeadrLng')[0].value = itm.HeadrLng;


				if (!Array.isArray(itm.HstryYear)) {//配列型でなければ、（※複数の履歴がある場合は、配列型になる）
					$(EventEditWindow.document).find('#id_Itm1Year')[0].value = itm.HstryYear;
					$(EventEditWindow.document).find('#id_Itm1Month')[0].value = itm.HstryMonth;
					$(EventEditWindow.document).find('#id_Itm1Day')[0].value = itm.HstryDay;
					$(EventEditWindow.document).find('#id_Itm1Hour')[0].value = itm.HstryHour;
					$(EventEditWindow.document).find('#id_Itm1Minute')[0].value = itm.HstryMinute;
					$(EventEditWindow.document).find('#id_Itm1Contents')[0].value = itm.HstryContents;
				} else {//配列型であれば（複数の履歴があれば
					let elmStr;	//検索する要素名
					//配列の個数回繰り返し
					for (let i = 1; i < itm.HstryYear.length + 1; i++) {
						elmStr = '#id_Itm' + i + 'Year';
						$(EventEditWindow.document).find(elmStr)[0].value = itm.HstryYear[i - 1];
						elmStr = '#id_Itm' + i + 'Month';
						$(EventEditWindow.document).find(elmStr)[0].value = itm.HstryMonth[i - 1];
						elmStr = '#id_Itm' + i + 'Day';
						$(EventEditWindow.document).find(elmStr)[0].value = itm.HstryDay[i - 1];
						elmStr = '#id_Itm' + i + 'Hour';
						$(EventEditWindow.document).find(elmStr)[0].value = itm.HstryHour[i - 1];
						elmStr = '#id_Itm' + i + 'Minute';
						$(EventEditWindow.document).find(elmStr)[0].value = itm.HstryMinute[i - 1];
						elmStr = '#id_Itm' + i + 'Contents';
						$(EventEditWindow.document).find(elmStr)[0].value = itm.HstryContents[i - 1];
						if (i < itm.HstryYear.length)//未だ配列の個数に達していなければ（次の配列があれば)
							$(EventEditWindow.document).find('#id_AddHstrBtn')[0].onclick();//履歴欄を追加するイベント駆動
					}
				}


				//画像が添付されていれば、ソケットでサーバーへ要求する。
				//画像添付欄は、９個まで作成済みである。
				if (itm.imgFiles) {//【imgFiles】要素があれば（画像があれば)
					if (!Array.isArray(itm.imgFiles.imgFileNames)) {//一個しかなければ(配列型でなければ)、（※複数の履歴がある場合は、配列型になる）
						//登録画像表示ボタンの『name』属性に画像ファイル名をセットする。
						$(EventEditWindow.document).find('#id_dispImgBtn1').attr("name", itm.imgFiles.imgFileNames);
					} else {
						for (let i = 1; i < itm.imgFiles.imgFileNames.length + 1; i++) {
							$(EventEditWindow.document).find('#id_dispImgBtn' + i.toString(10)).attr('name', itm.imgFiles.imgFileNames[i - 1]);
							//ファイル読み込みボタンは非表示にする。
							$(EventEditWindow.document).find('#id_tdUploadFileBtn' + i.toString(10)).css('display', 'none');
							if (i < itm.imgFiles.imgFileNames.length)//未だ配列の個数に達していなければ（次の配列があれば)
								$(EventEditWindow.document).find('#id_AddImgBtn')[0].onclick();//画像欄を追加するイベント駆動
						}
					}
				}
				//else {//配列型であれば（複数の履歴があれば
				//	let elmStr;	//検索する要素名
				//	//配列の個数回繰り返し
				//	for (let i = 1; i < itm.HstryYear.length + 1; i++) {
			}
			/*
							$(UpLoadWin.document).find('#id_HeadrInformer')[0].value = itm.HeadrInformer;
							$(UpLoadWin.document).find('#id_HeadrInformer')[0].value = itm.HeadrInformer;
							$(UpLoadWin.document).find('#id_HeadrInformer')[0].value = itm.HeadrInformer;
							$(UpLoadWin.document).find('#id_HeadrInformer')[0].value = itm.HeadrInformer;
							$(UpLoadWin.document).find('#id_HeadrInformer')[0].value = itm.HeadrInformer;
							$(UpLoadWin.document).find('#id_HeadrInformer')[0].value = itm.HeadrInformer;
							$(UpLoadWin.document).find('#id_HeadrInformer')[0].value = itm.HeadrInformer;
							$(UpLoadWin.document).find('#id_HeadrInformer')[0].value = itm.HeadrInformer;
							$(UpLoadWin.document).find('#id_HeadrInformer')[0].value = itm.HeadrInformer;
							$(UpLoadWin.document).find('#id_HeadrInformer')[0].value = itm.HeadrInformer;
							$(UpLoadWin.document).find('#id_HeadrInformer')[0].value = itm.HeadrInformer;
			*/

		}
	});
}

function dropDownMnClick(trget) {
	//bootstrapのフェード・エフェクトタブを使っての画面遷移がうまくいかなかったため、強制的に "active show"する。
	$('.tab-content').children('div').each(function () {//子要素を走査
		if ($(this).hasClass('tab-pane fade active show')) {//表示注のメニューがあれば消す
			$(this).removeClass('tab-pane fade active show').addClass('tab-pane fade');
		}
	})
	//クリックされたメニューを表示する
	$(trget).removeClass('tab-pane fade').addClass('tab-pane fade active show');
}

