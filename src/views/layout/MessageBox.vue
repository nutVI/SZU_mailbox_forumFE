<template>
  <div class="msgBox">
    <el-row style="margin-bottom:10px" type="flex" justify="center" align="middle">
      <el-col :span="9">
        <el-row>
          <el-radio-group v-model="radio" size="small">
            <el-badge :hidden="!$root.MESSAGE" :value="$root.MESSAGE" :max="99" style="z-index:3100">
              <el-radio-button label="1">回复</el-radio-button>
            </el-badge>
            <el-badge :hidden="!$root.LIKE" :value="$root.LIKE" :max="99">
              <el-radio-button label="2">点赞</el-radio-button>
            </el-badge>
          </el-radio-group>
        </el-row>
      </el-col>
    </el-row>
    <el-row class="scrollBox">
      <transition name="msgfade">
        <div v-show="radio==1" v-infinite-scroll="load" infinite-scroll-delay="500" style="overflow:visible">
          <div v-for="item,index in replyMsg.arr" :key="index">
            <el-card>
              <el-row>
                <el-col :span="4">
                  <el-badge is-dot :hidden="item.isread">
                    <el-image class="avatar" :src="item.creator.avatar||$root.NULLAVATAR" fit="cover" lazy>
                    </el-image>
                  </el-badge>
                </el-col>
                <el-col :span="20">
                  <el-row>
                    <strong>{{item.creator.user}}</strong>{{' 回复了你'}}
                  </el-row>
                  <el-row style="font-size:12px">
                    {{item.time.substring(5, 10)}}
                  </el-row>
                </el-col>
              </el-row>
              <el-row>
                {{item.reply.content}}
              </el-row>
              <el-row>
                <el-link @click.native="readReply(item.id,index)" type="primary"
                  :href="'https://www1.szu.edu.cn/mailbox/view.asp?id='+item.reply.post_id" target="_blank">
                  {{'信箱详情页: '+ item.reply.post}}</el-link>
              </el-row>
            </el-card>
          </div>
          <el-card v-if="replyMsg.loging" v-loading="replyMsg.loging">
            <div class="msg-loging">获取中</div>
          </el-card>
          <el-card v-else>
            <div class="msg-loging">到底了</div>
          </el-card>
        </div>
      </transition>
      <transition name="msgfade">
        <div v-show="radio==2">
          <el-card>
            开发中
          </el-card>
        </div>
      </transition>
    </el-row>
    <el-row style="margin-top:10px" type="flex" align="middle" justify="end">
      <el-col :span="6">
        <el-button @click="readReply()" type="text" size="mini">全部收取</el-button>
      </el-col>
    </el-row>
  </div>
</template>


<script>
  import api from '../../function/utils'
  export default {
    data() {
      return {
        radio: "1",
        replyMsg: {
          currentPage: 1,
          total: -1,
          limit: 4,
          cache: 0,
          loging: true,
          arr: []
        }
      };
    },
    mounted() {
      this.getReplyMsg();
    },
    methods: {
      load() {
        if (this.replyMsg.arr.length >= this.replyMsg.total) {
          this.replyMsg.loging = false
          return;
        }
        this.getReplyMsg();
        this.$message.success('加载中');
      },
      getReplyMsg() {
        api.httpJsonMethod('GET', 'msg/bereply/', {
          'limit': this.replyMsg.limit,
          'offset': this.replyMsg.currentPage,
        }).then((data) => {
          this.replyMsg.total = data.total;
          for (const i in data.msg) {
            api.httpHtmlMethod("GET", "mailbox/view.asp", {
              "id": data.msg[i].reply.post_id
            }, "gb2312").then((res) => {
              this.replyMsg.arr.push(data.msg[i])
              let str = res.match(/(<title>=?)(.*?)(?=<\/title>)/)[2].slice(0, -8)
              // if (str.length > 12) str = str.substring(0, 10) + "..."
              this.$set(data.msg[i].reply, 'post', str)
            })
          }
        })
      },
      readReply(id, index) {
        let data = {
          'all': 1
        }
        if (id) {
          if (this.replyMsg.arr[index].isread) return;
          data = {
            'id': id
          }
        }
        api.httpJsonMethod('POST', 'msg/bereply/', data).then((res) => {
          if (data.all) {
            this.$message.success(res.result)
            for (const i in this.replyMsg.arr) {
              this.replyMsg.arr[i].isread = true
            }
          } else {
            this.replyMsg.arr[index].isread = true
          }
        }).catch((e) => {
          this.$message.error(e)
        })
      }
    }
  }
</script>

<style scoped>
  .msgBox {
    height: 335px;
    width: 310px;
  }

  .scrollBox {
    height: 260px;
    overflow: scroll;
  }

  .avatar {
    width: 32px;
    height: 32px;
  }


  .scrollBox::-webkit-scrollbar {
    /*滚动条整体样式*/
    width: 5px;
    /*高宽分别对应横竖滚动条的尺寸*/
    height: 1px;
  }

  .scrollBox::-webkit-scrollbar-thumb {
    /*滚动条里面小方块*/
    border-radius: 10px;
    box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
    background: #bebebe;
  }

  .scrollBox::-webkit-scrollbar-track {
    /*滚动条里面轨道*/
    box-shadow: inset 0 0 5px rgba(175, 175, 175, 0.534);
    border-radius: 10px;
    background: #ffffff;
  }

  .msg-loging {
    text-align: center;
    font-size: 14px;
    color: #868686;
  }

  .msgfade-enter-active,
  .msgfade-leave-active {
    transition: opacity .2s;
  }

  .msgfade-enter,
  .msgfade-leave-to {
    opacity: 0;
  }
</style>