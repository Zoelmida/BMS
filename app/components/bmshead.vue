<template>
	<div id="head">
		<!-- 标签页 -->
		<div id="tabsPage">
			<el-tabs v-model="bmsactivetab" type="card" @tab-remove="removeTab" @tab-click="tabClick">
				<el-tab-pane v-for="(item, index) in $store.state.bmstabs" :key="item.url" :label="item.menuname" :name="item.url" :id="item.url" :closable="item.closable">

				</el-tab-pane>
			</el-tabs>
		</div>
		<!-- 一些操作 -->
		<div id="editPerson">
			<el-dropdown style="height:42px;line-height:42px" @command="handerOpsClick">
				<span class="el-dropdown-link" style="cursor: pointer;color: #20a0ff;font-size:17px">
						    下拉菜单<i class="el-icon-caret-bottom el-icon--right"></i>
						  </span>
				<el-dropdown-menu slot="dropdown">
					<el-dropdown-item v-cloak command="logout">退出系统</el-dropdown-item>
				</el-dropdown-menu>
			</el-dropdown>
		</div>
	</div>
</template>
<script>
		var baseUtil  =  require('../util/base')

	export default {
		name:'bmshead',
		data() {
			return {
                    
                    bmsactivetab: "#",
                    logoutURL: baseUtil.WebRootUrl + "/LoginControl/logOut"
                }
		},
		mounted() { },
		methods: {
                    tabClick: function() {
                        console.log(arguments);
                        console.log(indexModule.IndexVues['initHead'].bmsactivetab);
                        var url = indexModule.IndexVues['initHead'].bmsactivetab;
                        if (url == '#') {
                            url = indexModule.defaultUrl;
                        }
                        document.getElementById("indexFrame").src = url;
                    },
                    removeTab: function(targetName) {
                        var tabs = this.bmstabs;
                        var activeName = this.bmsactivetab;
                        if (activeName === targetName) {
                            tabs.forEach((tab,index)=>{
                                if (tab.url === targetName) {
                                    var nextTab = tabs[index + 1] || tabs[index - 1];
                                    if (nextTab) {
                                        activeName = nextTab.url;
                                    }
                                }
                            }
                            );
                        }

                        this.bmsactivetab = activeName;
                        this.bmstabs = tabs.filter(tab=>tab.url !== targetName);
                        var url = indexModule.IndexVues['initHead'].bmsactivetab;
                        if (url == '#') {
                            url = indexModule.defaultUrl;
                        }
                        document.getElementById("indexFrame").src = url;
                    },
                    handerOpsClick:function(command){
                    	if(command == 'logout'){
                    		var vm = this;
                    		vm.$http.get(vm.logoutURL).then((response)=>{
                            	vm.info = response.data.info;
                                if (response.data.result == "200") {
                                    // console.log(response.data.dataList);
                                	vm.$showMess({message:'成功登出',messType:'success'});
                                	window.location.href="login.html";
                                }
                            }
                            ).catch(function(response) {
                            	vm.$showMess({message:'登出失败',messType:'error'});
                            });
                    		
                    	}
                    }
                 } 
	}
</script>