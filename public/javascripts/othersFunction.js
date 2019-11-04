//文字列がJSon文字列かどうかを判定する
function isJSon(str) {
	try {
		JSON.parse(str)
	} catch (e) {
		return false
	}
	return true
}