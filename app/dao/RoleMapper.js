/**
 * author:wangyi
 * data:Sat Sep 30 2017 17:19:02 GMT+0800 (中国标准时间)
 * dao的模板
 */
"use strict"
var mysql = require('mysql')

var db = require('./dbconfig.js')

var SysRoleService = {}

var pool = mysql.createPool(db)

var includeList = "id,pid,roleName,descript,del"

var fields = ['id','pid','roleName','descript','del']

var uuid = require('uuid');
//查

//判断是否需要递归
//需要递归
function selectOne(condition) {
	return new Promise(function (resolve, reject) {
		pool.getConnection(function (err, connection) {
			if (err) {
				throw err
			}
			var valStr = 'select ' + includeList + ' from sys_role  where 10086=10086 '
			for (var key in condition) {
				if (fields.indexOf(key) != -1 && condition[key]) {
					valStr += ` and ${connection.escapeId(key)} = ${connection.escape(condition[key])}`;
				}
			}
			if (condition['keyword'] && condition['field']) {
				valStr += ` and  instr(${connection.escapeId(condition['field'])},${connection.escape(condition['keyword'])})`
			}
			

			if (condition['orderField']) {
				valStr += ' order by '
				valStr += `${connection.escapeId(condition['orderField'])} `
			}
			 
			if (condition['start'] >= 0 && condition['pageCount']) {
				valStr += ` limit  ${condition['start']},${condition['end']}`
			}
			var data = [];

			connection.query(
				valStr,
				function (error, results, field) {
					resolve(results)
				}
			)
			connection.release()

		})
	})

}

async function getResRecursive(condition, resArray) {

	resArray = await selectOne(condition)
	if (resArray.length > 0) {
		for (var i = 0; i < resArray.length; i++) {
			resArray[i].children = new Array()
 			condition['pid'] = resArray[i].id
			var res = await getResRecursive(condition, resArray[i].children)
			resArray[i].children = res
		}
	}
	return resArray
}
SysRoleService.selectAll = async function (condition, cb) {
	var result = new Array()
	result = await getResRecursive(condition, [])
	cb(result)
}




//增

SysRoleService.insert = function (condition,
	cb) {
	pool.getConnection(function (err, connection) {
		if (err) {
			throw err
		}
		var keys = [], values = [], sql = ''
		for (var i = 0 ; i<fields.length;i++) {
			//id
			keys.push(connection.escapeId(fields[i]))
			if(fields[i] == 'id'){
				values.push(connection.escape(uuid.v1().replace(/-/g,'')))
			}
			else if(condition[fields[i]]){
				values.push(connection.escape(condition[fields[i]]))
			}else{
				values.push(null)
			}
			
		}

		if (keys.length > 0 && values.length > 0) {
			sql = 'insert into sys_role('
			sql += keys.join(',')
			sql += ')'
			sql += 'values('
			sql += values.join(',')
			sql += ')'
		}
		if (sql != '') {
			console.log(sql)
			connection.query(sql, function (error, results, field) {
				cb(error || ('插入成功changed ' + results.insertId + ' rows'))
			})
			connection.release()
		}

	})
}

//删

SysRoleService.deleteById = function (condition, cb) {
	pool.getConnection(function (err, connection) {
		if (err) {
			throw err
		}
		var sql = 'delete from sys_role where id = ?'
		var query = connection.query(sql, [condition['id']], function (error, results, field) {
			cb(error || ('删除成功delete ' + results.affectedRows + ' rows'))
		})
		console.log(query.sql)
		connection.release()
	})
}

//改

SysRoleService.updateById = function (condition, cb) {
	pool.getConnection(function (err, connection) {
		if (err) {
			throw err
		}
		var keys = [], values = [], sql = ''
		for (var key in condition) {
			if(fields.indexOf(key)!=-1 && condition[key]){
			keys.push(key)
			}
		}

		if (keys.length > 0) {
			sql = 'update sys_role set '
			for (var i = 0; i < keys.length; i++) {

				if (keys[i] != 'id') {
					sql += keys[i] + ' = ? ,'
					values.push(condition[keys[i]])
				}
			}
			if (sql.indexOf(',') != -1) {
				sql = sql.substring(0, sql.length - 1)
			}
			sql += 'where id = ?'
			values.push(condition['id'])
		}
		if (sql != '') {
			var query = connection.query(sql, values, function (error, results, field) {

				cb(error || ('更新成功changed ' + results.changedRows + ' rows'))
			})
			console.log(query.sql)
			connection.release()
		}


	})
}

//查询总的个数
SysRoleService.count = function (
	condition,
	cb
) {
	pool.getConnection(function (err, connection) {
		if (err) {
			throw err
		}
		var valStr = 'select count(*) as sum from sys_role where 1=1'
		for (var key in condition) {
			if (fields.indexOf(key) != -1 && condition[key]) {
				valStr += ` and ${connection.escapeId(key)} = ${connection.escape(condition[key])}`;
			}
		}
		if (condition['keyword'] && condition['field']) {
				valStr += ` and  instr(${connection.escapeId(condition['field'])},${connection.escape(condition['keyword'])})`
			} 
		connection.query(
			valStr,
			function (error, results, field) {

				cb(error || results)
			}
		)
		connection.release()
	})
}



module.exports = SysRoleService