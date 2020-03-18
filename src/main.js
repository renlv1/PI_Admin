import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import fetch from './api/api'
import * as customFiter from './filter'
import listWrap from '@/components/listWrap'
import './plugins/element.js'
import globalMixin from './mixin'

Vue.component('listWrap', listWrap)
Vue.mixin(globalMixin)

Vue.prototype.$fetch = fetch
Vue.prototype.$api = process.env.VUE_APP_BASE_PATH
Vue.config.productionTip = false

// 判断空
Vue.prototype.isEmpty = function (str) {
  if (str) return str
  return '-'
}

//配置全局过滤器
Object.keys(customFiter).forEach(key => {
  Vue.filter(key, customFiter[key])
})
Vue.prototype.toastD = function (text) {
  this.toast = this.$createToast({
    txt: text,
    time: 2000,
    type: 'txt'
  })
  this.toast.show()
}

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
