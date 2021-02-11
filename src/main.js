import Vue from 'vue'
loadStyle('https://unpkg.com/element-ui@2.15.0/lib/theme-chalk/index.css')

import App from './App.vue'
import {
  loadStyle
} from './function'

let father = document.getElementById('testVueToTamper') ||
  document.querySelector("body > table > tbody > tr:nth-child(2) > td > table > tbody > tr:nth-child(3) > td > table > tbody > tr:nth-child(2) > td")
let divApp = document.createElement('div')
divApp.id = 'app'
father.append(divApp)


if (process.env.VUE_APP_ENVIRONMENT === "development") {
  const ElementUI = require('element-ui')
  Vue.use(ElementUI)
}

new Vue({
  render: h => h(App),
}).$mount('#app')