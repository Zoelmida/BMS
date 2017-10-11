"use strict"
var SysUserControl = {}

var SysUserService = require('../dao/UserMapper.js')
  //需要分页
var pagerBean = SysUserService.PagerBean
function reqGetPageInfo(req,cb){
     for(var key in req.query){
         if(pagerBean.hasOwnProperty(key))
         pagerBean[key] = req.query[key]
     }
     SysUserService.count(
          pagerBean,
          function(result){
              var recordCount = 0
              if(result instanceof Array){
                 recordCount = result[0].sum
                 pagerBean.setData(recordCount);
                 for(var key in pagerBean){
                     req.query[key] = pagerBean[key]
                 }
                 cb()
              }else{
                  throw result
              }
          }
     )
}

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

SysUserControl.preHandle = {
     path: '/SysUserControl/*',
     method:'all',
     cb:function(req,res,next){
            /**
            * 将req中的json数据转化成map类型
            * 王毅
            * 2017年09月22日19:05:03
            */
            reqJsonToMap(req)
            //需要分页
            reqGetPageInfo(req,function(){
            console.log("处理分页数据成功")
            next()
            })
            
            
        }
}

//增

SysUserControl.addUser = {
    path: '/SysUserControl/addUser',
        method:"post",
            cb:function (req, res, next) {
                res.header('content-type', 'application/json;charset=utf8')//设置返回值为json格式
                var User = req[('post' == "post"&&"body")||"query"]
                var returnObj = {
                    info: '',
                    dataList: [],
                    result: '200'
                }
                try {
                    SysUserService.insert(User, function (result) {
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

SysUserControl.deleteUser = {
    path: '/SysUserControl/deleteUser',
        method:"get",
            cb:function (req, res, next) {
                res.header('content-type', 'application/json;charset=utf8')//设置返回值为json格式
                var User = req[('get' == "post"&&"body")||"query"]
                var returnObj = {
                    info: '',
                    dataList: [],
                    result: '200'
                }
                try {
                    SysUserService.deleteById(User, function (result) {
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

SysUserControl.updateUser = {
    path: '/SysUserControl/updateUser',
        method:"post",
            cb:function (req, res, next) {
                res.header('content-type', 'application/json;charset=utf8')//设置返回值为json格式
                var User = req[('post' == "post"&&"body")||"query"]
                var returnObj = {
                    info: '',
                    dataList: [],
                    result: '200'
                }
                try {
                    SysUserService.updateById(User, function (result) {
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

SysUserControl.getUserList = {
    path: '/SysUserControl/getUserList',
    method: "get",
    cb: function (req, res, next) {
        res.header('content-type', 'application/json;charset=utf8')//设置返回值为json格式
        var User = req[('get' == "post"&&"body")||"query"]
        var returnObj = {
            info: '',
            dataList: [],
            result: '200'
        }
        try {
            SysUserService.selectAll(User, function (result) {
                returnObj.info = '查询成功！'
                returnObj.dataList = result
                //需要分页
                returnObj.page = req.query
                
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

module.exports = SysUserControl