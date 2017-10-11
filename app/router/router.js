//import login from '../template/login'
//import index from '../template/index'
import axios from 'axios'
var baseUtil = require('../util/base')
/**
 * 导入组件  
 * wangyi
 * 2017年9月12日08:54:54
 */

const login = () => import(/* webpackChunkName: "long-vue" */ '../components/login')

const error_404 = () => import(/* webpackChunkName: "404-vue" */ '../components/404')


var getURL = baseUtil.WebRootUrl + "/SysMenuControl/getcurrentUserMenu"
///获取所有菜单并把菜单添加为index的子路径
function getSubRouter() {
	axios.get(LeftMenuVm.getURL, {
		params: {
			"data.pid": "-1"
		}
	})
		.then(function (response) {
			var menuArray = [];
			for (var i in response.data.dataList) {
				menuArray.push(response.data.dataList[i]);
			}
			LeftMenuVm.info = response.data.info;
			if (response.data.result == "200") {
				LeftMenuVm.$set(LeftMenuVm, 'menus', menuArray);
			}
		})
		.catch(function (error) {
			alert("获取菜单失败！");
		});
}

const routes = [{
	path: '/login',
	component: login,
	name: 'login'
} ,
{
	path: '/NotFound',
	component: error_404,
	name: 'error_404'
} 
]
export default routes