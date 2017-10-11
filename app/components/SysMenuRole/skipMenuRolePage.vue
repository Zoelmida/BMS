<template>
	 <div id="menuroleList" style="margin: 0;width: 100%;overflow: hidden;">
    		   <el-row type="flex" justify="space-around">
  <el-col :span="11">
  	<el-tag type="primary" v-cloak>角色菜单</el-tag>
  	<div class="grid-content bg-purple">
  		<el-input
  placeholder="输入关键字进行过滤"
  v-model="roleFilterText">
</el-input>

<el-tree
  class="filter-tree"
  :data="roledata"
  :props="roleProps"
  default-expand-all
  highlight-current
  current-node-key="1"	
  :filter-node-method="roleFilterNode"
  @node-click="getMenusByRole"	
  ref="roleTree">
</el-tree>
  		
  	</div>
  
  </el-col>
  <el-col :span="11">
  	<el-tag type="primary" v-cloak>权限菜单</el-tag>
  	<div class="grid-content bg-purple">
  			<el-input
  placeholder="输入关键字进行过滤"
  v-model="menuFilterText">
</el-input>
  	 <el-tree
  :data="menudata"
  show-checkbox
  check-strictly	
  default-expand-all
  node-key="id"
  ref="menuTree"
  :default-checked-keys="defaultMenus"
  :filter-node-method="menuFilterNode"
  :props="menuProps">
</el-tree>
  	</div>
  
  </el-col>
  </el-row> 
   <el-row type="flex" justify="space-around">
    <el-col :span="11"></el-col>
     <el-col :span="11">
     <el-button type="success" v-cloak @click="saveMenuRole" style="float:right;">保存更改</el-button>
     </el-col>
  
    </el-row>
     </div>
</template>
<style scoped>
    #icon-list{
       display:none;
     }
</style>
<script>
import axios from 'axios'
import querystring from 'querystring'
var baseUtil = require('../../util/base')
export default{
    watch: {
    	      filterText:function(val) {
    	        this.$refs.bmsrolemanage.filter(val);
              },
              roleFilterText:function(val) {
    	        this.$refs.roleTree.filter(val);
            },
            menuFilterText:function(val) {
                this.$refs.menuTree.filter(val);
            }
            },
    data(){
        return {
            defaultMenus:[],
    		//存放角色的数据
            roledata: [{pid:'',id:"-1",roleName:"一级角色",icon:"",children:[]},
          		     ],
          	//存放菜单的数据
          	 menudata:[{pid:'',id:"-1",menuName:"一级菜单",icon:"",children:[]}],
            roleProps: {  
                children: 'children',  
                label: 'roleName'  
            }  ,
            menuProps: {  
                children: 'children',  
                label: 'menuName'  
            }, 
            roleFilterText:"",
            menuFilterText:"",
            roleId:'-1',
            getRoleURL:baseUtil.WebRootUrl+"/SysRoleControl/getRoleList",
            getMenuByRoleIdURL:baseUtil.WebRootUrl+"/SysMenuRole/getMenusByRoleId",
            saveMenuRoleURL:baseUtil.WebRootUrl+"/SysMenuRole/saveMenuRole",
            getMenuURL:baseUtil.WebRootUrl+"/SysMenuControl/getMenuList"
        }
    }  ,
    mounted:function(){ 
    		this.getRoleData();
    		this.getMenuData();
        },
    methods:{
         
    		getMenusByRole:function(obj,data,node){
    			this.getMenuByRoleId(obj.id);
    		},
    		roleFilterNode:function(value, data) {
    	            if (!value) return true;
    	            return data.roleName.indexOf(value) !== -1;
    	          },
    	    menuFilterNode:function(value, data) {
    	              if (!value) return true;
    	              return data.menuName.indexOf(value) !== -1;
    	            },
    	            saveMenuRoleURL:function(){
    	            	
    	            }, 
    	    getRoleData:function(){
    	    	var vm = this;
    			axios.get(vm.getRoleURL,{params:{"pid":"-1"}})
    			.then((response) => {
    				vm.info = response.data.info;
    				if(response.data.result == "200"){
     				 vm.roledata[0].children.length = 0;
    				 vm.removeChilren(response.data.dataList);
    				 vm.$set(vm.roledata[0],'children',response.data.dataList); 	 
     				}
    			})
    			.catch(function(response) {
    				vm.info="有异常了";
    			})
    	    },
    	    getMenuData:function(){
    	    	var vm = this;
    			axios.get(vm.getMenuURL,{params:{"pid":"-1"}})
    			.then((response) => {
    				vm.info = response.data.info;
    				if(response.data.result == "200"){
     				 vm.menudata[0].children.length = 0;
    				 vm.removeChilren(response.data.dataList);
    				 vm.$set(vm.menudata[0],'children',response.data.dataList); 	 
     				}
    			})
    			.catch(function(response) {
    				vm.info="有异常了";
    			})
    	    },
    	    getMenuByRoleId:function(roleId){
    	    	var vm = this;
    	    	vm.roleId = roleId;
    			axios.get(vm.getMenuByRoleIdURL,{params:{"roleId":roleId}})
    			.then((response) => {
    				vm.info = response.data.info;
    				if(response.data.result == "200"){
     				 vm.defaultMenus.length = 0;
    				 vm.removeChilren(response.data.dataList);
    				 response.data.dataList.forEach(function(item){
    					 vm.defaultMenus.push(item.menuId);
    				 });
    				 vm.$refs.menuTree.setCheckedKeys(vm.defaultMenus);
    				// vm.$set(vm.menudata[0],'children',response.data.dataList); 	 
     				}
    			})
    			.catch(function(response) {
    				vm.info="有异常了";
    			})
    	    },
    	    saveMenuRole:function(){
    	    	var vm = this;
    	    	var menuroleJson = [];
    	    	var getCheckMens = vm.$refs.menuTree.getCheckedKeys();
    	    	getCheckMens.forEach((item)=>(menuroleJson.push({roleId:vm.roleId,menuId:item})));
    	    	getCheckMens.length == 0?menuroleJson.push({roleId:vm.roleId,menuId:'-1'}):"";
    	    	if(vm.roleId == '-1'){
    	    		
    	    		vm.$showMess({message:"请现在左侧选择一个不为一级角色的角色！",messType:'info'}); 
    	    		return;
    	    	}
 				axios.post(vm.saveMenuRoleURL,querystring.stringify(menuroleJson))
    			.then((response) => {
    				vm.info = response.data.info;
    				if(response.data.result == "200"){
    			     vm.$showMess({message:"保存成功！",messType:'success'}); 
     				 vm.getMenuByRoleId(vm.roleId);
    				 
    				// vm.$set(vm.menudata[0],'children',response.data.dataList); 	 
     				}
    			})
    			.catch(function(response) {
    				vm.info="有异常了";
    				vm.$showMess({message:"保存失败！",messType:'error'});
    			})
    	    },
    	    removeChilren:function(arr){
  			  let i = 0;
  			  for(;i<arr.length;i++){
  				  if(arr[i].children.length > 0){
  					  this.removeChilren(arr[i].children);
  				  }
  				  else{
  					  delete arr[i].children;
  				  }
  			  }
  		},
    	
    }          
}
</script>
