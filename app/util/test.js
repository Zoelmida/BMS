var fs = require('fs')
var path = require('path')
var apiTemplate = fs.readFileSync(path.resolve(__dirname, '../../genApiAndDao/api.template'), {
	encoding: 'utf8'
})

var tt =  `
"use strict"
var Sys{__TABLE_ALIAS_NAME__}Control = {}

var Sys{__TABLE_ALIAS_NAME__}Service = require('{__REQUIRE_DAO_NAME__}')
  {__IF_PAGINATION__}//需要分页
var pagerBean = Sys{__TABLE_ALIAS_NAME__}Service.pagerBean
function reqGetPageInfo(req,cb){
     pagerBean = Object.assign(req.query,pagerBean)
     Sys{__TABLE_ALIAS_NAME__}Service.count(
          pagerBean,
          function(result){
              var recordCount = 0
              if(result instanceof Array){
                 recordCount = result[0].sum
                 pagerBean.setRecordCount(recordCount)
                 pagerBean.setData(recordCount);
                 req.query = Object.assign(req.query,pagerBean)
                 cb()
              }else{
                  throw result
              }
          }
     )
}
{__END_IF__}
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
                 data[key] = ''
                  }
			}
            }
            
		}
	}

  
//前置control,统一处理传过来的数据

Sys{__TABLE_ALIAS_NAME__}Control.preHandle = {
     path: '/Sys{__TABLE_ALIAS_NAME__}Control',
     method:'all',
     cb:function(req,res,next){
            /**
            * 将req中的json数据转化成map类型
            * 王毅
            * 2017年09月22日19:05:03
            */
            reqJsonToMap(req)
            {__IF_PAGINATION__}//需要分页
            reqGetPageInfo(req,function(){
            console.log("处理分页数据成功")
            next()
            })
            {__END_IF__}
            {__IF_NOPAGINATION__}
                 next()
            {__END_IF__}
        }
}

//增

Sys{__TABLE_ALIAS_NAME__}Control.add{__TABLE_ALIAS_NAME__} = {
    path: '/Sys{__TABLE_ALIAS_NAME__}Control/add{__TABLE_ALIAS_NAME__}',
        method:"{__ADD_METHOD__}",
            cb:function (req, res, next) {
                res.header('content-type', 'application/json;charset=utf8')//设置返回值为json格式
                var {__TABLE_ALIAS_NAME__} = req[('{__ADD_METHOD__}' == "post"&&"body")||"query"]
                var returnObj = {
                    info: '',
                    dataList: [],
                    result: '200'
                }
                try {
                    Sys{__TABLE_ALIAS_NAME__}Service.insert({__TABLE_ALIAS_NAME__}, function (result) {
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

Sys{__TABLE_ALIAS_NAME__}Control.delete{__TABLE_ALIAS_NAME__} = {
    path: '/Sys{__TABLE_ALIAS_NAME__}Control/delete{__TABLE_ALIAS_NAME__}',
        method:"{__DELETE_METHOD__}",
            cb:function (req, res, next) {
                res.header('content-type', 'application/json;charset=utf8')//设置返回值为json格式
                var {__TABLE_ALIAS_NAME__} = req[('{__DELETE_METHOD__}' == "post"&&"body")||"query"]
                var returnObj = {
                    info: '',
                    dataList: [],
                    result: '200'
                }
                try {
                    Sys{__TABLE_ALIAS_NAME__}Service.deleteById({__TABLE_ALIAS_NAME__}, function (result) {
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

Sys{__TABLE_ALIAS_NAME__}Control.update{__TABLE_ALIAS_NAME__} = {
    path: '/Sys{__TABLE_ALIAS_NAME__}Control/update{__TABLE_ALIAS_NAME__}',
        method:"{__UPDATE_METHOD__}",
            cb:function (req, res, next) {
                res.header('content-type', 'application/json;charset=utf8')//设置返回值为json格式
                var {__TABLE_ALIAS_NAME__} = req[('{__UPDATE_METHOD__}' == "post"&&"body")||"query"]
                var returnObj = {
                    info: '',
                    dataList: [],
                    result: '200'
                }
                try {
                    Sys{__TABLE_ALIAS_NAME__}Service.updateById({__TABLE_ALIAS_NAME__}, function (result) {
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

Sys{__TABLE_ALIAS_NAME__}Control.get{__TABLE_ALIAS_NAME__}List = {
    path: '/Sys{__TABLE_ALIAS_NAME__}Control/get{__TABLE_ALIAS_NAME__}List',
    method: "{__SELECT_METHOD__}",
    cb: function (req, res, next) {
        res.header('content-type', 'application/json;charset=utf8')//设置返回值为json格式
        var {__TABLE_ALIAS_NAME__} = req[('{__SELECT_METHOD__}' == "post"&&"body")||"query"]
        var returnObj = {
            info: '',
            dataList: [],
            result: '200'
        }
        try {
            Sys{__TABLE_ALIAS_NAME__}Service.selectAll({__TABLE_ALIAS_NAME__}, function (result) {
                returnObj.info = '查询成功！'
                returnObj.dataList = result
                {__IF_PAGINATION__}//需要分页
                returnObj = {}
                returnObj.page = req.query
                {__END_IF__}
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

module.exports = Sys{__TABLE_ALIAS_NAME__}Control
`
try{
	var reg = /\{__IF_PAGINATION__\}(?:[\s\S]*?)*?\{__END_IF__\}/g
	tt =  tt.replace(reg,'')//reg.test(apiTemplate)//apiTemplate.replace(reg,'')   //reg.exec(str) // str.replace(reg,'')
	//tt = tt.replace(reg,'')   
	console.log(tt)
	//console.log(tt)
	//console.log(String.prototype.toString.apply(apiTemplate))
}catch(e){
	console.log(e)
}

