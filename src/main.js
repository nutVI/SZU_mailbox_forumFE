document.querySelector("body").style.paddingRight = "0"

import api from './function/utils'
api.loadStyle('https://cdn.jsdelivr.net/gh/nutVI/SZU_mailbox_forumFE/js_modules/element-ui-2.15.0/index.min.css')

let father = document.getElementById('testVueToTamper') ||
  document.querySelector("body > table > tbody > tr:nth-child(2) > td > table > tbody > tr:nth-child(3) > td > table > tbody > tr:nth-child(2) > td")
if (!api.getQueryVariable("id")) {
  father = document.body
}
let divApp = document.createElement('div')
divApp.id = 'app'
father.append(divApp)

import Vue from 'vue'
import App from './App.vue'

if (process.env.VUE_APP_ENVIRONMENT === "development") {
  const ElementUI = require('element-ui')
  Vue.use(ElementUI)
}

new Vue({
  render: h => h(App),
}).$mount('#app')