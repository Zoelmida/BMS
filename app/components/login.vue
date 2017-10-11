<style>

</style>

<style scoped>
#login{
	display:flex;
	justify-content:center;
	height: 100%;
	align-items:center;
}
.login-container {
    -webkit-border-radius: 5px;
    border-radius: 5px;
    -moz-border-radius: 5px;
    background-clip: padding-box;
   	margin: 0 auto; 
    width: 350px;
    padding: 35px 35px 15px 35px;
    background: #fff;
    border: 1px solid #eaeaea;
    box-shadow: 0 0 25px #cac6c6;
}
.title {
    margin: 0px auto 40px auto;
    text-align: center;
    color: #505458;
  }
.imgCode{
	 width: 105px;
	 height: 38px;
	 margin-left: 10px;
	 cursor:pointer;
}

</style>

<template>
	<div id="login" v-cloak @keyup.enter="submit">
		<el-form class="demo-ruleForm login-container">
			<h3 class="title">BMS登录</h3>
			<el-form-item>
				<el-row>
					<el-col>
						<div class="grid-content bg-purple">
							<el-input placeholder="输入帐号" v-model="userView.account">
								<template slot="prepend">帐号</template>
							</el-input>
						</div>
					</el-col>
				</el-row>
			</el-form-item>
			<el-form-item>
				<el-row>
					<el-col>
						<div class="grid-content bg-purple">
							<el-input placeholder="输入密码" type="password" v-model="userView.password">
								<template slot="prepend">密码</template>
							</el-input>
						</div>
					</el-col>
				</el-row>
			</el-form-item>
			<el-form-item>
				<el-row>
					<el-col :span="16">
						<div class="grid-content bg-purple">
							<el-input placeholder="输入验证码" v-model="userView.code">
								<template slot="prepend">验证码</template>
							</el-input>
						</div>
					</el-col>
					<el-col :span="8">
						<div class="grid-content bg-purple">
							<img class="imgCode" :src="codeUrl" alt="点击刷新验证码" @click="changeCode">
						</div>
					</el-col>
				</el-row>
			</el-form-item>
			<el-form-item style="width:100%;">
				<el-button type="primary" style="width:100%;" @click="submit">登录</el-button>
			</el-form-item>
		</el-form>
	</div>
</template>



<script>
import axios from 'axios'
import querystring from 'querystring'
var baseUtil = require('../util/base')
var routeUtil = require('../util/routeUtil')
export default {
	data() {
		return {
			userView: {
				account: "root",
				password: "root",
				code: ""
			},
			info: "",
			postURL: "/LoginControl/login/auth",
			getURL: baseUtil.WebRootUrl + "/SysMenuControl/getcurrentUserMenu",
			codeUrl: '/getCode?rand=' + Math.random()
		}
	},
	methods: {
		submit: function() {
			var vm = this;
			
			axios.post(this.postURL, querystring.stringify(this.userView))
				.then(function(response) {

					vm.info = response.data.msg;
					vm.$message({
						showClose: true,
						message: vm.info
					});

					if (response.data.result == "200") {
						//window.location.href = "index.html";					 
						axios.get(vm.getURL, {
							params: {
								"data.pid": "-1"
							}
						})
							.then(function(response) {
								vm.info = response.data.info;
								if (response.data.result == "200") {
									//vm.$set(vm, 'menus', menuArray);
									var menuArray = [];
									for (var i in response.data.dataList) {
										menuArray.push(response.data.dataList[i]);
									}
									//获取完menu以后，将menu增加到路由下
									routeUtil.addRouter(menuArray,vm.$router)
									vm.$store.commit('setMenuData',menuArray)
									vm.$router.push({
										name: 'index'
									})
								}
							})
							.catch(function(error) {
								routeUtil.addRouter([],vm.$router)
								alert("获取菜单失败！");
							});

					}
					vm.changeCode();
				})
				.catch(function(response) {
					vm.info = "有异常了！";
					vm.$message({
						showClose: true,
						message: vm.info
					});
					vm.changeCode();
				})

		},
		changeCode: function() {
			this.codeUrl = "/getCode?rand=" + Math.random();
		}
	}
}

</script>
