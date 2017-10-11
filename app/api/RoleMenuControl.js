"use strict"
var SysRoleMenuControl = {}

var SysRoleMenuService = require('../dao/RoleMenuMapper.js')
  
//处理req的数据。
function reqJsonToMap(req){
	var data = null
	if(req.method == 'POST'){
		 data = req.body	//通过bodyparse将post数据转化在body里的数据
		
	}else if(req.method == 'GET'){
		data = req.query
	}
	if(data && Object.prototype.toString.apply(data) === '[object Object]'){
		for(let key in data){
			 if(data[key] == 'undefined'){
                 data[key] = ''
             }
		}
	}else if(data && Object.prototype.toString.apply(data) === '[object Array]'){
			for(var i = 0; i<data.length; i++){
            for(let key in data[i]){
				 if(data[i][key] == 'undefined'){
                 data[i][key] = ''
                  }
			}
            }
            
		}
	}

  
//前置control,统一处理传过来的数据

SysRoleMenuControl.preHandle = {
     path: '/SysRoleMenuControl/*',
     method:'all',
     cb:function(req,res,next){
            /**
            * 将req中的json数据转化成map类型
            * 王毅
            * 2017年09月22日19:05:03
            */
            reqJsonToMap(req)
            
            
                 next()
            
        }
}

//增

SysRoleMenuControl.addRoleMenu = {
    path: '/SysRoleMenuControl/addRoleMenu',
        method:"post",
            cb:function (req, res, next) {
                res.header('content-type', 'application/json;charset=utf8')//设置返回值为json格式
                var RoleMenu = req[('post' == "post"&&"body")||"query"]
                var returnObj = {
                    info: '',
                    dataList: [],
                    result: '200'
                }
                try {
                    SysRoleMenuService.insert(RoleMenu, function (result) {
                        returnObj.info = '添加成功'
                        res.send(JSON.stringify(returnObj))
                        next()
                    })
                } catch (error) {
                    returnObj.info = error
                    returnObj.result = '500'
                    res.send(JSON.stringify(returnObj))
                    next()
                }
            }
}

//删

SysRoleMenuControl.deleteRoleMenu = {
    path: '/SysRoleMenuControl/deleteRoleMenu',
        method:"get",
            cb:function (req, res, next) {
                res.header('content-type', 'application/json;charset=utf8')//设置返回值为json格式
                var RoleMenu = req[('get' == "post"&&"body")||"query"]
                var returnObj = {
                    info: '',
                    dataList: [],
                    result: '200'
                }
                try {
                    SysRoleMenuService.deleteById(RoleMenu, function (result) {
                        returnObj.info = '删除成功'
                        res.send(JSON.stringify(returnObj))
                        next()
                    })
                } catch (error) {
                    returnObj.info = error
                    returnObj.result = '500'
                    res.send(JSON.stringify(returnObj))
                    next()
                }
            }
}

//改

SysRoleMenuControl.updateRoleMenu = {
    path: '/SysRoleMenuControl/updateRoleMenu',
        method:"post",
            cb:function (req, res, next) {
                res.header('content-type', 'application/json;charset=utf8')//设置返回值为json格式
                var RoleMenu = req[('post' == "post"&&"body")||"query"]
                var returnObj = {
                    info: '',
                    dataList: [],
                    result: '200'
                }
                try {
                    SysRoleMenuService.updateById(RoleMenu, function (result) {
                        returnObj.info = '修改成功'
                        res.send(JSON.stringify(returnObj))
                        next()
                    })
                } catch (error) {
                    returnObj.info = error
                    returnObj.result = '500'
                    res.send(JSON.stringify(returnObj))
                    next()
                }
            }
}

//查

SysRoleMenuControl.getRoleMenuList = {
    path: '/SysRoleMenuControl/getRoleMenuList',
    method: "get",
    cb: function (req, res, next) {
        res.header('content-type', 'application/json;charset=utf8')//设置返回值为json格式
        var RoleMenu = req[('get' == "post"&&"body")||"query"]
        var returnObj = {
            info: '',
            dataList: [],
            result: '200'
        }
        try {
            SysRoleMenuService.selectAll(RoleMenu, function (result) {
                returnObj.info = '查询成功！'
                returnObj.dataList = result
                
                res.send(JSON.stringify(returnObj))
                next()
            })
        } catch (error) {
            returnObj.info = error
            returnObj.result = '500'
            res.send(JSON.stringify(returnObj))
            next()
        }
    }
}

module.exports = SysRoleMenuControl