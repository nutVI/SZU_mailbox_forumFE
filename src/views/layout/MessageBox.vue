<template>
  <div class="msgBox">
    <el-row style="margin-bottom:10px" type="flex" justify="center" align="middle">
      <el-col :span="9">
        <el-row>
          <el-radio-group v-model="radio" size="small">
            <el-badge :hidden="!$root.MESSAGE" :value="$root.MESSAGE" :max="99" style="z-index:3100">
              <el-radio-button label="回复"></el-radio-button>
            </el-badge>
            <el-badge :hidden="!$root.LIKE" :value="$root.LIKE" :max="99">
              <el-radio-button label="点赞"></el-radio-button>
            </el-badge>
          </el-radio-group>
        </el-row>
      </el-col>
    </el-row>
    <el-row class="scrollBox">
      <div class="infinite-list" v-infinite-scroll="load" infinite-scroll-delay="500" style="overflow:visible">
        <div v-for="item,index in replyMsg.arr" :key="index">
          <el-badge is-dot :hidden="!item.isread">
            <el-card class="infinite-list-item">
              <el-image class="avatar" :src="item.creator.avatar||$root.NULLAVATAR" fit="cover" lazy>
              </el-image>
              {{ item.creator.user }}
              {{item.time.substring(5, 10)}}
              {{item.reply.content}}
              <a :href="'https://www1.szu.edu.cn/mailbox/view.asp?id='+item.reply.post_id" target="_blank"></a>
            </el-card>
          </el-badge>
        </div>

      </div>
    </el-row>
    <el-row style="margin-top:10px" type="flex" align="middle" justify="end">
      <el-col :span="6">
        <el-button type="text" size="mini">全部收取</el-button>
      </el-col>
    </el-row>
  </div>
</template>


<script>
  import api from '../../function/utils'
  export default {
    data() {
      return {
        radio: "回复",
        replyMsg: {
          currentPage: 1,
          total: -1,
          limit: 2,
          cache: 0,
          arr: []
        }
      };
    },
    mounted() {
      this.getReplyMsg();

      api.httpHtmlMethod("GET", "mailbox/view.asp", {
        "id": 304124
      }, "gb2312").then((res) => {
        let str = res.match(/(<title>=?)(.*?)(?=<\/title>)/)[2]
        console.log(str)
      })
    },
    methods: {
      load() {
        if (this.replyMsg.arr.length >= this.replyMsg.total) return;
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
            this.replyMsg.arr.push(data.msg[i])
          }
        })
      }
    }
  }
</script>

<style scoped>
  .msgBox {
    height: 285px;
    width: 310px;
  }

  .scrollBox {
    height: 210px;
    overflow: auto;
  }

  .avatar {
    width: 35px;
    height: 35px;
  }
</style>