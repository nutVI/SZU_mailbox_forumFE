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
      NICKNAME: "未登录",
      MESSAGE: 0,
      LIKE: 0,
      NULLAVATAR: 'https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9dpng.png'
    }
  }
}).$mount('#app')