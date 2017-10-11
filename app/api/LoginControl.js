//登录的api
var userService = require('../dao/SysUserMapper')
var {encrypt} = require('../util/MD5Util.js')
var LoginControl = {
	path: '/LoginControl/login/auth',
	method: 'post',
	cb: function (req, res) {
		res.header('content-type', 'application/json')
		var data = req.body
		if (data.code != req.session.code) {
			res.end(JSON.stringify({ msg: '验证码错误!' }))
		} else {
			var map = new Map()
			var password = encrypt(data.password)
			map.set('account',data.account)
			map.set('password',password)
			userService.selectCount(map,function(results){
				if (results[0].sum > 0) {
					req.session.user = { password: password, account: data.account, msg: '登录成功', result: '200' }
					res.send(JSON.stringify(req.session.user))
					res.end()
				} else {
					res.end(JSON.stringify({
						error: '1',
						msg: '登录失败,账号或密码错误'
					}))
				}
			})
			
		}

	}
}

module.exports.LoginControl = LoginControl
