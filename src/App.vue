<template>
  <div>
    <Comment />
    <div id='textLength' style='font-family:Microsoft Yahei; white-space: normal;
         position:fixed;z-index:-1;bottom:0;opacity:0;height:0;font-size:14px'></div>
  </div>
</template>

<script>
  import Comment from './views/Forum/Comment.vue'

  export default {
    name: 'App',
    components: {
      Comment
    }
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