var {genCode} = require('./genCode.js')
var config = {}
config.genConif = {//生成文件的配置 默认配置。
	daoPath: '../app/dao',//dao的path
	apiPath: '../app/api',//api的path
	tableName: 'sys_user',//表的名称
	primaryKey:'id',//表的主键
	pprimaryKey:'pid',//指向父级表的主键,当queryRecursive为真的时候有效
	tableAliasName: 'user',//表的别名
	dbConfigPath: '../app/dao/dbconfig.js',//数据库文件的配置文件
	queryRecursive: false,//查询是否需要递归查询
	author: 'wangyi',
	add:{
		method:'post'
	},
	delete:{
		method:'get'
	},
	update:{
		method:'post'
	},
	select:{
		method:'get'		
	},
	isOverWrite:'true',//用来标识是否覆盖  测试属性，暂未实现
	Pagination:false
}
config.dbConfig = {//连接数据库的配置
	host: 'localhost',
	user: 'root',
	password: '123456',
	database: 'bms',
	connectionLimit: 10,
	charset: 'UTF8_GENERAL_CI',
	debug: false
}
var genCodes = [{
	tableName:'sys_menu',
	tableAliasName: 'menu',//表的别名
	queryRecursive: true//查询是否需要递归查询
},{
	tableName:'sys_organiz',
	tableAliasName: 'organize',//表的别名
	queryRecursive: true//查询是否需要递归查询
},{
	tableName:'sys_role',
	tableAliasName: 'role',//表的别名
	queryRecursive: true//查询是否需要递归查询
},{
	tableName:'sys_role_menu',
	tableAliasName: 'roleMenu',//表的别名
	queryRecursive: false//查询是否需要递归查询
},{
	tableName:'sys_user',
	tableAliasName: 'user',//表的别名
	queryRecursive: false,//查询是否需要递归查询
	Pagination:true
}] 
var i = 0

function startMakeFile(){
	if(i<genCodes.length){
		config.genConif	= Object.assign(config.genConif,genCodes[i])
		genCode(config,function(){
			i++
			startMakeFile()
		})
	}
}
 
startMakeFile()