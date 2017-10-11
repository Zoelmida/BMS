//引入必要的模块

var express = require('express')

var webpack = require('webpack')

var fs = require('fs')

var path = require('path')

var session = require('express-session')

var config = require('../webpack/webpack.dev.config.js')

var app = express() 

var bodyParser = require('body-parser')



//调用webpack配置文件把配置传递过去
var compiler = webpack(config)


app.use(bodyParser.urlencoded({ extended: false }))

//使用webpack-dev-middleware 中间件

var devMiddleware = require('webpack-dev-middleware')(compiler,
	{
		publicPath: config.output.publicPath,
		stats: {
			colors: true,
			chunks: false
		}
	})
app.use(session({
	resave: true,
	saveUninitialized: true,
	secret: 'keyboard cat',
	cookie: { maxAge: 500000 }
})) //这句话应该放在注册的api的前一行，否则会提示找不到session。 至于为什么请参阅express  stack[]。

var apiDirName = path.resolve(__dirname,'./api') //api文件的目录

var fsArr = fs.readdirSync(apiDirName)


fsArr.forEach(function (item) {//注册api
	if(item != 'README.MD' && item != 'allPath.js'){
		try {
			var api = require(path.resolve(apiDirName,item))
			for(var key in api){
				var thisControl = api[key]
				app[thisControl.method].apply(app, [thisControl.path].concat(thisControl.cb))
			}
		} catch (error) {
			/*eslint-disable*/
			console.error('%s 获取API失败',item)
			/*eslint-enable*/
		}
	}
})

var hotPublish = require('webpack-hot-middleware')(compiler,{
	 log: () => {}
})

compiler.plugin('compilation', function (compilation) {
	compilation.plugin('html-webpack-plugin-after-emit', function (data, cb) {
		// 发布事件
		hotPublish.publish({ action: 'reload' })
		cb()
	})
})

app.use(devMiddleware)

app.use(hotPublish)




var server = app.listen(8888, function () {
	/*eslint-disable */
    var host = server.address().address;
    var port = server.address().port;
    console.log('Example app listening at http://%s:%s', host, port);
    /*eslint-enable */
})
