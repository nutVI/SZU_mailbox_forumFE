<template>
  <div style="width:960px;margin: 0 auto">
    <Comment />
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
    },
  }
</script>

<style>
  body {
    overflow-y: scroll;
  }

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