<template>
  <div style="width: 960px; margin: 0 auto">
    <transition name="navfade">
      <SideBar v-show="navOut" />
    </transition>
    <Comment v-if="showURL == 1" />
    <div
      id="textLength"
      style="
        font-family: Microsoft Yahei;
        white-space: normal;
        position: fixed;
        z-index: -1;
        bottom: 0;
        opacity: 0;
        height: 0;
        font-size: 14px;
      "
    ></div>
  </div>
</template>

<script>
import Comment from "./views/Forum/Comment.vue";
import SideBar from "./views/layout/SideBar.vue";
import api from "./function/utils";
import api2 from "./function/change";

export default {
  name: "App",
  components: {
    Comment,
    SideBar,
  },
  data() {
    return {
      showURL: 0,
      navOut: false,
    };
  },
  beforeMount() {
    setTimeout(() => {
      this.navOut = true;
    }, 0);
    let linkElm = document.createElement("link");
    linkElm.setAttribute("rel", "stylesheet");
    linkElm.setAttribute("type", "text/css");
    linkElm.setAttribute(
      "href",
      "https://at.alicdn.com/t/font_2377626_16z07jla638g.css"
    );
    document.head.appendChild(linkElm);

    let a = document.querySelector(
      "body > table > tbody > tr:nth-child(1) > td > table > tbody > tr:nth-child(3) > td:nth-child(1) > table > tbody > tr:nth-child(1) > td > a:nth-child(3)"
    );
    a &&
      (a.onclick = () => {
        api.httpJsonMethod("GET", "logout/", {});
      });

    if (process.env.VUE_APP_ENVIRONMENT === "development") this.getMsg();
    else
      api
        .httpHtmlMethod(
          "GET",
          "https://www1.szu.edu.cn/baoxiu/111.asp",
          {},
          "gb2312"
        )
        .then((res) => {
          if (res.match(/(学工号(.*?))<\/b>/g)) {
            this.getMsg();
          } else {
            this.$root.UUID = 0;
          }
        });
    if (api.getQueryVariable("id")) {
      this.showURL = 1;
      api2.changePrePage(this.$root);
    }
  },
  methods: {
    getMsg() {
      api
        .httpJsonMethod("POST", "login/", {
          ASP: api.getASPSESSION(),
        })
        .then((data) => {
          this.$root.AVATAR = data.avatar;
          this.$root.UUID = data.uuid;
          this.$root.NICKNAME = data.nickname;
          this.$root.MESSAGE = data.reply;
          this.$root.LIKE = 0;
        })
        .catch((e) => {
          this.$root.UUID = 0;
          this.$message.error(e);
        });
    },
  },
};
</script>

<style>
body {
  overflow-y: scroll;
}

.el-tooltip__popper span {
  color: #ffffff;
  font-size: 12px;
  line-height: 100%;
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

.text-buttonSelect:hover span {
  color: #7cbbff;
}

.text-buttonSelect:active span {
  color: #006dda;
}

.text-dangerous-buttonSelect span {
  color: #f56c6c;
  font-family: 微软雅黑;
  font-size: 14px;
  line-height: 100%;
}

.text-dangerous-buttonSelect:active span {
  color: #d33d3d;
}

.text-buttonSelect-mini span {
  color: #409eff;
  font-family: 微软雅黑;
  font-size: 12px;
  line-height: 100%;
}

.text-buttonSelect-mini span:hover {
  color: #7cbbff;
}

.text-buttonSelect-mini:active span {
  color: #006dda;
}

.text-link > a:hover {
  text-decoration: none;
}

.text-link span {
  color: #409eff;
  font-family: 微软雅黑;
  font-size: 14px;
  line-height: 1.4;
}

.text-link span:hover {
  color: #7cbbff;
}

.navfade-enter-active,
.navfade-leave-active {
  transition: opacity 0.8s;
}

.navfade-enter,
.navfade-leave-to {
  opacity: 0;
}
</style>