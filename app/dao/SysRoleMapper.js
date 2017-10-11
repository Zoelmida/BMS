/**
 * yaoliguo
 * 2017-9-16
 */
var mysql = require('mysql')

var bms = require('./dbconfig.js')

var SysRoleService = {}

var includeList = 'id,pid,roleName,descript,del'

var pool = mysql.createPool(bms)

var fileds = ['id','pid','roleName','descript','del'] //存储数据库的字段，检查传过来的字段的合法性

function selectOne(map){//查询一个数据。
	return new Promise(function(resolve,reject){
		pool.getConnection(function (err, connection) {
		if (err) {
			throw err
		}
		var valStr = 'select ' + includeList + ' from sys_role where 10086=10086 '
		for (var [key, value] of map) {
            if(fileds.indexOf(key) != -1){//如果传过来的字段存在于fields数组中
                valStr += ` and ${connection.escapeId(key)} = ${connection.escape(value)}`;
            }
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

SysRoleService.selectAll = selectAll  = async function(map,cb){
    var result = new Array()
    result = await getResRecursive(map,[])
    cb(result)
}

SysRoleService.insert = function(role){
    pool.getConnection(function(err,connection){
        if(err){
            throw err
        }
        var keys = [],values = [], sql = ''
        for(var key in role){
            keys.push(key)
            values.push('"'+role[key]+'"');
        }
        if(keys.length > 0 && values.length > 0){
            sql  = 'insert into sys_role('
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

SysRoleService.updateById = function(role){
    pool.getConnection(function(err,connection){
        if(err){
            throw err
        }
        var keys = [],values = [], sql = ''
        for(var key in role){
            keys.push(key)
        }
        if(keys.length > 0){
            sql  = 'update sys_role set '
            for(var i = 0; i < keys.length; i++){
                if(keys[i] != 'id'){
                    sql += keys[i]+" = ? ,"
                    values.push(role[keys[i]]);
                }
            }
            if(sql.indexOf(',')){
                sql = sql.substring(0,sql.length-1);
            }
            sql += 'where id = ?'
            values.push(role['id']);
        }
        if(sql != ''){
            var query = connection.query(sql,values,function(error,results,field){
                if(error){
                    throw error
                }
                console.log('更新成功changed ' + results.changedRows + ' rows')
            })
            console.log(query.sql)
            connection.release()
        }
        
        
    })
}

SysRoleService.deleteById = function(id){
    pool.getConnection(function(err,connection){
        if(err){
            throw err
        }
        var sql = 'delete from sys_role where id = ?'
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


module.exports = SysRoleService