<template>
	 <div id="userList" v-cloak>
            <el-row>
                 
                     <el-col :xs="12" :sm="12" :md="12" :lg="12">
                        <el-input placeholder="请输入内容" v-model="keyword">
                            <el-select v-model="page.field" slot="prepend" placeholder="请选择">
                                <el-option label="主鍵" value="id"></el-option>
                                <el-option label="名字" value="userName"></el-option>
                                <el-option label="拼音" value="userNameEn"></el-option>
                                <el-option label="帐号" value="account"></el-option>
                                <el-option label="性别" value="sex"></el-option>
                                <el-option label="邮箱" value="email"></el-option>
                                <el-option label="创建时间" value="createTime"></el-option>
                            </el-select>
                            <el-button slot="append" icon="search" @click="setKeyword"></el-button>
                        </el-input>
                     </el-col>
                 
                
                    <el-col :xs="12" :sm="12" :md="12" :lg="12">
                        <el-button type="primary" @click="handleAdd">新增</el-button>
                       <el-button type="danger" @click="handleDeletes">批量删除</el-button>
                      </el-col>
                 
               
                    
                
            </el-row>
            <el-row type="flex" justify="center" style="margin-top:10px;">
                <el-col :span="24">
                    <div class="grid-content bg-purple">
                        <template>
                            <el-table :data="tableData" :border="true" style="width:100%" :fit="true" @selection-change="getCheck" @sort-change="sortChange">
                                <el-table-column width="55" type="selection"></el-table-column>
                                <el-table-column prop="seq" show-overflow-tooltip label="序号"  width="100"></el-table-column>
                               <!--  <el-table-column prop="id" show-overflow-tooltip label="主鍵" sortable width="200"></el-table-column> -->
                                <el-table-column prop="userName" show-overflow-tooltip label="名字" sortable="custom"></el-table-column>
                                 <el-table-column prop="organizName" show-overflow-tooltip label="组织" ></el-table-column>
                                <el-table-column prop="roleName" show-overflow-tooltip label="角色" ></el-table-column>
                                <el-table-column prop="userNameEn" show-overflow-tooltip label="拼音" sortable="custom"></el-table-column>
                                <el-table-column prop="account" show-overflow-tooltip label="帐号"></el-table-column>
                                <el-table-column prop="sex" show-overflow-tooltip label="性别" width="70"></el-table-column>
                                <el-table-column prop="email" show-overflow-tooltip label="邮箱"></el-table-column>
                                <el-table-column prop="createTime" show-overflow-tooltip label="创建时间" sortable width="184"></el-table-column>
                                <el-table-column label="操作" show-overflow-tooltip>
                                    <template scope="scope">
                                        <el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                                        <el-button size="small" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </template>
                    </div>
                </el-col>
            </el-row>
            <!-- 菜单的添加、编辑对话框窗口 -->
            <el-dialog :title="bmsUserTitle" :visible.sync="bmsUserVisible">
                <el-form :model="user" :rules="userRule" ref="userForm">
                    <el-form-item label="主鍵" :label-width="formLabelWidth" v-if="isShowUserId">
                        <el-input v-model="user.id" auto-complete="off" :disabled="true"></el-input>
                    </el-form-item>
                     
                    <el-form-item label="名字" :label-width="formLabelWidth">
                        <el-input v-model="user.userName" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="组织" :label-width="formLabelWidth">
			 		   <el-cascader 
						 placeholder="对菜单进行搜索"
					    :options="orgData"
					    :props="organizDefaultProps"
					    filterable 
					    v-model="organizDefalut"
					    
					    change-on-select
					    @change="getSelectNode"
						  >
			          </el-cascader>
			    </el-form-item>
			    <el-form-item label="角色" :label-width="formLabelWidth">
			 		   <el-cascader 
						 placeholder="对菜单进行搜索"
					    :options="roleData"
					    :props="roleDefaultProps"
					    filterable 
					    v-model="roleDefalut"
					    change-on-select
					    @change="getRoleNode"
						  >
			          </el-cascader>
			    </el-form-item>
                    <el-form-item label="拼音" :label-width="formLabelWidth">
                        <el-input v-model="user.userNameEn" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="帐号" :label-width="formLabelWidth" prop="account">
                        <el-input v-model="user.account" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="密码" :label-width="formLabelWidth" v-if="status == 0" prop="password">
                        <el-input v-model="user.password" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="确认密码" :label-width="formLabelWidth" v-if="status == 0" prop="confirmPass">
                        <el-input v-model="user.confirmPass" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="性别" :label-width="formLabelWidth">
                        <el-input v-model="user.sex" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="邮箱" :label-width="formLabelWidth">
                        <el-input v-model="user.email" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="创建时间" :label-width="formLabelWidth" v-if="isShowCreateTime">
                        <el-input v-model="user.createTime" auto-complete="off" :disabled="true"></el-input>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="bmsUserVisible = false" v-cloak>取 消</el-button>
                    <el-button type="primary" @click="saveUser" v-cloak>确 定</el-button>
                </div>
            </el-dialog>
            <el-row  style="margin-top:10px" type="flex" justify="end">
               <el-col :xs="24" :sm="24" :md="12" :lg="12">
                    <div class="grid-content bg-purple">
                        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="page.pageNumber" :page-sizes="[10,20,50,100]" :page-size="page.pageSize" layout="sizes,prev,pager,next,total" :total="page.recordCount"></el-pagination>
                    </div>
                </el-col>
            </el-row>
        </div>
</template>
<style scoped>
  .bg-purple {
                background: #d3dce6;
            }

            .grid-content {
                border-radius: 4px;
                min-height: 36px;
            }

            .row-bg {
                padding: 10px 0;
                background-color: #f9fafc;
            }

            .el-select .el-input {
                width: 110px;
            }
</style>
<script>
import axios from 'axios'
import querystring from 'querystring'
var baseUtil = require('../../util/base')
 var checkAccount = function(rule, value, callback){
        if(value == '' || value == undefined){
       	 callback(new Error('账户名不能为空！'));
        }
        else{
       	 callback();
        }
};
var checkPassword = function(rule, value, callback){
    if(value == '' || value == undefined){
   	 callback(new Error('密码不能为空！'));
    }
    else{
    	if(userList.user.password != '' || userList.user.password != undefined)
    		{
    		userList.$refs.userForm.validateField('confirmPass');	
    		}
   	 callback();
    }
};
var checkConfirmPass = function(rule, value, callback){
    if(value == '' || value == undefined){
   	 callback(new Error('请再次输入密码！'));
    }
    else if (value !== userList.user.password) {
        callback(new Error('两次输入密码不一致!'));
      }
    else{
   	 callback();
    }
};
export default{
    data(){
        return{
            
    		tableData:[],
    		page:{
    			    pageNumber:1,
    				pageSize:10,
    				keyword:"",
    				field:""
    			},
    			keyword:"",
    			getURL:baseUtil.WebRootUrl+"/SysUserControl/getUserList",	
    			getOrgURL:baseUtil.WebRootUrl+"/SysOrganizeControl/getOrganizeList",	
    			getRoleURL:baseUtil.WebRootUrl+"/SysRoleControl/getRoleList",	
    			deleteURL: baseUtil.WebRootUrl+"/UserControl/deleteUser",
    			updateURL: baseUtil.WebRootUrl+"/UserControl/updateUser", 
    	        addURL:baseUtil.WebRootUrl+"/UserControl/addUser",
    			deleteId:"",
    	        ids:[],
    	        bmsUserTitle:"",
    	        bmsUserVisible:false,
    	        formLabelWidth: '120px',
    	        isShowUserId:false,
    	        isShowCreateTime:false,
    	        status:0,
    	        user:{
    	        	
    	        },
    	        organizDefalut:[''],
    	        roleDefalut:[''],
    	        confirmPass:"",
    	        filterText: '',
   		     organizDefaultProps: {  
	                children: 'children',  
	                label: 'organizName', 
	                value:'id'
	            }  ,
	            roleDefaultProps: {  
	                children: 'children',  
	                label: 'roleName', 
	                value:'id'
	            }  ,
	            
	            orgData:[{}],
	            roleData:[{}],
    	        userRule:{
    	         
        	    	account:[{
        	    		validator:checkAccount,trigger: 'blur'
        	    	}],
        	    	password:[{
        	    		validator:checkPassword,trigger: 'blur'
        	    	}],
        	    	confirmPass:[{
        	    		validator:checkConfirmPass,trigger: 'blur'
        	    	}]
        	    } 
        }
    },
    mounted:function(){
    		this.getData();
        },
    methods:{
        
    		setKeyword(){
    			this.page.keyword = this.keyword;
    			this.getData();
    		},
    	    sortChange(obj){
            	 this.page.sc = typeof(this.page.sc) == 'undefined'||this.page.sc == 'asc'?'desc':'asc';
            	 this.page.orderField =  obj.prop;
            	 this.getData();
    		},
    		//删除用户
       
    		deleteUser(idArr){
    			var vm = this;
    			var delFlag = 0;//删除标志  0:全部失败   1:全部成功 2:部分成功

    			var message;
    			var type;
    			vm.$showConfirm({
            		title:'删除确认窗口',
            		tips:'是否删除？',
            		ok:'确定',
            		no:'取消',
            		success:function(){
            		  if(idArr.length == 0){
                			message = '请先选择要删除的菜单！';
                			type = 'info';
                			vm.$showMess({message:message,messType:type});
            			 }
            		 else{
            			var proArr = idArr.reduce(function(pre,cur){
            				return pre.push(baseUtil.ajaxPromise(vm.deleteURL,{userId:cur},'post',true,{Json:true,success:'success',error:'error'})),pre;
            			},[]);
            			Promise.all(proArr).then(function(arr){
                			for(var i = 0; i<arr.length;i++){
                				if(arr[i] == 'success' && delFlag != 2){
                					delFlag = 1;
                				}
                				else if(arr[i] == 'error' && delFlag == 1){
                					delFlag = 2;
                				}
                			}
                			if(delFlag == 0){
                				message = '删除失败！';
                				type = 'error';
                			}
                			else if(delFlag == 1){
            				    message = '删除成功'
            				    type = 'success';
            				}
                			else{
                				message = '删除部分成功！';
                				type = 'info';
                			}
                			vm.$showMess({message:message,messType:type});
           				    vm.getData();
           	    			
                		});	 
            		}
            		
            			
            		},
            		error:function(){
            			vm.$showMess({message:'取消删除!',messType:'error'});
            		}
            	}); 
    		},
    		//获取数据

    		getData(){
    		    	  var vm = this;
    		    	  vm.page = {
			        		  pageNumber:vm.page.pageNumber,
			        		  pageSize:vm.page.pageSize,
			        		  keyword:vm.keyword,
			        		  field:vm.page.field,
			        		  orderField:vm.page.orderField,
			        		  sc:vm.page.sc
			          } ;
    		    	    var proArr = [];
    		    	    proArr.push(baseUtil.ajaxPromise(vm.getURL,vm.page,'get',true,{Json:true,error:'获取用户失败！'}));
    		    	    proArr.push(baseUtil.ajaxPromise(vm.getOrgURL,{"pid":'-1'},'get',true,{Json:true,error:'获取组织失败'}));
    		    	    proArr.push(baseUtil.ajaxPromise(vm.getRoleURL,{"pid":"-1"},'get',true,{Json:true,error:'获取角色失败'}));
    		    	    Promise.all(proArr).then(function(arr){
    		    	    	arr = arr.map(function(item){
    		    	    		return JSON.parse(item);
    		    	    	});
    		    	    	for(var i = 0 ; i<arr.length ; i++){
    		    	    		if(arr[i].dataList.length&&arr[i].dataList[0].hasOwnProperty('account')){
    		    	    			vm.tableData = [];
    		    	    			vm.$set(vm,'tableData',arr[i].dataList); 	 
    	    	    				 vm.$set(vm,'page',arr[i].page);  
    	    	    				 for(var j = 0; j< vm.tableData.length; j++){
    	    	    					  vm.tableData[j].seq = vm.page.start + j + 1;
    	    	    					 
    	    	    				  }
    		    	    		}
    		    	    		else if(arr[i].dataList.length&&arr[i].dataList[0].hasOwnProperty('organizName')){
    		    	    			vm.orgData = [];
    		    	    			vm.removeChilren(arr[i].dataList);
    		    	    			vm.$set(vm,'orgData',arr[i].dataList);  
    		    	    			
    		    	    		}
    		    	    		else if(arr[i].dataList.length&&arr[i].dataList[0].hasOwnProperty('roleName')){
    		    	    			vm.roleData = [];
    		    	    			vm.removeChilren(arr[i].dataList);
    		    	    			vm.$set(vm,'roleData',arr[i].dataList);
    		    	    			
    		    	    		}}	
    		    	    		var f = vm.createGetPath();
    		    	    		vm.tableData.map(function(item){
     	    					   item.organizName = f(vm.orgData,item.organizId).organizName;
     	    					  item.roleName = f(vm.roleData,item.roleId).roleName;
    		    	    		});
    		    	    	
    		    	     });
    		    	    /*vm.$http.get(vm.getURL,vm.page)

    	    			.then((response) => {

    	    				vm.info = response.data.info;

    	    				if(response.data.result == "200"){

    	    				  vm.$set(vm,'tableData',response.data.dataList); 	 

    	    				  vm.$set(vm,'page',response.data.page);    

    	    				  for(var i = 0; i< vm.tableData.length; i++){

    	    					  vm.tableData[i].seq = vm.page.start + i + 1;

    	    					 

    	    				  }

    	    				}

    	    			})

    	    			.catch(function(response) {

    	    				vm.info="有异常了";

    	    			});

    	    			vm.$http.get(vm.getOrgURL,{id:'-1'})

    	    			.then((response) => {

    	    				vm.info = response.data.info;

    	    				if(response.data.result == "200"){

    	    				 vm.orgData.length = 0;

    	    				 var f = vm.createGetPath();

    	       				 vm.removeChilren(response.data.dataList);

    	    				   vm.$set(vm,'orgData',response.data.dataList);     

    	    				   vm.tableData.map(function(item){

    	    					   item.organizName = f(vm.orgData,item.organizId).organizName;

    	    				   });

    	    				}

    	    			})

    	    			.catch(function(response) {

    	    				vm.info="有异常了";

    	    			});

    	    			vm.$http.get(vm.getRoleURL,{"pid":"-1"})

    	    			.then((response) => {

    	    				vm.info = response.data.info;

    	    				var f = vm.createGetPath();

    	    				if(response.data.result == "200"){

    	    				 vm.roleData.length = 0;

    	       				 vm.removeChilren(response.data.dataList);

    	    				   vm.$set(vm,'roleData',response.data.dataList);     

    	    				   vm.tableData.map(function(item){

    	    					   item.roleName = f(vm.roleData,item.roleId).roleName;

    	    				   });

    	    				}

    	    			})

    	    			.catch(function(response) {

    	    				vm.info="有异常了";

    	    			});*/
    		      },
    		      handleAdd(){
    		    	  this.user = {};
    		    	  this.status = 0;
    		    	  this.organizDefalut.length = 0;
    		    	  this.organizDefalut.push('-1');
    		    	  this.roleDefalut.length = 0;
    		    	  this.roleDefalut.push('-1');
    		    	  this.bmsUserVisible = true;
    		    	  this.isShowUserId = false;
    	    	      this.isShowCreateTime = false;
    		      },
			      handleEdit(index, row) {
    		    	  console.log(index, row);
  			        this.bmsUserTitle = "编辑用户";
  			        this.user = row;
  			        this.status = 1;//设置为编辑模式

  			       this.organizDefalut =  this.createGetPath('path')(this.orgData,row.organizId,[]);
  			       this.roleDefalut =  this.createGetPath('path')(this.roleData,row.roleId,[]);
  			        this.bmsUserVisible = true;
			      },
			      //删除单个用户

			      handleDelete(index, row) {
			    	    this.deleteUser([row.id]);
			      },
			      //批量删除多个用户

			      handleDeletes(index, row) {
			    	  this.deleteUser(this.ids);
			      },
			      //处理pageSize改变事件

			      handleSizeChange(val) {
			    	 var vm = this;
			    	vm.page.pageSize = val;
			    	vm.getData();
			      },
			      //处理当前页变化事件

			      handleCurrentChange(val) {
			    	   var vm = this;
			    	  vm.page.pageNumber = val; 
			          this.getData();
			    },
			    getCheck(rows){
			    	console.log(arguments);
			    	this.ids = rows.map(function(item){
			    		return item.id;
			    	});
			    },
			    saveUser(){
			    	 var vm = this;
			    	 vm.$refs.userForm.validate(function(valid){
			    		 if(valid){
			    			 axios.post(vm.status==0?vm.addURL:vm.updateURL,querystring.stringify(vm.user))
			 	    			.then((response) => {
			 	    				vm.info = response.data.info;
			 	    				if(response.data.result == "200"){
			 	    				  vm.bmsUserVisible = false;
			 	    				  vm.$showMess({message:'编辑成功!',messType:'success'});
			 	    				}
			 	    				else{
			    					vm.bmsUserVisible = false;
			    					vm.$showMess({message:'编辑失败!',messType:'error'});
			    				    }
			 	    				vm.getData();
			 	    			})
			 	    			.catch(function(response) {
			 	    				vm.info="有异常了";
			 	    			    vm.bmsUserVisible = false;
			 	    				vm.$showMess({message:'编辑失败!',messType:'error'});
			 	    			}); 
			    		 }
			    	 });
			    	 
			    },
			    removeChilren(arr){
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
	    		
	    		 //操作节点的方法结束-------------------

	            //操作下拉列表的方法开始+++++++++++++++++++++

	            //当点击select时候触发的方法

				createGetPath(flag){
                      if(flag == 'path'){
                    	 return function getDataPath(arr,id,path){
                    		 var f = [];
          	               for(var i = 0 ; i< arr.length && !f.length; i++){
          	            	   if(path)
          	            		   {
          	            		   path.push(arr[i].id);
          	            		   }
          	            	   if(arr[i].id == id){
          	            		    return path;
          	            	   }
          	            	   else if(arr[i].children){
          	            		   f = getDataPath(arr[i].children,id,path);
          	            	    }
          	            	   if(!f.length&&path){
          	            		   path.splice(path.length - 1,1);
          	            	   }
          	               }	
          	          	   
          	          	   return f;
                    	 } 
                      }	
                      else{
                    	  
                    	  return function getDataPath(arr,id) { 
                    		  var f = {};
       	               for(var i = 0 ; i< arr.length && JSON.stringify(f)=="{}"; i++){
       	            	    
       	            	   if(arr[i].id == id){
       	            		    return arr[i];
       	            	   }
       	            	   else if(arr[i].children){
       	            		   f = getDataPath(arr[i].children,id);
       	            	    }
       	            	    
       	               }	
       	          	   
       	          	   return f;
       	          	   }
                      }
                      }
			 
	    		,
	    		getSelectNode(optionValues){
	    			
	            	 this.user.organizId = optionValues[optionValues.length-1];
	            } ,
	            getRoleNode(optionValues){
	    			
	            	 this.user.roleId = optionValues[optionValues.length-1];
	            } 
		
    }
}
</script>
