var socket = io.connect();
var AllEventData = [];
var RequestImgShowTagId = 0;//サーバーへ画像送信要求時の画像表示タグ位置(Id=タグ番号)
$(function () {
    //サーバーへ全てのイベントファイルのデータ送信を依頼
    socket.emit('CC2S:sendRequestEventFilesData');

    //==========socketIO(サーバーからメッセージが届いた時に発火）=========================
    socket.on('S2CC:sendBase64ImgData', function (data) {
        let thumbnailId = '#thumbnail' + RequestImgShowTagId.toString(10);
        RequestImgShowTagId = 0;

        ////画像読み込み完了イベントで、画像縮尺調整　（高さ100に合わせて横幅調整//////////////////////////////////////////////////////////////////////////////////
        $(thumbnailId).on('load', function () {　//cf:https://blog.emwai.jp/javascript/img-load-not-working/ 、 https://ja.stackoverflow.com/questions/27850/%E7%94%BB%E5%83%8F%E8%AA%AD%E3%81%BF%E8%BE%BC%E3%81%BF%E3%82%92%E5%BE%85%E3%81%A3%E3%81%A6%E5%87%A6%E7%90%86%E3%81%97%E3%81%9F%E3%81%84
            this.height = this.naturalHeight * this.width / this.naturalWidth;  //元のサイズは「natural」
        });

        $(thumbnailId).attr({
            //一旦、高さ100×幅でフォルトで読み込んでから、『$(thumbnailId).on('load', function(){…』　イベントで縦横比を調整。
            src: data, //画面に表示
            width: $('#tr_Head')[0].cells[0].clientWidth + $('#tr_Head')[0].cells[1].clientWidth,
            height: "100"
        });
    });
    //受信
    socket.on("S2CC:sendAllEventData", function (allEvntDt) {
        AllEventData = [];//一旦データクリア
        for (let itm of allEvntDt) {//イベントデータを一つづつ取り出す。 itmはJSonStrings
            itm = itm.replace(/\\/g, "\\\\");//サーバー側のデータ中の画像ファイルへのパスに"\"が含まれており、JSON.parseでエラーになるため
            itm = JSON.parse(itm);//JSオブジェクト配列に変換
            AllEventData.push(itm);// 
        }
    });
    //serverエラー受信
    socket.on("S2CC:ErrNoSuchFile", function (errStr) {
        alert("写真(" + errStr + ")は、サーバーに登録されていません。");
    });
});

function dispImgBtnClck(imgNm, elmId) {
    console.log('L40');
    if (elmId > 0 && elmId < 10) {//elmIdは、1以上9以下の筈、画像は９個まで
        //グローバル変数でクリックされた要素番号を保持しておき、ソケット受信時にその番号を利用する。
        RequestImgShowTagId = elmId;//こんな事せずに、ソケット受信時のパラメータに、どのリクエストに対する回答を入れて返すのが筋	
        //ソケットでサーバーへ画像送信依頼
        socket.emit('CC2S:sendRequestImgData', imgNm, elmId);
    }
}

var InsertImgRowBaseId = 8;//起点：添付１のテーブル内の行番号
function setCategory(tagId) {
    var opt;
    switch ($('input[type="radio"]:checked')[0].value) {
        case '落下物':
            opt = '<option value="" disabled selected style="display:none;">(対象案件を選択)</option>';
            opt += '<option value="車両部品">車両部品</option>';
            opt += '<option value="輸送荷物">輸送荷物</option>';
            opt += '<option value="落石倒木">落石倒木</option>';
            opt += '<option value="道路構造物">道路構造物</option>';
            opt += '<option value="ゴミ">ゴミ</option>';
            opt += '<option value="その他">その他</option>';
            $(tagId)[0].innerHTML = opt;
            break;
        case '事故':
            opt = '<option value="" disabled selected style="display:none;">(対象案件を選択)</option>';
            opt += '<option value="現場処理">現場処理</option>';
            opt += '<option value="油漏れ処理">油漏れ処理</option>';
            opt += '<option value="路面清掃">路面清掃</option>';
            opt += '<option value="構造物損傷">構造物損傷</option>';
            opt += '<option value="状況確認">状況確認</option>';
            opt += '<option value="その他">その他</option>';
            $(tagId)[0].innerHTML = opt;
            break;
        case '災害':
            opt = '<option value="" disabled selected style="display:none;">(対象案件を選択)</option>';
            opt += '<option value="土砂災害">土砂災害</option>';
            opt += '<option value="道路冠水">道路冠水</option>';
            opt += '<option value="構造物損壊">構造物損壊</option>';
            opt += '<option value="その他">その他</option>';
            $(tagId)[0].innerHTML = opt;
            break;
        case '動物死骸':
            opt = '<option value="" disabled selected style="display:none;">(対象案件を選択)</option>';
            opt += '<option value="シカ">シカ</option>';
            opt += '<option value="イノシシ">イノシシ</option>';
            opt += '<option value="小動物">小動物</option>';
            opt += '<option value="その他">その他</option>';
            opt += '<option value="不明">不明</option>';
            $(tagId)[0].innerHTML = opt;
            break;
        case '苦情':
            opt = '<option value="" disabled selected style="display:none;">(対象案件を選択)</option>';
            opt += '<option value="工事関係">工事関係</option>';
            opt += '<option value="交通規制">交通規制</option>';
            opt += '<option value="維持管理">維持管理</option>';
            opt += '<option value="要望">要望</option>';
            opt += '<option value="その他">その他</option>';
            $(tagId)[0].innerHTML = opt;
            break;
        case '通報':
            opt = '<option value="" disabled selected style="display:none;">(対象案件を選択)</option>';
            opt += '<option value="工事関係">工事関係</option>';
            opt += '<option value="交通規制">交通規制</option>';
            opt += '<option value="維持管理">維持管理</option>';
            opt += '<option value="情報提供">情報提供</option>';
            opt += '<option value="その他">その他</option>';
            $(tagId)[0].innerHTML = opt;
            break;
        case 'その他':
            opt = '<option value="その他">その他</option>';
            $(tagId)[0].innerHTML = opt;
            break;
    }
}

function delThisDataFn() {
    alert("【注意！！】このデータを消します。\n『ハイ』を押すと登録してある特記事象リストから削除します。");
}

//アップロードイベントの前処理
function submitFormFn() {
    alert($(form1)[0].submitButton.value);

    if ($(form1)[0].HeadrCategory.value == "") {
        alert("事象種別が入力されていません。");
        return false;//呼び出し側へ戻ってから処理を中止(post注止)
    }
    if ($(form1)[0].HeadrTarget.value == "") {
        alert("対象案件が入力されていません。");
        return false;//呼び出し側へ戻ってから処理を中止(post注止)
    }
    if ($(form1)[0].HeadrAttender.value == "") {
        alert("処理対応者が入力されていません。");
        return false;//呼び出し側へ戻ってから処理を中止(post注止)
    }
    if ($(form1)[0].HeadrInformer.value == "") {
        alert("通報者が入力されていません。");
        return false;//呼び出し側へ戻ってから処理を中止(post注止)
    }
    /////////////////////////////////////////
    //その他、住所、キロポス、概要、内容、発生時分などをチェックする
    ////////////////////////////////////////
    //参考：親画面（子画面の呼び出し元）にデータを渡す方法 JQueryの使い方に若干のKwhwあり、window.opener.$(…
    window.opener.$('#ulListEvnt-1').append('<a><li class="evntList" id="' + "取りあえず" + '" onClick=alert("別ウィンドウで事象を表示")>' + "事象ファイルＩＤ" + '</li></a>')
    //↑は、ソケットでやる方法もあるが、こっちのほうが簡単	
    //送信データをユニーク化するため、送信ボタン(事象登録実行)のタイトルを、現在の時分秒ミリ秒にして、ポストする。
    if ($(form1)[0].eventId.value == 0) $(form1)[0].eventId.value = Date.now();//value!=0 then 編集上書きモード

    //ボタンのタイトルが事象登録【実行】でなければ
    if ($(form1)[0].submitButton.value != "事象登録【実行】") {
        alert("Now programming");
        return false;
    }
    //alert("ちょっと待った！");
    //return false;
    return true;//呼び出し側へ戻ってから処理を続行(post実行)
}

function addImgBtn() {//添付画像登録ボタンを追加
    //事象記載領域への追加
    var table = document.getElementById("EventTblAttachedPhoto");// テーブルの要素取得
    var addImgItemNo = $(".imgCls").length + 1;//追加する画像番号：現在添付されている画像の数＋１をセット

    if (addImgItemNo > 9) {
        alert('添付できる画像は、９枚までです。');
        return;
    }


    // 指定行に１行目挿入 //指定する行は、履歴欄の行数-1を指定
    var tr1 = table.insertRow(table.rows.length - 1);
    //var tr1 = table.insertRow(-1);// 行指定業に挿入
    tr1.setAttribute('bgcolor', '#cbdcee');
    // セルを２つ挿入、0で先頭、-1で後ろに挿入
    var td1 = tr1.insertCell(-1), td2 = tr1.insertCell(-1), td3 = tr1.insertCell(-1);
    td1.className = 'imgCls';//追加したセルにクラス名を付加
    //td2.setAttribute({'colspan':'4','id=':'id_tdUploadFileBtn','style':'display: block'});
    //JQeryだと、一度にセットできるのだが、、、$(TAG).attr({aa:xx,bb:yy})
    td2.setAttribute('colspan', '4');
    td2.setAttribute('id', 'id_tdUploadFileBtn' + addImgItemNo.toString(10));
    td2.setAttribute('style', 'display: block');

    td3.setAttribute('colspan', '2');

    // 挿入するHTML文字列作成 半角数値を文字列にする(全角０の文字コード＋Id)
    var tdStr1 = '<b>添　付' + String.fromCharCode('０'.charCodeAt(0) + addImgItemNo) + '： </b>';

    var tdStr2 = '<input type="file" name="eventPhoto" class="upLoadFile" id="upLoadFile' + addImgItemNo + '" accept="image/*" onchange="imgFileInputOnChang(this)">';
    var tdStr3 = '<input type="button" name="" id="id_dispImgBtn' + addImgItemNo.toString(10) + '" value="登録画像表示" onclick="dispImgBtnClck(name,' + addImgItemNo.toString(10) + ')">';
    // セルへ要素を挿入する
    td1.innerHTML = tdStr1; td2.innerHTML = tdStr2; td3.innerHTML = tdStr3;


    //画像表示領域への追加 ← 動的追加は止めた、HTMLで９個定義定義
    //var td3 = $('#rowThumbnail')[0].insertCell(-1);//サムネイル行にセルを追加
    //td3.setAttribute('colspan','2');
    //td3.innerHTML = '<div><img id="thumbnail'+ addImgItemNo +'" src="" ></div></td>';
}

function addHistoryCls() {

    var HistoryAddItmNo = $(".historyCls").length + 1;//現在の最終の経過の番号＋１をセット
    //経過を一つ増やす
    var this_day, this_month, this_year, today;
    today = new Date();
    this_year = today.getFullYear();
    this_month = today.getMonth() + 1;
    this_day = today.getDate();

    // テーブルの要素取得
    var table = document.getElementById("EventTblHistory");
    // 指定行に１行目挿入 //指定する行は、履歴欄の行数-1を指定
    var tr1 = table.insertRow($("#EventTblHistory")[0].rows.length - 1);
    tr1.setAttribute('bgcolor', '#dbf0ce');
    // セルを７つ挿入、0で先頭、-1で後ろに挿入　７つ目は数合わせ
    var td1 = tr1.insertCell(-1), td2 = tr1.insertCell(-1), td3 = tr1.insertCell(-1), td4 = tr1.insertCell(-1), td5 = tr1.insertCell(-1), td6 = tr1.insertCell(-1); td7 = tr1.insertCell(-1);
    td1.className = 'historyCls';//追加したセルにクラス名を付加

    // 挿入するHTML文字列作成 半角数値を文字列にする(全角１の文字コード＋Id):Tips
    var tdStr1 = '<b>経　過' + String.fromCharCode('０'.charCodeAt(0) + HistoryAddItmNo) + '： </b>';
    //HistoryAddItmNo++; //追加に伴うIdインクリメント
    var tdStr2 = '<select name="HstryYear" id="id_Itm' + HistoryAddItmNo.toString(10) + 'Year"></select>年',
        tdStr3 = '<select name="HstryMonth" id="id_Itm' + HistoryAddItmNo.toString(10) + 'Month"></select>月',
        tdStr4 = '<select name="HstryDay" id="id_Itm' + HistoryAddItmNo.toString(10) + 'Day"></select>日',
        tdStr5 = '<select name="HstryHour" id="id_Itm' + HistoryAddItmNo.toString(10) + 'Hour"></select>時',
        tdStr6 = '<select name="HstryMinute" id="id_Itm' + HistoryAddItmNo.toString(10) + 'Minute"></select>分';
    // セルへ要素を挿入する
    td1.innerHTML = tdStr1; td2.innerHTML = tdStr2; td3.innerHTML = tdStr3; td4.innerHTML = tdStr4; td5.innerHTML = tdStr5; td6.innerHTML = tdStr6;
    //alert(InsertRowBaseId + (HistoryAddItmNo * 2 - 2));

    // 指定行に２行目挿入　//指定する行は、履歴欄の行数-1を指定
    var tr2 = table.insertRow($("#EventTblHistory")[0].rows.length - 1);
    tr2.setAttribute('bgcolor', '#dbf0ce');
    var td7 = tr2.insertCell(-1), td8 = tr2.insertCell(-1);
    td7.align = "center";
    td7.style = "font-size:15px";
    td8.setAttribute('colspan', '6');

    var tdStr7 = '内　容', tdStr8 = '<textarea name="HstryContents" id="id_Itm' + HistoryAddItmNo.toString(10) + 'Contents" cols="52" rows="3" wrap="hard" value="" placeholder="(内容を入力)"></textarea>';

    td7.innerHTML = tdStr7; td8.innerHTML = tdStr8;

    //セレクトタグのオプション(選択項目)をセット
    optionSetNumeric(2010, this_year, 'id_Itm' + HistoryAddItmNo.toString(10) + 'Year', this_year);
    optionSetNumeric(1, 12, 'id_Itm' + HistoryAddItmNo.toString(10) + 'Month', this_month);
    optionSetNumeric(1, 31, 'id_Itm' + HistoryAddItmNo.toString(10) + 'Day', this_day);
    optionSetNumeric(0, 23, 'id_Itm' + HistoryAddItmNo.toString(10) + 'Hour', 12);
    optionSetNumeric(0, 59, 'id_Itm' + HistoryAddItmNo.toString(10) + 'Minute', 30);
};

//セレクトタグオプションセット（スタート数字、終了数字、表示id名、デフォルト数字）
function optionSetNumeric(start, end, tagId, defaultVal) {
    var optVal, opt;
    opt = null;
    for (optVal = start; optVal <= end; optVal++) {
        if (optVal === defaultVal) {
            opt += "<option value='" + optVal + "' selected>" + optVal + "</option>";
        } else {
            opt += "<option value='" + optVal + "'>" + optVal + "</option>";
        }
    }
    document.getElementById(tagId).innerHTML = opt;
};

function optionSetString(itmArr, tagId, defaultVal) {
    var optVal, opt;
    opt = null;
    itmArr.forEach(function (optVal) {
        if (optVal === defaultVal) {
            opt += "<option value='" + optVal + "' selected>" + optVal + "</option>";
        } else {
            opt += "<option value='" + optVal + "'>" + optVal + "</option>";
        }
    });
    document.getElementById(tagId).innerHTML = opt;
};

///////////インプットボタン、及びイメージタグ共、初期IDは１、その後追加毎にプラス１///////////////////////
/////////画像を一旦(サイズ50×50で)読み込んでから、元のサイズを求めそれから、任意のサイズに変更////////
//インプットボタンで読み込んだファイルからは、表示サイズは求められない。ので、、、
function imgFileInputOnChang(inputFileBtn) {  //ファイル読み込みイベントの発火
    //イメージ要素のIDを取得
    let thumbnailId = '#thumbnail' + inputFileBtn.id.replace(inputFileBtn.className, "");//クラス名upLoadFileタグのid名は、クラス名＋ID(番号)であるから、、、

    ////画像読み込み完了イベントで、画像縮尺調整　（高さ100に合わせて横幅調整//////////////////////////////////////////////////////////////////////////////////
    $(thumbnailId).on('load', function () {　//cf:https://blog.emwai.jp/javascript/img-load-not-working/ 、 https://ja.stackoverflow.com/questions/27850/%E7%94%BB%E5%83%8F%E8%AA%AD%E3%81%BF%E8%BE%BC%E3%81%BF%E3%82%92%E5%BE%85%E3%81%A3%E3%81%A6%E5%87%A6%E7%90%86%E3%81%97%E3%81%9F%E3%81%84
        this.height = this.naturalHeight * this.width / this.naturalWidth;  //元のサイズは「natural」
    });

    // 選択されたファイル情報を取得
    let file = inputFileBtn.files[0];	//取りあえずファイル一個だけの対応とする。拡張は御髄に
    // readerのresultプロパティに、データURLとしてエンコードされたファイルデータを格納
    let fileReader = new FileReader();
    fileReader.readAsDataURL(file);
    fileReader.onload = function () {//ファイルリーダーの読み込みイベント完了時に発火
        //一旦高さ100×幅デフォルトで表示してから、【$(thumbnailId).on('load'・・・】イベントで縮尺する。
        $(thumbnailId).attr({
            src: fileReader.result, //画面に表示
            width: $('#tr_Head')[0].cells[0].clientWidth + $('#tr_Head')[0].cells[1].clientWidth,
            height: "100"
        });
    }
};

(function () {
    'use strict';
    //URLから緯度経度文字列を取得
    var urlQueryStr = location.search.substring(1).split('&');//substring(1)で"?"を除去,split('&')で文字列分割

    $('#id_HeadrLat')[0].value = urlQueryStr[0];
    $('#id_HeadrLng')[0].value = urlQueryStr[1];
    // 今日の日付データを変数todayに格納
    var this_day, this_month, this_year, today;
    today = new Date();
    this_year = today.getFullYear();
    this_month = today.getMonth() + 1;
    this_day = today.getDate();

    //関数設定（スタート数字[必須]、終了数字[必須]、表示id名[省略可能]、デフォルト数字[省略可能]）
    optionSetNumeric(2010, this_year, 'id_HeadrYear', this_year);
    optionSetNumeric(1, 12, 'id_HeadrMonth', this_month);
    optionSetNumeric(1, 31, 'id_HeadrDay', this_day);
    optionSetNumeric(0, 23, 'id_HeadrHour', 12);
    optionSetNumeric(0, 59, 'id_HeadrMinute', 30);
    optionSetNumeric(2010, this_year, 'id_Itm1Year', this_year);
    optionSetNumeric(1, 12, 'id_Itm1Month', this_month);
    optionSetNumeric(1, 31, 'id_Itm1Day', this_day);
    optionSetNumeric(0, 23, 'id_Itm1Hour', 12);
    optionSetNumeric(0, 59, 'id_Itm1Minute', 30);
    optionSetString(['9', '27'], 'id_HeadrRoute', '9');
    optionSetString(['舞鶴市', '綾部市', '福知山市', '京丹波町'], 'id_HeadrCity', '福知山市');
    optionSetString(['上り', '下り', '上下', '中央', '路肩', '歩道', '側道', 'その他'], 'id_HeadrLane', '上り');
})();
