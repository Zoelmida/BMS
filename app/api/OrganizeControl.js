"use strict"
var SysOrganizeControl = {}

var SysOrganizeService = require('../dao/OrganizeMapper.js')
  
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

SysOrganizeControl.preHandle = {
     path: '/SysOrganizeControl/*',
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

SysOrganizeControl.addOrganize = {
    path: '/SysOrganizeControl/addOrganize',
        method:"post",
            cb:function (req, res, next) {
                res.header('content-type', 'application/json;charset=utf8')//设置返回值为json格式
                var Organize = req[('post' == "post"&&"body")||"query"]
                var returnObj = {
                    info: '',
                    dataList: [],
                    result: '200'
                }
                try {
                    SysOrganizeService.insert(Organize, function (result) {
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

SysOrganizeControl.deleteOrganize = {
    path: '/SysOrganizeControl/deleteOrganize',
        method:"get",
            cb:function (req, res, next) {
                res.header('content-type', 'application/json;charset=utf8')//设置返回值为json格式
                var Organize = req[('get' == "post"&&"body")||"query"]
                var returnObj = {
                    info: '',
                    dataList: [],
                    result: '200'
                }
                try {
                    SysOrganizeService.deleteById(Organize, function (result) {
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

SysOrganizeControl.updateOrganize = {
    path: '/SysOrganizeControl/updateOrganize',
        method:"post",
            cb:function (req, res, next) {
                res.header('content-type', 'application/json;charset=utf8')//设置返回值为json格式
                var Organize = req[('post' == "post"&&"body")||"query"]
                var returnObj = {
                    info: '',
                    dataList: [],
                    result: '200'
                }
                try {
                    SysOrganizeService.updateById(Organize, function (result) {
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

SysOrganizeControl.getOrganizeList = {
    path: '/SysOrganizeControl/getOrganizeList',
    method: "get",
    cb: function (req, res, next) {
        res.header('content-type', 'application/json;charset=utf8')//设置返回值为json格式
        var Organize = req[('get' == "post"&&"body")||"query"]
        var returnObj = {
            info: '',
            dataList: [],
            result: '200'
        }
        try {
            SysOrganizeService.selectAll(Organize, function (result) {
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

module.exports = SysOrganizeControl