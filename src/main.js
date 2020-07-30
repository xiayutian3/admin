import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './components'
import './plugins/iview'
// import './plugins/socketio'
import vfliters from '@/utils/filters'
for (const key in vfliters) {
  Vue.filter(key, vfliters[key])
}

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
