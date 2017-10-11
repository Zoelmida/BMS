import * as types from './mutation-types'

export default {
  [types.pushbmstabs] (state,obj) {
  	state.bmstabs.push(obj)
  },
  [types.removebmstabs](state,targetName){
  	state.bmstabs = state.filter(tab=>tab.url !== targetName);
  },
  [types.setMenuData](state,menuData){
  	state.menuData = menuData
  }
  }
 