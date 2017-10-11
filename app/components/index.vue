<style src="../static/css/index.css" scoped></style>
<template>
	<div id="container"   >
		       <!-- 左侧菜单 -->
		       <bmsleft id="leftmenu">
		      		
			   </bmsleft>
			    	 
			      	 <!-- 右侧部分 -->
		      <div id="content">
		      		
			      	 <!-- 右侧头部 -->
			      	  
			      	  <bmshead id="head">
				      	 
				      </bmshead>
				      <!-- 右侧框架 -->
				      <div id="myframe">
				      <router-view>
				      		
				      	</router-view>
			          <!--<iframe name="c_frame" frameborder="0" id="indexFrame" @load="changeFrameHeight()">
			          
			          </iframe>-->
			          </div>
			          <!-- 右侧底部 -->
			          <div id="foot">
				      	<div style="align-self: flex-end;">版权所有&copy;yaoliguo、wangyi</div>
				      </div>
			      	 </div>
			</div>
			 <!-- 显示欢迎界面，结束时隐藏 -->
		<!--<div id="showWelcome" style="display:none">
			 <transition-group 
			 	name="welcome" 
			tag="p"
			v-bind:css="false"
			v-on:before-enter="beforeEnter"
			v-on:enter="enter"
			v-on:leave="leave"
			mode="out-in"
			style="display:block;text-align:center;display:table;height:100%"
			v-cloak
			 	>
			 	 
			 	<span 
			 	  v-if="item.show"	
				  v-for="(item,index) in items"
				  v-bind:key="index"
				  v-bind:data-index="index"
				  v-cloak
				  style="font-size:30px;display: table-cell;vertical-align: middle;"
				 >
				{{ item.msg }}	
				</span>
				</v-if>
			 </transition-group>
		</div>-->
</template>
<script>
	 import axios from 'axios'
  	import querystring from 'querystring'
  	import bmsleft from './bmsleft'
  	import bmshead from './bmshead'
	 	export default {
	 		data(){
	 			return{ }
	 		},
	 		components:{
	 			bmsleft,
	 			bmshead
	 		}
	 	}
	
	
</script>