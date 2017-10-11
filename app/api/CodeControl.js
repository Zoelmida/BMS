//产生验证码。
var captchapng = require('captchapng')

function mackCode() {
	var code = '0123456789'
	var length = 4
	var randomcode = ''
	for (var i = 0; i < length; i++) {
		randomcode += code[parseInt(Math.random() * 1000) % code.length]
	}
	return randomcode
}
var getCodeApi = {
	path: '/getCode',
	method: 'get',
	cb: function (req, res) {
		var code = mackCode()
		req.session.code = code
		var p = new captchapng(80, 30, parseInt(code)) // width,height,numeric captcha
		p.color(255, 255, 255, 0)  // First color: background (red, green, blue, alpha)
		p.color(80, 80, 80, 255) // Second color: paint (red, green, blue, alpha)
		var img = p.getBase64()
		var imgbase64 = new Buffer(img, 'base64')
		res.writeHead(200, {
			'Content-Type': 'image/png'
		})
		res.end(imgbase64)
	}
}

module.exports.CodeControl = getCodeApi
