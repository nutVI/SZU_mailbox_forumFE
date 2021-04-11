import api from './function/utils'
api.loadInit()

import Vue from 'vue'
import App from './App.vue'

if (process.env.VUE_APP_ENVIRONMENT === "development") {
  const ElementUI = require('element-ui')
  Vue.use(ElementUI)
}


new Vue({
  render: h => h(App),
  data() {
    return {
      UUID: -1,
      AVATAR: null,
      NICKNAME: null,
      MESSAGE: 0
    }
  }
}).$mount('#app')