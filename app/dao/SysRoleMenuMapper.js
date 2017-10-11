/**
 * author:wangyi
 * data:2017年9月8日15:37:05
 */
var mysql = require('mysql')

var bms = require('./dbconfig')

var SysRoleMenuService = {}

var pool = mysql.createPool(bms)

var includeList = 'id, pid, menuName, icon, url, seq, state, del'

SysRoleMenuService.getrolemenus = function(
	map
 	,cb
){
	var roleId = map.get('roleId')
	pool.getConnection(function (err, connection) {
		if (err) {
			throw err
		}
		var valStr = 'select menuId,roleId from sys_role_menu where roleId = ?'
		connection.query(
			valStr,
			[roleId],
			function (error, results, field) {
				cb(results)
			}
		)
		connection.release()
	})
}

SysRoleMenuService.insert = function(menu){
	pool.getConnection(function(err,connection){
		if(err){
			throw err
		}
		var keys = [],values = [], sql = ''
		for(var key in menu){
			keys.push(key)
			values.push('"'+menu[key]+'"')
		}
		if(keys.length > 0 && values.length > 0){
			sql  = 'insert into sys_role_menu('
			sql += keys.join(',')
			sql += ')'
			sql += 'values('
			sql += values.join(',')
			sql += ')'
		}
		if(sql != ''){
			console.log(sql)
			connection.query(sql,function(error,results,field){
				if(error){
					throw error
				}
				console.log('插入成功changed ' + results.insertId + ' rows')
			})
			connection.release()
		}
       
	})
}

SysRoleMenuService.deleteById = function(rolemenu){
	pool.getConnection(function(err,connection){
		if(err){
			throw err
		}
		var id  = [rolemenu.roleId,rolemenu.menuId]
		var sql = 'delete from sys_role_menu where roleId = ? and menuId'
		var query = connection.query(sql,id,function(error,results,field){
			if(error){
				throw error
			}
			console.log('删除成功delete ' + results.affectedRows + ' rows')
		})
		console.log(query.sql)
		connection.release()
	})
}

module.exports = SysRoleMenuService