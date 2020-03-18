import Vue from 'vue'
import Vuex from 'vuex'
import fetch from '@/api/api'
import route from './router'

Vue.use(Vuex)
/*eslint-disable*/
export default new Vuex.Store({
  state: {
    user: {},
    tempArr: [],
    historyRecord: {},
    showLoading: false,
    navList: [],
    navActiveIndex: 0,
    addOreditFlag: '',
    editId: '',
    treeList: []
  },
  mutations: {
    SET_TEMPARR(state, data) {
      state.tempArr = data
    },
    SET_ACCOUNT(state, data) {
      state.user = data
    },
    CLEAR_ACCOUNT(state) {
      state.user = {}
    },
    SET_LIST_RECORD(state, data) {
      state.historyRecord = data
    },
    SET_LOADING(state, data) {
      state.showLoading = data
    },
    SET_NAV_LIST(state, data) {
      state.navList = data
    },
    SET_NAV_ACTIVE(state, data) {
      state.navActiveIndex = data
    },
    SET_EDIT_FLAG(state, data) {
      state.addOreditFlag = data
    },
    SET_EDITID(state, data) {
      state.editId = data
    },
    SET_TREE_LIST(state, data) {
      state.treeList = data
    }
  },
  actions: {
    // 获取用户信息
    getUserInfo({commit}) {
      fetch.get('/sys/user/info').then(res => {
        commit('SET_ACCOUNT', res.data.user)
        if (window.location.hash.indexOf('login') > -1) {
          route.push('/blank')
        }
      }).catch(err => {
        route.push('/login')
      })
    },
    // 获取导航列表
    getNavList({commit}) {
      fetch.post('/sys/menu/nav').then(res => {
        commit('SET_NAV_LIST', res.data.menuList)
      })
    }
  }
})
