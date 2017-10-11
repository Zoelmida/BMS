<template>
 <div id="menuList" style="margin: 0;width: 100%;overflow: hidden;">
    	 <el-input
		  placeholder="输入关键字进行过滤"
		  v-model="filterText">
		</el-input>
    	<el-tree  
            :data="data"  
            :props="defaultProps"  
            node-key="id"  
            :default-expand-all="expandAllNodes"  
            :expand-on-click-node="true"
            check-strictly  
            @node-click="nodeClick"
            :filter-node-method="filterNode"
            ref="bmsmenumanage"
            show-checkbox
            :render-content="renderContent">  
    </el-tree>  
    <!-- 菜单的添加、编辑对话框窗口 -->
    <el-dialog :title="bmsMenuTitle" :visible.sync="bmsMenuVisible">
    <el-form :model="menu" :rules="menuRule" ref="menuForm">
        
    <el-form-item label="父级菜单" :label-width="formLabelWidth">
 		   <el-cascader 
			 placeholder="对菜单进行搜索"
		    :options="data"
		    :props="defaultProps"
		    filterable
		    :disabled="status==0"
		    v-model="optionDefalut"
		    :show-all-levels="false"
		    change-on-select
		    @change="getSelectNode"
			  >
          </el-cascader>
    </el-form-item>
    <el-form-item label="菜单名称" :label-width="formLabelWidth" prop="menuName">
      <el-input v-model="menu.menuName" auto-complete="off" ></el-input>
    </el-form-item>
    <el-form-item label="菜单地址" :label-width="formLabelWidth" >
      <el-input v-model="menu.url" auto-complete="off"></el-input>
    </el-form-item>
    <el-form-item label="菜单图标" :label-width="formLabelWidth">
      
      <!-- 弹出框 -->
	  <el-popover
  ref="popoer4"
  placement="top"
  width="700"
  v-cloak
  v-model="selectIcon">
  <el-table :data="iconFonts"
    stripe
  border
  height="500"
  @row-click="iconChoose"
  >
    <el-table-column width="350" property="class" label="名称"></el-table-column>
    <el-table-column width="350" property="icon" label="图标">
      <template scope="scope">
        <i :class="scope.row.icon"></i>
      </template>
    </el-table-column>
     
  </el-table>
</el-popover>

<el-button style="width:46px;height:36px;"><i :class="menu.icon" v-cloak></i></el-button><el-button v-popover:popoer4 v-cloak>选择图标</el-button>
    </el-form-item>
    <el-form-item label="菜单排序" :label-width="formLabelWidth">
      <el-input v-model="menu.seq" auto-complete="off"></el-input>
    </el-form-item>
    
    <el-form-item label="是否启用" :label-width="formLabelWidth">
       <el-radio class="radio" v-model="menu.state" :label=true v-cloak>启用</el-radio>
       <el-radio class="radio" v-model="menu.state" :label=false v-cloak>不启用</el-radio>
    </el-form-item>
    
  </el-form>
  <div slot="footer" class="dialog-footer">
    <el-button @click="resetMenu()" v-cloak>取 消</el-button>
    <el-button type="primary" @click="saveMenu()" v-cloak>确 定</el-button>
  </div>
</el-dialog>

<div style="display:flex;justify-content:flex-end">
    <!--由于element目前还不支持展开设收缩节点的操作，所以暂时不能使用如下功能  -->
   <!-- <el-button type="info" v-cloak @click="expandAll">展开所有节点</el-button>
   <el-button type="info" v-cloak @click="collapseAll">收起所有节点</el-button>
    --> 
    
  <el-button type="danger" v-cloak @click="delChooseNode">删除所选菜单</el-button>
</div>
<ul id="icon-list"><li><span><i class="el-icon-arrow-down"></i>
      el-icon-arrow-down
    </span></li><li><span><i class="el-icon-arrow-left"></i>
      el-icon-arrow-left
    </span></li><li><span><i class="el-icon-arrow-right"></i>
      el-icon-arrow-right
    </span></li><li><span><i class="el-icon-arrow-up"></i>
      el-icon-arrow-up
    </span></li><li><span><i class="el-icon-caret-bottom"></i>
      el-icon-caret-bottom
    </span></li><li><span><i class="el-icon-caret-left"></i>
      el-icon-caret-left
    </span></li><li><span><i class="el-icon-caret-right"></i>
      el-icon-caret-right
    </span></li><li><span><i class="el-icon-caret-top"></i>
      el-icon-caret-top
    </span></li><li><span><i class="el-icon-check"></i>
      el-icon-check
    </span></li><li><span><i class="el-icon-circle-check"></i>
      el-icon-circle-check
    </span></li><li><span><i class="el-icon-circle-close"></i>
      el-icon-circle-close
    </span></li><li><span><i class="el-icon-circle-cross"></i>
      el-icon-circle-cross
    </span></li><li><span><i class="el-icon-close"></i>
      el-icon-close
    </span></li><li><span><i class="el-icon-upload"></i>
      el-icon-upload
    </span></li><li><span><i class="el-icon-d-arrow-left"></i>
      el-icon-d-arrow-left
    </span></li><li><span><i class="el-icon-d-arrow-right"></i>
      el-icon-d-arrow-right
    </span></li><li><span><i class="el-icon-d-caret"></i>
      el-icon-d-caret
    </span></li><li><span><i class="el-icon-date"></i>
      el-icon-date
    </span></li><li><span><i class="el-icon-delete"></i>
      el-icon-delete
    </span></li><li><span><i class="el-icon-document"></i>
      el-icon-document
    </span></li><li><span><i class="el-icon-edit"></i>
      el-icon-edit
    </span></li><li><span><i class="el-icon-information"></i>
      el-icon-information
    </span></li><li><span><i class="el-icon-loading"></i>
      el-icon-loading
    </span></li><li><span><i class="el-icon-menu"></i>
      el-icon-menu
    </span></li><li><span><i class="el-icon-message"></i>
      el-icon-message
    </span></li><li><span><i class="el-icon-minus"></i>
      el-icon-minus
    </span></li><li><span><i class="el-icon-more"></i>
      el-icon-more
    </span></li><li><span><i class="el-icon-picture"></i>
      el-icon-picture
    </span></li><li><span><i class="el-icon-plus"></i>
      el-icon-plus
    </span></li><li><span><i class="el-icon-search"></i>
      el-icon-search
    </span></li><li><span><i class="el-icon-setting"></i>
      el-icon-setting
    </span></li><li><span><i class="el-icon-share"></i>
      el-icon-share
    </span></li><li><span><i class="el-icon-star-off"></i>
      el-icon-star-off
    </span></li><li><span><i class="el-icon-star-on"></i>
      el-icon-star-on
    </span></li><li><span><i class="el-icon-time"></i>
      el-icon-time
    </span></li><li><span><i class="el-icon-warning"></i>
      el-icon-warning
    </span></li><li><span><i class="el-icon-delete2"></i>
      el-icon-delete2
    </span></li><li><span><i class="el-icon-upload2"></i>
      el-icon-upload2
    </span></li><li><span><i class="el-icon-view"></i>
      el-icon-view
    </span></li></ul> 
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
var routeUtil = require('../../util/routeUtil')
 //检测表单
	var checkMenuName = function(rule, value, callback){
             if(value == ''){
            	 callback(new Error('菜单名不能为空！'));
             }
             else{
            	 callback();
             }
	};
export default {
   watch: {
    	      filterText:function(val) {
    	        this.$refs.bmsmenumanage.filter(val);
    	      }
            },
    data(){
        return {
            data:[
    		      {pid:'',id:"-1",menuName:"一级菜单",icon:"",children:[]},
    		     
    		     ],
    		    filterText: '',
    		     defaultProps: {  
 	                children: 'children',  
 	                label: 'menuName', 
 	                value:'id'
 	            }  ,
    		    
    		menu:{
    			id:"",
    			pid:"",
    			menuName:"",
    			icon:"",
    			url:"",
    			seq:"",
    			state:true,
    			pname:"" 
    		},
    	    getURL:baseUtil.WebRootUrl+"/SysMenuControl/getMenuList",
    	    addMenuURL:baseUtil.WebRootUrl+"/SysMenuControl/addMenu",
    	    updateMenuURL:baseUtil.WebRootUrl+"/SysMenuControl/updateMenu",
    	    deleteMenuURL:baseUtil.WebRootUrl+"/SysMenuControl/deleteMenu",
    	    info:"",
    	    bmsMenuVisible: false,
    	    formLabelWidth: '120px',
    	    bmsMenuTitle:"",
    	    optionDefalut:[''],//下拉列表的默认值。
    	    status:0, // 0: 添加  1:修改,
    	    delArr:[],
    	    expandAllNodes:true,
    	    selectIcon:false,
    	    iconFonts:[],
    	    menuRule:{
    	    	menuName:[{
    	    		validator:checkMenuName,trigger: 'blur'
    	    	}] 
    	    }
        }
    },
    mounted:function(){
    		this.getIcons();
    		this.getData();
        },
    methods:{

    		
    		//操作节点的方法开始 ++++++++++++++++++
    		expandAll:function(){
    			this.getData();
    		},
    		collapseAll:function(){
    			this.expandAllNodes = false;
    			this.getData();
    		},
    		nodeClick:function(){
    			console.log(arguments);
    		},
            //操作节点的方法结束-------------------
            //操作下拉列表的方法开始+++++++++++++++++++++
            //当点击select时候触发的方法
            getSelectNode:function(optionValues){
            	 this.menu.pid = optionValues[optionValues.length-1];
            },
            //加载节点的父节点的默认路径
            getParentDataPath:function(node){
            	this.optionDefalut.length = 0;//为了加载select默认值，首先把存放默认路径的数组清空。
            	this.getDataPath(node); //加载节点的路径 ps:elementUI的默认value设置太恶心了，必须得是节点的路径才行。。所以就有了这么个方法=。=
            	this.optionDefalut.shift();
            	this.optionDefalut.reverse();
            },
            //递归求出菜单的路径
            getDataPath:function(node){
          	  
          	  return node.key=='-1'?this.optionDefalut.push(node.key):this.getDataPath(node.parent,this.optionDefalut.push(node.key));  
              
            },
            //编辑状态下禁用当前节点
            changeStateSelect:function(arr,id){
            	var f = false;
            	for(var i = 0 ;i<arr.length&&!f;i++){
                      if(arr[i].id == id){
                    	  arr[i].disabled = true;
                    	  f = true;
                    	  return f;
                      }
                      else if(arr[i].children)
                    	  {
                    f = this.changeStateSelect(arr[i].children,id);
                    	  }
            	}
            	return f;
            },
            //启用所有select
            enableAllSelects:function(arr){
            	for(var i = 0 ;i<arr.length;i++){
            		 arr[i].disabled = false;
            		if(arr[i].children){
            			this.enableAllSelects(arr[i].children);	
            		}
            	}
            },
            //操作下拉列表的方法结束----------------------
            //操作table的方法开始++++++++++++++++++++
            iconChoose:function(obj){
            	//console.log(arguments);
            	this.menu.icon = obj.class;
            	this.selectIcon = false;
            },
            //操作table的方法结束---------------------
            //节点的渲染函数、此处可对节点进行一些操作,相当于vue里的render函数
            renderContent:function(createElement, { node, data, store }) {  
                var self = this;  
                return createElement('span',{attrs:{
                	style:'display: inline-flex;width:calc(100% - 33px);justify-content: space-between;'
                }}, [  
                    createElement('span', node.label),  
                    createElement('span', {attrs:{  
                        style:"float: right; margin-right: 20px"  
                    }},[  
                        !data.url?createElement('el-button',{attrs:{  
                            size:"mini",
                            title:'添加此节点的子节点'
                        },on:{  
                            click:function() {  
                               // console.info("点击了节点" + data.id + "的添加按钮");
                              //  console.log(node);
                                self.bmsMenuTitle = "添加子菜单" //设置菜单标题
                                self.enableAllSelects(self.data);
                                for(key in self.menu){
                                	self.menu[key] = "";
                                }
                                self.menu.pid = node.key;//父级菜单的id	
                                self.status = 0;//设置为添加状态
                                self.optionDefalut.length = 0;
                                self.getDataPath(node); 
                                self.optionDefalut.reverse();
                                self.menu.state = true;
                                self.bmsMenuVisible = true;//开启对话框
                               //store.append({ id: self.baseId++, label: 'testtest', children: [] }, data);  
                            }  
                        }},[createElement('i',{
                        	attrs:{
                        		class:'el-icon-plus'
                        	}
                        })]):"",  
                        data.id!='-1'?createElement('el-button',{attrs:{  
                            size:"mini",
                            title:'删除'
                        },on:{  
                            click:function() {  
                            	
                                //console.info("点击了节点" + data.id + "的删除按钮");  
                                //store.remove(data);  
                            	self.delArr.length = 0;
                            	self.delArr.push({id:node.key});
                            	//调用删除方法删除数组delArr里面的菜单。
                            	self.delMenu();
                            }  
                        }},[createElement('i',{
                        	attrs:{
                        		class:'el-icon-delete'
                        	}
                        })]):"",  
                        //对菜单进行编辑操作。
                        data.id!='-1'? createElement('el-button',{attrs:{  
                            size:"mini",
                            title:'编辑'
                        },on:{  
                            click:function() {  
                                //console.info("点击了节点" + data.id + "的删除按钮");  
                            	self.bmsMenuTitle = "编辑子菜单" //设置菜单标题
                        		self.enableAllSelects(self.data);//启用所有节点
                        		self.getParentDataPath(node);//加载默认父节点 
                            //当前菜单的数据赋给menu
                            	for(var key in self.menu){
                            		self.menu[key] = data[key];
                            	} 
                            	self.status = 1;//设置为编辑状态
                            	self.changeStateSelect(self.data,self.menu.id);//禁用当前的项目（自己不能成为自己的父节点）
                            	self.bmsMenuVisible = true;//开启对话框
                            }  
                        }},[createElement('i',{
                        	attrs:{
                        		class:'el-icon-edit'
                        	}
                        })]):""]),  
                ]);  
            }  
        ,
        //对节点进行过滤筛选操作的方法
        filterNode:function(value, data) {
            if (!value) return true;
            return data.menuName.indexOf(value) !== -1;
          },
          //对菜单的数据进行一系列的操作开始+++++++++++++++++++++++++++
          //从后台通过ajax的方法获取节点数据
    		getData:function(){
    			var vm = this;
    			axios.get(vm.getURL,{params:{"pid":"-1"}})
    			.then((response) => {
    				vm.info = response.data.info;
    				if(response.data.result == "200"){
    				  //添加一级菜单
    				 vm.data[0].children.length = 0;
    				 vm.removeChilren(response.data.dataList);
    				 vm.$set(vm.data[0],'children',response.data.dataList); 	 
    				                         
    				}
    			})
    			.catch(function(response) {
    				vm.info="有异常了";
    			})
    		},
    		//删除选择的节点
    		delChooseNode:function(){
    			this.delArr = this.$refs.bmsmenumanage.getCheckedKeys().map(function(item){
    				return {id:item};
    			});
    			this.delMenu();
    		} ,
    		//删除菜单
    		delMenu:function(){
    			vm = this;
    			var delFlag = 0;//删除标志  0:全部失败   1:全部成功 2:部分成功
    			var message;
    			var type;
    			vm.$showConfirm({
            		title:'删除确认窗口',
            		tips:'是否删除？',
            		ok:'确定',
            		no:'取消',
            		success:function(){
            		if(vm.delArr.length == 0){
            			if(vm.delArr.length == 0){
                			message = '请先选择要删除的菜单！';
                			type = 'info';
                			vm.$showMess({message:message,messType:type});
            			 }
            		}	
            		else{
            			var proArr = vm.delArr.reduce(function(pre,cur){
            				return pre.push(baseUtil.ajaxPromise(vm.deleteMenuURL,cur,'post',true,{Json:true,success:'success',error:'error'})),pre;
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
           	    			vm.bmsMenuVisible = false;
                		});	 
            		}
            		
            			
            		},
            		error:function(){
            			vm.$showMess({message:'取消删除!',messType:'error'});
            		}
            	});
    			
    		},
    		//删除所选菜单
    		delAllMenu:function(){
    			this.delArr = this.setCheckedKeys(); 
    			this.delMenu();
    		},
    		//关掉菜单
    		resetMenu:function(){
    			vm = this;
    			vm.bmsMenuVisible = false;
    		},
    		
    		//保存菜单
    		saveMenu:function(){
    			var vm = this;
    			var flag = false;
    			//先检查表单是否通过
    			vm.$refs.menuForm.validate(function(valid){
    				 if (valid) {
    					 vm.menu.del = 0;
    		    			axios.post(vm.status==0?vm.addMenuURL:vm.updateMenuURL,querystring.stringify(vm.menu))
    		    			.then(function(response){
    		    				vm.info = response.data.info;
    		    				 this.$showMess({messType:'success',message:(vm.status==0?'添加':'修改')+'菜单成功！'});
    		    				if(vm.status){
    		    					vm.changeStateSelect(vm.data,vm.menu.id);//禁用当前的项目（自己不能成为自己的父节点）
    		                     }
    		    				 vm.getData();
    		    	    			vm.bmsMenuVisible = false;
    		     			})
    		    			.catch(function(response){
    		    				vm.info = response;
    		    				if(vm.status){
    		    					vm.changeStateSelect(vm.data,vm.menu.id);//禁用当前的项目（自己不能成为自己的父节点）
    		                     }
    		    				vm.getData();
    		        			vm.bmsMenuVisible = false;
    		    				  this.$showMess({messType:'error',message:'人品不行！'+(vm.status==0?'添加':'修改')+'失败！'});
    		    			});
    			          } 
    			}); 
    			 
    			
    		} ,
    		//移除数据中children的当children的length为0时
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
    		//获取图标
    		getIcons:function(){
    			var iconList = document.getElementById("icon-list");
    			for(var i = 0 ;i < iconList.childNodes.length; i++){
    			var className = iconList.childNodes[i].innerText.trim();
    			this.iconFonts.push({
    				class:className,
    				icon:className
    			});
    			}
    		}
    		//对菜单的数据进行一系列的操作结束--------------
    	
    }    
}
</script>
