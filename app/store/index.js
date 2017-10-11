import Vue from 'vue'
import Vuex from 'vuex'
import * as getters from './getters'
import * as actions from './actions'
import mutations from './mutations'
Vue.use(Vuex)

Vue.use(Vuex)

const state = {
    bmstabs: [{
    url: "#",
    menuname: "首页",
    name: "index",
    closable: false
    }],
   defaultUrl:"welcome",//系统打开时默认的页面。
   menuData:[]
}

export default new Vuex.Store({
  state,
  getters,
  actions,
  mutations
})