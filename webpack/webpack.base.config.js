//文件说明: webpack基础配置文件,后续配置文件都是在此基础智商拓展而来的.主要是配置vue的一些东西

var path = require('path')

module.exports = {
	entry: {
		index: [
			path.resolve(__dirname, '../app/index.js')
		],
		vendor: ['vue', 'axios', path.resolve(__dirname, '../app/util/base.js'), 'element-ui'],
	}, 
	output: {
		path: path.resolve(__dirname, './output'),
		filename: '[name].js',
		publicPath: './',
		chunkFilename: 'chunk-[name].js'
	},
	resolve: {
		extensions: ['.js', '.vue'],
		alias: {
			'vue': 'vue/dist/vue.js',
			'vue$': 'vue/dist/vue.esm.js',
			'@dao': path.resolve(__dirname, '../app/dao')
		}
	},
	module: {
		rules: [{
			test: /\.(js|vue)$/,
			use: [{
				loader: 'babel-loader',
				options: {
					plugins: ['syntax-dynamic-import']
				}
			}],
			exclude: /node_modules/
		}, {
				 test: /\.vue$/,
      			  loader: 'vue-loader',
      			  
		}

		]
	} 
}