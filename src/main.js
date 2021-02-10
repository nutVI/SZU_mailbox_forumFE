import Vue from 'vue'
loadStyle('https://unpkg.com/element-ui@2.15.0/lib/theme-chalk/index.css')

import App from './App.vue'
import {
  loadStyle
} from './function'
import ElementUI from 'element-ui'
// import 'element-ui/lib/theme-chalk/index.css'

let father = document.getElementById('testVueToTamper') ||
  document.querySelector("body > table > tbody > tr:nth-child(2) > td > table > tbody > tr:nth-child(3) > td > table > tbody > tr:nth-child(2) > td")
let divApp = document.createElement('div')
divApp.id = 'app'
father.append(divApp)

Vue.use(ElementUI)
Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')