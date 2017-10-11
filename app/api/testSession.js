//设置session
var testSessionApi = {
	path:'/sessionControl',
	method: 'post',
	cb: function (req, res) {
		res.header('content-type', 'application/json')
		var obj = req.body
		if (obj.action == 'get') {
			var returnObj = {}
			try{
				returnObj[obj.query] = req.session.user[obj.query]?1:0
			}catch(e){
				returnObj[obj.query] = 0
				//TODO handle the exception
			}
			res.end(JSON.stringify(returnObj))
		} else if (obj.action == 'set') {
			req.session[obj.query] = obj[obj.query]
			res.end(JSON.stringify({ msg: 'success' }))
		} else {
			res.end(JSON.stringify({ msg: '未定义操作' }))
		}
	}
}

module.exports.testSession = testSessionApi
