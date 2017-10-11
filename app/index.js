import './static/css/base.css'
import '../node_modules/element-ui/lib/theme-default/index.css'
import Vue from 'vue'
import ElementUI from 'element-ui'
import 'babel-polyfill'
import VueRouter from 'vue-router'
import vuex from 'vuex'
import axios from 'axios'
import querystring from 'querystring'
import routes from './router/router.js'
import App from './components/App.vue'
import store from './store'
import { mapGetters, mapMutations } from 'vuex'
var routeUtil = require('./util/routeUtil')
var {messageHelper} = require('./util/message')
var srcoll = require('./util/scroll')
var baseUtil = require('./util/base')
var testSession  = '/sessionControl'
Vue.use(ElementUI)

Vue.use(VueRouter)

Vue.use(messageHelper)

Vue.use(srcoll)

Vue.use(vuex)

var router = new VueRouter({
	routes
})

var routeIsLoaded = false;
//先检查用户是否登录,如果登录那么动态增加路由
async function getMenu(getURL){
	await axios.get(getURL, {
		params: {
			'data.pid': '-1'
		}
	})
		.then(function (response) {
			var menuArray = []

			for (var i in response.data.dataList) {
				menuArray.push(response.data.dataList[i])
			}
			routeUtil.addRouter(menuArray,router)
		})
		.catch(function (error) {
			alert('获取菜单失败！')
		})
}
async function genRoute(){
	var result = 0;
	await axios.post(testSession, querystring.stringify({ query: 'account', action: 'get' })).then(function (res) {
		if (res.data.account == 1) {//证明用户登录过了,接下来获取用户的数据
			
			result = 1
			
		}

	}).catch(function (error) {
	
	})
	if(result == 1){
		var getURL = baseUtil.WebRootUrl + '/SysMenuControl/getcurrentUserMenu'
		await getMenu(getURL)
		routeIsLoaded = true
	}	
}

/////routes的导航钩子
router.beforeEach((to, from, next) => {
	
	//获取session的信息
	axios.post(testSession, querystring.stringify({ query: 'account', action: 'get' })).then(function (res) {
		if (to.path != '/login' && res.data.account == 0) {
			next({
				path: '/login'
			})
		} else if (to.matched.length == 0) {
			console.log(router)
			if(routeIsLoaded){
				next({
					path: '/NotFound'
				})
			}else{
				
				new Promise(async function(resolve){
					await genRoute()
					resolve()
				}).then(function(res){
					next({
						path:to.path
					})
				})
			}
			
		}
		else {
			next()
		}
	}).catch(function (error) {
		next({
			path: '/login'
		})
	})

})

new Vue({
	store,
	router,
	render: h => h(App),
	computed: mapGetters([
		'IndexVues'
	])
	,
	methods: mapMutations([
		'setIndexVues'
	])

}).$mount('#app')
