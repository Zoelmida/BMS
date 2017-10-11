

var fs = require('fs')

var { getField } = require('./configDb')

var path = require('path')

module.exports.genCode = function (_config, cb) {
	/////////////////加载依赖文件开始



	var config = _config

	var tableName = config.genConif.tableName

	var primaryKey = config.genConif.primaryKey

	var pprimaryKey = config.genConif.pprimaryKey

	var tableAliasName = config.genConif.tableAliasName.split('')[0].toUpperCase() + config.genConif.tableAliasName.slice(1)

	var daoName = tableAliasName + 'Mapper.js'

	var apiName = tableAliasName + 'Control.js'

	var daoDirName = config.genConif.daoPath

	var apiDirName = config.genConif.apiPath

	var Pagination = config.genConif.Pagination

	var relativePath = path.posix.relative(apiDirName, daoDirName) //从api到dao的相对路径

	var requireDaoName = path.posix.join(relativePath, daoName)//组合成从api请求到dao的相对路径

	var daoPath = path.posix.join(daoDirName, daoName)

	var apiPath = path.posix.join(apiDirName, apiName)

	var Add = config.genConif.add

	var Delete = config.genConif.delete

	var Update = config.genConif.update

	var Select = config.genConif.select

	var apiTemplate = fs.readFileSync(path.resolve(__dirname, './api.template'), {
		encoding: 'utf8'
	})

	var daoTemplate = fs.readFileSync(path.resolve(__dirname, './dao.template'), {
		encoding: 'utf8'
	})

	/////////////////加载依赖文件结束


	/////////////////递归生成文件开始

	function mkdirRecursive(dirPath) {
		try {
			fs.mkdirSync(dirPath)
			console.log(dirPath + '目录创建成功!')
		} catch (error) {
			if (error.code == 'EEXIST') {
				if (fs.statSync(dirPath).isDirectory()) {
					console.log(dirPath + '目录已经存在!')
					return
				} else {
					console.log('删除' + path.basename(dirPath) + '!')
					fs.unlinkSync(dirPath)
				}
				mkdirRecursive(dirPath)
			}
			else {
				mkdirRecursive(path.dirname(dirPath))
				mkdirRecursive(dirPath)
			}

		}

	}

	/////////////////递归生成文件结束

	/////处理api模板开始 
	apiTemplate = apiTemplate.replace(/\{__TABLE_ALIAS_NAME__\}/g, tableAliasName)

		.replace(/\{__REQUIRE_DAO_NAME__\}/g, requireDaoName)

		.replace(/\{__ADD_METHOD__\}/g, Add.method.toLowerCase())

		.replace(/\{__DELETE_METHOD__\}/g, Delete.method.toLowerCase())

		.replace(/\{__UPDATE_METHOD__\}/g, Update.method.toLowerCase())

		.replace(/\{__SELECT_METHOD__\}/g, Select.method.toLowerCase())

	if(Pagination){//需要分页
		apiTemplate = apiTemplate.replace(/\{__IF_NOPAGINATION__\}(?:[\s\S]*?)*?\{__END_IF__\}/g,'')
	}else{
		apiTemplate = apiTemplate.replace(/\{__IF_PAGINATION__\}(?:[\s\S]*?)*?\{__END_IF__\}/g,'')			
	} 
	///清除剩余的{内的标记}
	apiTemplate = apiTemplate.replace(/\{__(?:[\s\S]*?)*?__\}/g, '')
	mkdirRecursive(path.resolve(__dirname, apiDirName))//创建api目录



	//创建写入api文件的流
	var writeApiStream = fs.createWriteStream(path.resolve(__dirname, apiPath), {
		flag: 'w+'
	})

	writeApiStream.write(apiTemplate, error => {
		if (error) {
			writeApiStream.close()
			throw error
		}
		else {
			console.log(apiName + '创建成功!')
		}
		writeApiStream.close()
	})

	/////处理api模板结束


	/////处理dao模板开始

	mkdirRecursive(path.resolve(__dirname, daoDirName))//创建dao目录

	//创建写入dao文件的流
	var writeDaoStream = fs.createWriteStream(path.resolve(__dirname, daoPath), {
		flag: 'w+'
	})

	getField(config, function (result, resCon) {
		//daoTemplate
		var tableArray = result.map(function (item) {
			return item.Field
		})
		var author = resCon.genConif.author || ''
		var time = new Date().toString()
		var recursive = resCon.genConif.queryRecursive
		var dbConfigPath = resCon.genConif.dbConfigPath
		var relativeConfigPath = path.posix.relative(path.dirname(daoPath), path.dirname(dbConfigPath)) //从dao到生成代码的程序的相对路径    
		var requireConfigPath = path.posix.join(relativeConfigPath, path.basename(dbConfigPath))
		if (!requireConfigPath.startsWith('.')) {
			requireConfigPath = './' + requireConfigPath
		}
		var fieldArrayToString = '"' + tableArray.join(',') + '"'
		var fieldArray = '[\'' + tableArray.join('\',\'') + '\']'
		if (recursive) {//如果需要递归
			daoTemplate = daoTemplate.replace(/\{__IF_NORECURISION__\}(?:[\s\S]*?)*?\{__END_IF__\}/g, '')
				.replace('{__PPRIMARY_KEY__}', pprimaryKey)
		} else {
			daoTemplate = daoTemplate.replace(/\{__IF_RECURISION__\}(?:[\s\S]*?)*?\{__END_IF__\}/g, '')
		}
		if(Pagination){//需要分页
			daoTemplate = daoTemplate.replace(/\{__IF_NOPAGINATION__\}(?:[\s\S]*?)*?\{__END_IF__\}/g,'')
		}else{
			daoTemplate = daoTemplate.replace(/\{__IF_PAGINATION__\}(?:[\s\S]*?)*?\{__END_IF__\}/g,'')			
		} 
		daoTemplate = daoTemplate.replace(/\{__AUTHOR__\}/g, author)
			.replace(/\{__TIME__\}/g, time)
			.replace(/\{__TABLE_NAME__\}/g, tableName)
			.replace(/\{__TABLE_ALIAS_NAME__\}/g, tableAliasName)
			.replace(/\{__DB_CONFIG_PATH__\}/g, requireConfigPath)
			.replace(/\{__FIELD_ARRAY_TO_STRING__\}/g, fieldArrayToString)
			.replace(/\{__FIELD_ARRAY__\}/g, fieldArray)
			.replace(/\{__PRIMARY_KEY__\}/g, primaryKey)
			///清除剩余的{内的标记}
			.replace(/\{__(.*?\n*?)*?__\}/g, '')
		writeDaoStream.write(daoTemplate, error => {
			if (error) {
				writeDaoStream.close()
				throw error
			}
			else {
				console.log(daoName + '创建成功!')
				cb('success')
			}
			writeDaoStream.close()
		})
	})
	/////处理dao模板结束
}