//连接数据库，配置数据库相关信息,这个函数的主要功能是为了完成连接数据库，并获取数据库的字段
var mysql = require('mysql')

module.exports.getField = function (config,cb) {
	(function(config,cb){
		var dbConfig = config
		var connect = mysql.createConnection(dbConfig.dbConfig)
		var str = `DESC ${dbConfig.genConif.tableName}`
		connect.query(str, function (err, result) {
			if (err)
				throw err
				
			cb(result,dbConfig)
			connect.destroy()
		})
	})(config,cb)
	
}
