$(function() {
	$('#mapCanvas').resizable({
		handles: "s", //高さのみ変更可能（ハンドルは、底辺のみ）
		alsoResizeReverse: "#strtVwCanvas", //連動する要素の高さの変動を逆位相とする。順位相=alsoResize
		resize: function(event, ui) {//リサイズ中に発火
		}
	});
});

// 要素リサイズ　cf:http://js.studio-kingdom.com/jqueryui/interactions/resizable
/*要素のリサイズ連動（片方は逆方向）*/
/*CF:https://codeday.me/jp/qa/20181230/112551.html*/
$.ui.plugin.add("resizable", "alsoResizeReverse", {
    start: function() {
        var that = $(this).resizable( "instance" ),
            o = that.options;

        $(o.alsoResizeReverse).each(function() {
            var el = $(this);
            el.data("ui-resizable-alsoresizeReverse", {
                width: parseInt(el.width(), 10), height: parseInt(el.height(), 10),
                left: parseInt(el.css("left"), 10), top: parseInt(el.css("top"), 10)
            });
        });
    },
    resize: function(event, ui) {
        var that = $(this).resizable( "instance" ),
            o = that.options,
            os = that.originalSize,
            op = that.originalPosition,
            delta = {
                height: (that.size.height - os.height) || 0,
                width: (that.size.width - os.width) || 0,
                top: (that.position.top - op.top) || 0,
                left: (that.position.left - op.left) || 0
            };
        $(o.alsoResizeReverse).each(function() {
            var el = $(this), start = $(this).data("ui-resizable-alsoresize-reverse"), style = {},
                css = el.parents(ui.originalElement[0]).length ?
                    [ "width", "height" ] :
                    [ "width", "height", "top", "left" ];
            $.each(css, function(i, prop) {
                var sum = (start[prop] || 0) - (delta[prop] || 0);
                if (sum && sum >= 0) {
                    style[prop] = sum || null;
                }
            });
            el.css(style);
        });
    },

    stop: function() {//要素のリサイズイベント終了時に発火
		$(this).removeData("resizable-alsoresize-reverse");
		$('#strtVwCanvas').hide();//ストリートビューを一旦非表示
		var latlng = MyMap.getCenter();//マップの中心緯度経度を取得
		var lat = latlng.lat();
		var lng = latlng.lng();
		Svp.setPosition(new google.maps.LatLng(lat-0.0001, lng));//ストリートビュー少し動かす

		setTimeout(function () {
			Svp.setPosition(new google.maps.LatLng(lat, lng));//ストリートビューを元に戻す
			$('#strtVwCanvas').show();
		}, 500); // 0.5秒後に再描画
		}
});