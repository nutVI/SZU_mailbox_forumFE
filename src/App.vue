<template>
  <div style="width:960px;margin: 0 auto">
    <Comment v-if="showURL==1" />
    <div id='textLength' style='font-family:Microsoft Yahei; white-space: normal;
         position:fixed;z-index:-1;bottom:0;opacity:0;height:0;font-size:14px'></div>
    <SideBar />
  </div>
</template>

<script>
  import Comment from './views/Forum/Comment.vue'
  import SideBar from './views/layout/SideBar.vue'
  import api from './function/utils'

  export default {
    name: 'App',
    components: {
      Comment,
      SideBar
    },
    data() {
      return {
        showURL: 0
      }
    },
    beforeMount() {
      let linkElm = document.createElement("link")
      linkElm.setAttribute('rel', 'stylesheet');
      linkElm.setAttribute("type", "text/css")
      linkElm.setAttribute("href", "https://at.alicdn.com/t/font_2377626_16z07jla638g.css")
      document.head.appendChild(linkElm)

      let a = document.querySelector(
        "body > table > tbody > tr:nth-child(1) > td > table > tbody > tr:nth-child(3) > td:nth-child(1) > table > tbody > tr:nth-child(1) > td > a:nth-child(3)"
      )
      a && (a.onclick = () => {
        api.httpMethod("GET", "logout/", {})
      })

      api.httpMethod("POST", "login/", {
        'ASP': api.getASPSESSION()
      }).then(res => {
        this.$root.UUID = res.uuid
      }).catch((e) => {
        this.$root.UUID = 0
        this.$message.error(e)
      })

      if (api.getQueryVariable("id")) {
        document.body.style.overflowY = "scroll"
        this.showURL = 1
      }
    },
  }
</script>

<style>
  .el-message-box__btns span {
    color: #000000;
    font-size: 12px;
    line-height: 100%;
  }

  .buttonSelect span {
    color: #fff;
    font-family: 微软雅黑;
    font-size: 14px;
    line-height: 100%;
  }

  .text-buttonSelect span {
    color: #409eff;
    font-family: 微软雅黑;
    font-size: 14px;
    line-height: 100%;
  }

  .text-dangerous-buttonSelect span {
    color: #F56C6C;
    font-family: 微软雅黑;
    font-size: 14px;
    line-height: 100%;
  }

  .text-buttonSelect:active span {
    color: #006dda;
  }

  .text-dangerous-buttonSelect:active span {
    color: #d33d3d;
  }

  .buttonSelect span {
    color: #fff;
    font-family: 微软雅黑;
    font-size: 14px;
    line-height: 100%;
  }
</style>