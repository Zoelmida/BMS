/**
 * author:wangyi
 * data:Sat Sep 30 2017 17:19:02 GMT+0800 (中国标准时间)
 * dao的模板
 */
"use strict"
var mysql = require('mysql')

var db = require('./dbconfig.js')

var SysRoleMenuService = {}

var pool = mysql.createPool(db)

var includeList = "roleId,menuId"

var fields = ['roleId','menuId']

var uuid = require('uuid');
//查

//判断是否需要递归


//不需要递归
SysRoleMenuService.selectAll = function (
	condition,
	cb
) {
	pool.getConnection(function (err, connection) {
		if (err) {
			throw err
		}
		var valStr = 'select ' + includeList + ' from sys_role_menu where 1=1'
		for (var key in condition) {
			if (fields.indexOf(key) != -1 &&  condition[key]) {
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
		 
		if (condition['start'] >= 0  && condition['pageCount']) {
			valStr += ` limit ${condition['start']},${condition['end']}`
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


//增

SysRoleMenuService.insert = function (condition,
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
			sql = 'insert into sys_role_menu('
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

SysRoleMenuService.deleteById = function (condition, cb) {
	pool.getConnection(function (err, connection) {
		if (err) {
			throw err
		}
		var sql = 'delete from sys_role_menu where id = ?'
		var query = connection.query(sql, [condition['id']], function (error, results, field) {
			cb(error || ('删除成功delete ' + results.affectedRows + ' rows'))
		})
		console.log(query.sql)
		connection.release()
	})
}

//改

SysRoleMenuService.updateById = function (condition, cb) {
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
			sql = 'update sys_role_menu set '
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
SysRoleMenuService.count = function (
	condition,
	cb
) {
	pool.getConnection(function (err, connection) {
		if (err) {
			throw err
		}
		var valStr = 'select count(*) as sum from sys_role_menu where 1=1'
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



module.exports = SysRoleMenuService