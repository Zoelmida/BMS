/**
 * author:wangyi
 * data:2017年9月8日14:43:23
 */
"use strict"
var mysql = require('mysql')

var bms = require('./dbconfig')

var SysMenuService = {}

var pool = mysql.createPool(bms)

var fileds = []

function selectOne(map){
	return new Promise(function(resolve,reject){
		pool.getConnection(function (err, connection) {
		if (err) {
			throw err
		}
		var valStr = 'select ' + includeList + ' from sys_menu where 10086=10086 '
		for (var [key, value] of map) {
			switch (key) {
			case 'id': valStr += ` and ${connection.escapeId(key)} = ${connection.escape(value)}`; break
			case 'pid': valStr += ` and ${connection.escapeId(key)} = ${connection.escape(value)}`; break
			case 'menuName': valStr += ` and ${connection.escapeId(key)} = ${connection.escape(value)}`; break
			case 'icon': valStr += ` and ${connection.escapeId(key)} = ${connection.escape(value)}`; break
			case 'url': valStr += ` and ${connection.escapeId(key)} = ${connection.escape(value)}`; break
			case 'state': valStr += ` and ${connection.escapeId(key)} = ${connection.escape(value)}`; break
			case 'del': valStr += ` and ${connection.escapeId(key)} = ${connection.escape(value)}`; break
			}

		}
		var data = [];
		valStr += ' order by seq asc'
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

async function  getResRecursive(idMap,resArray){
	     
		resArray = await selectOne(idMap)
	   if(resArray.length > 0){
	   		for(var i = 0; i < resArray.length ; i++){
	   			resArray[i].children = new Array()
	   			var map = new Map()
	   			map.set('pid',resArray[i].id)
	   			var res = await getResRecursive(map,resArray[i].children)
	   			resArray[i].children = res
	   		}
	   }
	   return resArray
}

var includeList = `id, pid, menuName, icon, url, seq, state, del`
 
  SysMenuService.selectAll  = async function(map,cb){
	 var result = new Array()
	 result = await getResRecursive(map,[])
	 cb(result)
}

SysMenuService.insert = function(menu){
    pool.getConnection(function(err,connection){
        if(err){
            throw err
        }
        var keys = [],values = [], sql = ''
        for(var key in menu){
            keys.push(key)
            values.push('"'+menu[key]+'"');
        }
        if(keys.length > 0 && values.length > 0){
            sql  = 'insert into sys_menu('
            sql += keys.join(",")
            sql += ')'
            sql += 'values('
            sql += values.join(",")
            sql += ")"
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

SysMenuService.updateById = function(menu,cb){
    pool.getConnection(function(err,connection){
        if(err){
            throw err
        }
        var keys = [],values = [], sql = ''
        for(var key in menu){
            keys.push(key)
        }
        if(keys.length > 0){
            sql  = 'update sys_menu set '
            for(var i = 0; i < keys.length; i++){
                if(keys[i] != 'id'){
                    sql += keys[i]+" = ? ,"
                    values.push(menu[keys[i]]);
                }
            }
            if(sql.indexOf(',')){
                sql = sql.substring(0,sql.length-1);
            }
            sql += 'where id = ?'
            values.push(menu['id']);
        }
        if(sql != ''){
            var query = connection.query(sql,values,function(error,results,field){
                if(error){
                    cb(results)
                    console.error('更新失败 ' + error.sqlMessage + ' rows')                    
                }else{
                    cb(results)
                    console.log('更新成功changed ' + results.changedRows + ' rows')
                }
            })
            console.log(query.sql)
            connection.release()
        }
        
        
    })
}

SysMenuService.deleteById = function(id){
    pool.getConnection(function(err,connection){
        if(err){
            throw err
        }
        var sql = 'delete from sys_menu where id = ?'
        var query = connection.query(sql,[id],function(error,results,field){
            if(error){
                throw error
            }
            console.log('删除成功delete ' + results.affectedRows + ' rows')
        })
        console.log(query.sql)
        connection.release()
    })
}

module.exports = SysMenuService