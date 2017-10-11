(function(global,factory){
	typeof module.exports!='undefined'?module.exports = factory():typeof define === 'function' && define.amd ? define(factory) :
		(global.baseUtil = factory())
	
})(window,function(){
	Date.prototype.format = function(format){
		var o = {
			'y+' : this.getFullYear(),//获取年
			'M+' : this.getMonth()+1, //月
			'D+' : this.getDate(), //日
			'H+' : this.getHours(), //时
			'm+' : this.getMinutes(), //分
			's+' : this.getSeconds()//秒
		}
		if(/(y+)/.test(format)) format=format.replace(RegExp.$1,
			(this.getFullYear()+'').substr(4- RegExp.$1.length))
		for(var k in o)if(new RegExp('('+ k +')').test(format))
			format = format.replace(RegExp.$1,
				RegExp.$1.length==1? o[k] :
					('00'+ o[k]).substr((''+ o[k]).length))
		return format
	}
	function baseUtil(_args){
		if(!(this instanceof baseUtil))
		{
			return  new baseUtil(_args)
		}
		this.el = 'document'//初始化元素为根节点            
		if(_args && _args.nodeType) //说明参数是dom元素 
		{
			this.el = [].concat(_args)
		}
		else if(_args && typeof _args == 'string') //说明参数是dom元素 
		{
			this.el = document.querySelectorAll(_args)
		}
		return this 
	}	
	baseUtil.prototype = {
		constructor:baseUtil,
		week : [      //初始化星期
			'星期天',
			'星期一',
			'星期二',
			'星期三',
			'星期四',
			'星期五',
			'星期六'
		],
	    addClass:function(className){
	    	baseUtil.each(this.el,function(){
	    	var _className = this.className
				this.className = _className!=''?_className + ' '+ className :className
	    	})
		},
		removeClass:function(className){
			baseUtil.each(this.el,function(){
				var t = this.className.replace(new RegExp(className,'g'),'')
				var reg = t.match(/\s{2,}/g)?t.match(/\s{2,}/g)[0]:null
	    	this.className = reg?t.replace(reg,' '):t
	    	})
		}
	}
	baseUtil.getFullTime = function(){
		var _date = new Date()
		var year = _date.getFullYear() + '年'
		var month = _date.getMonth()+1 + '月'
		var day = _date.getDate() + '日'
		var hour = _date.getHours() + '时'
		var min = _date.getMinutes() + '分'
		var sec = _date.getSeconds() + '秒'
		var xq = _date.getDay()
		return year + month + day + hour + min + sec + baseUtil.prototype.week[xq]
	}
	baseUtil.ajaxPromise = function(URL,Item,type,bool,extra){
		//URL : 发送数据的url   Item：传的数据   type："post/get" bool: 同步：false 异步 true extra：额外的一些参数 待补充。。。
		var promise = new Promise(function(resolve,reject){
			var requestAjax = new XMLHttpRequest() 
			
			
			if(extra.Json){
				URL = URL + '?'
				URL += baseUtil.getKeyandValue(Item)
				item = null
				requestAjax.open(type,URL,bool)
				requestAjax.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded') 
				
			}
			else{
				requestAjax.open(type,URL,bool)
			}
			requestAjax.send(Item)
			requestAjax.onreadystatechange=function(){
				if(requestAjax.readyState == 4 && requestAjax.status == 200){
					if(extra.success){
						resolve(extra.success)
					}
					else{
						resolve(requestAjax.responseText)
					}
				 }
				else if(requestAjax.readyState == 4 && requestAjax.status != 200){
					if(extra.error){
						resolve(extra.error)
					}
					else{
						resolve(requestAjax.responseText)
					}
				}
			}
			
			 
		})
		return promise
	}
	baseUtil.convertArrayToJson = function(arr,name){
		var obj = {}
		for(var i = 0;i<arr.length;i++){
			for(key in arr[i]){
				var value = arr[i][key]
				if(value instanceof Array && value.length){
					value = baseUtil.convertArrayToJson(value)
				}
				obj[name+'['+i+'].'+key] = value
			}
		}
		return obj
	}
	baseUtil.getKeyandValue = function(obj){
		var temStr = ''
		for(key in obj){
			temStr += key+'='+obj[key]+'&'
		}
		temStr = temStr.replace(/&$/,'')
		return temStr	
	}
	baseUtil.each = function(arr,callback){
		var i = 0
		for(;i < arr.length;i++)
		{
			callback.apply(arr[i])
		}
	}
	baseUtil.extend = function(){
		if(arguments.length > 1){
			return Object.assign.apply(null,arguments)
		}
	}
	baseUtil.getBasePath = function(){
		 
		// http://localhost:8080/BMS/views/login.html;jsessionid=9A918AE98683A1B8C207FAF6959A9E9D
		var curWwwPath=window.document.location.href
		
		// /BMS/views/login.html;jsessionid=9A918AE98683A1B8C207FAF6959A9E9D
	    var pathName=window.document.location.pathname
	   
	    var pos=curWwwPath.indexOf(pathName)
	    // http://localhost:8080
	    var localhostPaht=curWwwPath.substring(0,pos)  
	    // BMS
	    var projectName=pathName.substring(0,pathName.substr(1).indexOf('/')+1)
	    
	    return localhostPaht+projectName
	}
	
	baseUtil.WebRootUrl =  baseUtil.getBasePath()
	
	return baseUtil
})
