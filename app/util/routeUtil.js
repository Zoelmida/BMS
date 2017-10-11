/**
 * wangyi
 * 2017年9月14日08:31:03
 * 专门设置路由的路径
 */
//首页组件
const indexCom = require(/* webpackChunkName: "index-vue" */ '../components/index')

 

var routeUtil = {

}



routeUtil.addRouter = function (menuArray, $router) {
	var index = [{
		path: '/index',
		components: indexCom,
		name: 'index',
		children: []
	}]
	var childrenArray = index[0].children = []
	fillRouter(menuArray, childrenArray)
	$router.addRoutes(index)
}

function fillRouter(menuArray, childrenArray) {
	for (var i = 0; i < menuArray.length; i++) {
		if (menuArray[i].children.length > 0) {
			fillRouter(menuArray[i].children, childrenArray)
		} else {
			//const com = () => import(/* webpackChunkName: "index-vue" */ '../template/404.vue')
			//const com = 
			// const com = require.ensure([],(resolve) => {
			// 	var a = require('../template/404.vue')
			// 	resolve('../template/404.vue')
			// } ,'index-sub-vue')
			(function(i){
				let asynccomponent = "";
				 
					asynccomponent = () =>{ return import(/* webpackChunkName: "vue-[request]"*/ `../components${menuArray[i].url}`)									
					  
					 .catch (err => {

					return require(/* webpackChunkName: "vue-componets" */ `../components/developing`)														
				 	}) }
				childrenArray.push({
					path: menuArray[i].url,
					name: menuArray[i].url.replace(/\//g, '-'),
					component: asynccomponent  
				})
			})(i)
			
		}
	}
}

module.exports = routeUtil