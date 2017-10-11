//文件说明: webpack开发版配置文件

var webpackPlugin = require('html-webpack-plugin')
   
var path = require('path')

var webPackConfig = require('./webpack.base.config')

var webpack = require('webpack')

var merge = require('webpack-merge')

var loaderConfig = require('./loader-config.js')

webPackConfig = merge(webPackConfig,loaderConfig)

webPackConfig.output.publicPath = '/'

webPackConfig.performance = {
	hints: false
}

webPackConfig.plugins = [
	new webpack.optimize.OccurrenceOrderPlugin(),
	new webpack.HotModuleReplacementPlugin(),
	new webpack.NoEmitOnErrorsPlugin(),
	new webpack.optimize.CommonsChunkPlugin({
  name: "vendor",
  filename: "vendor.js"
}),
	new webpackPlugin({
		filename:'index.html',
		template:'app/index.html',
		inject:true
	}) 
]

var hotPublish = path.resolve(__dirname, '../app/dev-client.js')

Object.keys(webPackConfig.entry).forEach(function (name) {
	var extras = [hotPublish]
	webPackConfig.entry[name] = extras.concat(webPackConfig.entry[name])
})
module.exports = webPackConfig
