import Vue from 'vue'
loadStyle('https://cdn.bootcdn.net/ajax/libs/element-ui/2.15.0/theme-chalk/index.min.css')

import App from './App.vue'
import api from './function/utils'
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

api.httpMethod("POST", "login/", {
  'ASP': api.getASPSESSION()
}).then(res => {
  sessionStorage.setItem('uuid', res.uuid)
  new Vue({
    render: h => h(App),
  }).$mount('#app')
}).catch((e) => {
  alert("ERROR: " + e)
})