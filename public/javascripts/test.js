var socket = io.connect();

var currentPoint = "";//緯度経度リスト中の現在ポイント
var AllEventData = {};//オブジェクト配列：グローバル変数
$(function () {
	console.log('サーバーへメッセージを送ってみます。\n');
	/////////////////////////////////////////////////
	//サーバーにある全てのイベントファイルのデータ送信要求
	/////////////////////////////////////////////////
	socket.emit('C2S:sendRequestEventFilesData','データおくれ');

	//==========socketIO(サーバーからメッセージが届いた時に発火）=========================
	socket.on('S2C:sendAllEventData', function (data) {
		console.log(data+':サーバーからメッセージがありました。\n');
		//alert("サーバーからメッセージがありました。["+data+"]");
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

    stop: function() {
        $(this).removeData("resizable-alsoresize-reverse");
    }
});