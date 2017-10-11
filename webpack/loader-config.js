//loader-config  配置webpack的其他的一些loader。

module.exports = {module: {
	rules:[
	{
			test:/\.css$/,
			use:[
				'style-loader',{
				loader: "css-loader"
			}
 		]
	}
	,
	{
        test: /\.(eot|svg|ttf|woff|woff2)(\?\S*)?$/,
        loader: 'file-loader'
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?\S*)?$/,
        loader: 'file-loader',
        query: {
          name: '[name].[ext]?[hash]'
        }
      }
	
	]
	
	
	
}}
