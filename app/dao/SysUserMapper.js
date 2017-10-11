/**
 * author:wangyi
 * data:2017年09月07日20:31:48
 */
var mysql = require('mysql')

var  bms  = require('./dbconfig')

var userService = {}

var pool = mysql.createPool(bms)

var includeList =
				`id, userName, userNameEn, account, password, sex, email, tel, roleId, organizId, 
createTime, createUesrId, updateTime, updateUesrId, seq, del`

userService.selectCount = function (
	Map,
	cb
) {

	pool.getConnection(function (err, connection) {
		if (err) {
			throw err
		}
		var valStr = 'select count(*) as sum from sys_user where del = 0'
		for (var [key, value] of Map) {
			if (value) {
				valStr += ` and ${connection.escapeId(key)} = ${connection.escape(value)}`
			}
		}
		connection.query(
			valStr,
			function (error, results, field) {
				cb(results)
			}
		)
		connection.release()

	})

}
userService.selectAll = function (
	map,
	cb
) {
	pool.getConnection(function (err, connection) {
		if (err) {
			throw err
		}
		var valStr = 'select ' + includeList + ' from sys_user where del = 0'
		
		for (var [key, value] of map) {
			if(value){
				switch (key) {
				case 'userName': valStr += ` and ${connection.escapeId(key)} = ${connection.escape(value)}`; break
				case 'userNameEn': valStr += ` and ${connection.escapeId(key)} = ${connection.escape(value)}`; break
				case 'account': valStr += ` and ${connection.escapeId(key)} = ${connection.escape(value)}`; break
				case 'password': valStr += ` and ${connection.escapeId(key)} = ${connection.escape(value)}`; break
				case 'sex': valStr += ` and ${connection.escapeId(key)} = ${connection.escape(value)}`; break
				case 'email': valStr += ` and ${connection.escapeId(key)} = ${connection.escape(value)}`; break
				case 'tel': valStr += ` and ${connection.escapeId(key)} = ${connection.escape(value)}`; break
				case 'roleId': valStr += ` and ${connection.escapeId(key)} = ${connection.escape(value)}`; break
				case 'organizId': valStr += ` and ${connection.escapeId(key)} = ${connection.escape(value)}`; break
				case 'createTime': valStr += ` and ${connection.escapeId(key)} = ${connection.escape(value)}`; break
				case 'createUesrId': valStr += ` and ${connection.escapeId(key)} = ${connection.escape(value)}`; break
				case 'updateTime': valStr += ` and ${connection.escapeId(key)} = ${connection.escape(value)}`; break
				case 'updateUesrId': valStr += ` and ${connection.escapeId(key)} = ${connection.escape(value)}`; break
				case 'seq': valStr += ` and ${connection.escapeId(key)} = ${connection.escape(value)}`; break
				}
			}
			

		}
		if (map.has('keyword')) {
			valStr += ` instr(${connection.escapeId(key)},${connection.escape(value)})`
		}
		valStr += ' order by '

		if (map.has('orderField')) {
			valStr += `${connection.escapeId(map.get('orderField'))} `
		} else {
			valStr += 'createTime '
		}
		if (map.has('orderField')) {
			valStr += 'asc '
		} else {
			valStr += 'desc '
		}
		if (map.has('start') && map.has('pageCount')) {
			valStr += ` ${map.get('start')},${map.get('end')}`
		}
		connection.query(
			valStr,
			function (error, results, field) {
				cb(results)
			}
		)
		connection.release()

	})
}
userService.insert = function (user) {
	pool.getConnection(function (err, connection) {
		if (err) {
			throw err
		}
		var keys = [], values = [], sql = ''
		for (var key in user) {
			keys.push(key)
			values.push('"' + user[key] + '"')
		}
		if (keys.length > 0 && values.length > 0) {
			sql = 'insert into sys_user('
			sql += keys.join(',')
			sql += ')'
			sql += 'values('
			sql += values.join(',')
			sql += ')'
		}
		if (sql != '') {
			console.log(sql)
			connection.query(sql, function (error, results, field) {
				if (error) {
					throw error
				}
				console.log('插入成功changed ' + results.insertId + ' rows')
			})
			connection.release()
		}

	})
}

userService.updateById = function (user) {
	pool.getConnection(function (err, connection) {
		if (err) {
			throw err
		}
		var keys = [], values = [], sql = ''
		for (var key in user) {
			keys.push(key)
		}
		if (keys.length > 0) {
			sql = 'update sys_user set '
			for (var i = 0; i < keys.length; i++) {
				if (keys[i] != 'id') {
					sql += keys[i] + ' = ? ,'
					values.push(user[keys[i]])
				}
			}
			if (sql.indexOf(',')) {
				sql = sql.substring(0, sql.length - 1)
			}
			sql += 'where id = ?'
			values.push(user['id'])
		}
		if (sql != '') {
			var query = connection.query(sql, values, function (error, results, field) {
				if (error) {
					throw error
				}
				console.log('更新成功changed ' + results.changedRows + ' rows')
			})
			console.log(query.sql)
			connection.release()
		}


	})
}

userService.deleteById = function (id) {
	pool.getConnection(function (err, connection) {
		if (err) {
			throw err
		}
		var sql = 'delete from sys_user where id = ?'
		var query = connection.query(sql, [id], function (error, results, field) {
			if (error) {
				throw error
			}
			console.log('删除成功delete ' + results.affectedRows + ' rows')
		})
		console.log(query.sql)
		connection.release()
	})
}

module.exports = userService