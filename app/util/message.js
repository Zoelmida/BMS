//对 vue message 进行二次封装

import ELEMENT from 'element-ui'

import Vue from 'vue'

Vue.use(ELEMENT) 

export var messageHelper = { install: function (Vue, ops) {
	Vue.mixin({
		methods: {
			$showMess: function (ops) {
				this.$message({
					message: ops.message,
					type: ops.messType,
					duration: typeof ops.time == 'undefined' ? 2000 : ops.time
				})
			},
			$showConfirm: function (ops) {
				// tips:提示的内容  title:提示框的标题  ok:确认按钮的文字
				// no:取消按钮的文字  success:成功的回调函数  err:失败的回调函数
				this.$confirm(ops.tips, ops.title, {
					confirmButtonText: ops.ok,
					cancelButtonText: ops.no,
					type: ops.type
				}).then(ops.success)
					.catch(ops.error)
			}
		}
	})
} }

   
