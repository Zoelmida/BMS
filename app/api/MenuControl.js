'use strict'
var SysMenuControl = {}

var SysMenuService = require('../dao/MenuMapper.js')
 
  
var userService = require('../dao/UserMapper')
var SysRoleMenuService = require('../dao/RoleMenuMapper')
function deleteUnuseMenu(sysMenu, ids) {
	var menuID = null
	if (ids.indexOf(sysMenu.id)) {
		menuID = sysMenu.id
	}
	else if (sysMenu.children.length > 0) {
		for (var i = 0; i < sysMenu.children.length; i++) {
			var t = deleteUnuseMenu(sysMenu.children[i], ids)
			if (t == null) {
				sysMenu.children.splice(i, 1)
				i--
			}
			else {
				menuID = t
			}

		}
	}
	return menuID
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

SysMenuControl.preHandle = {
	path: '/SysMenuControl/*',
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

SysMenuControl.addMenu = {
	path: '/SysMenuControl/addMenu',
	method:'post',
	cb:function (req, res, next) {
		res.header('content-type', 'application/json;charset=utf8')//设置返回值为json格式
		var Menu = req[('post' == 'post'&&'body')||'query']
		var returnObj = {
			info: '',
			dataList: [],
			result: '200'
		}
		try {
			SysMenuService.insert(Menu, function (result) {
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

SysMenuControl.deleteMenu = {
	path: '/SysMenuControl/deleteMenu',
	method:'get',
	cb:function (req, res, next) {
		res.header('content-type', 'application/json;charset=utf8')//设置返回值为json格式
		var Menu = req[('get' == 'post'&&'body')||'query']
		var returnObj = {
			info: '',
			dataList: [],
			result: '200'
		}
		try {
			SysMenuService.deleteById(Menu, function (result) {
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

SysMenuControl.updateMenu = {
	path: '/SysMenuControl/updateMenu',
	method:'post',
	cb:function (req, res, next) {
		res.header('content-type', 'application/json;charset=utf8')//设置返回值为json格式
		var Menu = req[('post' == 'post'&&'body')||'query']
		var returnObj = {
			info: '',
			dataList: [],
			result: '200'
		}
		try {
			SysMenuService.updateById(Menu, function (result) {
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

SysMenuControl.getMenuList = {
	path: '/SysMenuControl/getMenuList',
	method: 'get',
	cb: function (req, res, next) {
		res.header('content-type', 'application/json;charset=utf8')//设置返回值为json格式
		var Menu = req[('get' == 'post'&&'body')||'query']
		var returnObj = {
			info: '',
			dataList: [],
			result: '200'
		}
		try {
			SysMenuService.selectAll(Menu, function (result) {
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
SysMenuControl.getcurrentUserMenu = {
	path: '/SysMenuControl/getcurrentUserMenu',
	method: 'get',
	cb: function (req, res, next) {
		res.header('content-type', 'application/json;charset=utf8')
		var account = req.session.user.account
		var map = {}
		map['account'] = account
		//先查询角色id
		userService.selectAll(map, function (results) {
			var roleId = results[0].roleId
			map['roleId'] = roleId
			//再根据角色id查询菜单对应id
			SysRoleMenuService.selectAll(map, function (results) {
				//console.log(results)
				var ids = results.map(function (item) {
					return item.menuId
				})//该角色的菜单的id的数组
				//查询所有菜单。
				var rootMenu = {}
				rootMenu['pid'] = '-1'
				SysMenuService.selectAll(rootMenu, function (allMenu) {
					for (var i = 0; i < allMenu.length; i++) {
						var t = deleteUnuseMenu(allMenu[i], ids)
						if (t == null) {
							allMenu.splice(i, 1)
							i--
						}
					}
					var returnObj = {
						info: '',
						dataList: [],
						result: '200'
					}
					returnObj.dataList = allMenu
					res.send(JSON.stringify(returnObj))
					next()
				})
			})
		})
	}
}
module.exports = SysMenuControl