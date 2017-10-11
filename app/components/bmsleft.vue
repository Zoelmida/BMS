<template>
	<div id="leftmenu">

		<vue-scrollPanel>
			<vue-scroll-con>
				<el-menu :router='true' default-active="1" class="el-menu-vertical-demo" @open="handleOpen" @close="handleClose" theme="dark" key="(index+1)+''" @select="handleSelect" :collapse="false">
					<bmsmenu v-for="(menu,index) in menus" :menu="menu" :index="(index+1)+''" :allindex="(index+1)+''" :key="(index+1)+''">

					</bmsmenu>
				</el-menu>
			</vue-scroll-con>
		</vue-scrollPanel>
		<vue-scroll>

		</vue-scroll>
	</div>
</template>
<script>
import axios from 'axios'
import querystring from 'querystring'
var baseUtil = require('../util/base')

export default {
	name: 'bmsleft',
	data() {
		return {
			menus: [],
			info: "",
			getURL: baseUtil.WebRootUrl + "/SysMenuControl/getcurrentUserMenu",
		}
	},
	mounted() {
		this.getData();
	},
	methods: {
		 
		handleSelect() {
			var vueComponets = arguments[2];
			var url = vueComponets.$el.id;
			var menuname = vueComponets.$el.getAttribute("name");
			document.getElementById("indexFrame").src = url;
			var f = this.$store.IndexVues['initHead'].bmstabs.every(function(item) {
				return item.url !== url;
			});
			if (f) {
				this.$store.IndexVues['initHead'].state.bmstabs.push({
					name: url,
					menuname: menuname,
					url: url,
					closable: true
				});
			}

			//this.$store.IndexVues['initHead'].bmsactivetab = url;

		},
		handleOpen(key, keyPath) {
			console.log(key, keyPath);
		},
		handleClose(key, keyPath) {
			console.log(key, keyPath);
		},
		getData() {
			var LeftMenuVm = this;
			axios.get(LeftMenuVm.getURL, {
				params: {
					"data.pid": "-1"
				}
			})
				.then(function(response) {
					var menuArray = [];

					for (var i in response.data.dataList) {
						menuArray.push(response.data.dataList[i]);
					}

				    LeftMenuVm.menus = LeftMenuVm.$store.state.menuData;
					LeftMenuVm.info = response.data.info;
					if (response.data.result == "200") {
						LeftMenuVm.$set(LeftMenuVm, 'menus', menuArray);
					}
				})
				.catch(function(error) {
					alert("获取菜单失败！");
				});
		}
	},
	components: {

		'bmsmenu': {
			name: "bmsmenu",
			template: '#left-menu-template',
			props: ['menu', 'index', 'allindex'],
			data() {
				return {
					WebRootUrl: baseUtil.WebRootUrl + "/"
				}
			},
			computed: {
				getIndex() {
					return this.allindex.trim().toLowerCase();
				}
			}
		}

	}
}
</script>