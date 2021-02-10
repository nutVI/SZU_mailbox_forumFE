<template>
  <el-collapse-transition>
    <div v-show="commentObj.reply.showReply" style="margin-top:10px;">
      <el-table :data="commentObj.replies.replies" :show-header="false" :cell-style="replycolumnStyle"
        v-loading="commentObj.reply.loading">
        <el-table-column align="center" width="52" label="head">
          <template>
            <el-image class="avatar" src="https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9dpng.png"
              fit="cover" lazy>
            </el-image>
          </template>
        </el-table-column>
        <el-table-column label="content">
          <template slot-scope="item">
            <el-row :style="'height:'+ item.row.height +'px'">
              {{ item.row.user + " :  "+ (item.row.number?('@' + item.row.repliedUser+' : '):"") + item.row.content}}
            </el-row>
            <el-row style="height:23px" type="flex" align="middle" justify="end">
              <el-col :span="16">
                <div style="min-width: 27px">
                  {{ item.row.level + "层" }}
                </div>
              </el-col>
              <el-col :span="2">
                <el-button v-if="uuid==item.row.uuid" style="padding: 0;" type="text"
                  class="text-dangerous-buttonSelect" @click="deleteReply(item.row.id, item.$index)"> 删除
                </el-button>
              </el-col>
              <el-col :span="4" style="font-family: Avenir, Helvetica, Arial, sans-serif;">
                {{ item.row.time.substring(0, 10) }}
                {{ item.row.time.substring(11, 16) }}
              </el-col>
              <el-col :span="2">
                <el-button style="padding: 0;" type="text" class="text-buttonSelect"
                  @click="postReply(item.row.level,item.row.user,item.row.id)">回复
                </el-button>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
      </el-table>
      <el-row type="flex" align="middle" justify="end">
        <el-col>
          <el-pagination v-if="commentObj.replies.total != 0" small layout="prev, pager, next"
            :total="commentObj.replies.total" :current-page.sync="commentObj.reply.currentPage" :page-size="limit"
            @current-change="getReply(index)">
          </el-pagination>
        </el-col>
        <el-col :span="3">
          <el-button style="padding: 0;" type="text" class="text-buttonSelect"
            @click="postReply(0,commentObj.user,commentObj.id)">
            回复一下
          </el-button>
        </el-col>
      </el-row>
      <el-collapse-transition>
        <el-card v-show="commentObj.reply.showInput">
          <el-row style="margin-bottom:10px">
            <el-input v-model="commentObj.reply.content" placeholder="请写下你的回复">
              <template v-if="commentObj.reply.number" slot="prepend">{{'@'+commentObj.reply.repliedUser}}</template>
            </el-input>
          </el-row>
          <el-row type="flex" align="middle">
            <el-col :span="3" :offset="18">
              <el-checkbox v-model="commentObj.reply.isAnonymous">匿名</el-checkbox>
            </el-col>
            <el-col :span="2">
              <el-button class="buttonSelect" size="mini" type="primary" @click="replySubmit()">
                发送
              </el-button>
            </el-col>
          </el-row>
        </el-card>
      </el-collapse-transition>
    </div>
  </el-collapse-transition>
</template>

<script>
  import api from '../../function/utils'

  export default {
    props: {
      uuid: String,
      limit: Number,
      index: Number,
      commentObj: Object,
      httpMethod: Function,
      getReply: Function
    },
    methods: {
      postReply(level, repliedUser, repliedId) {
        if (this.commentObj.reply.showInput && level == this.commentObj.reply.number)
          this.commentObj.reply.showInput = false
        else this.commentObj.reply.showInput = true
        this.commentObj.reply.number = level
        this.commentObj.reply.repliedUser = repliedUser
        this.commentObj.reply.repliedId = repliedId
      },
      replySubmit() {
        if (this.commentObj.reply.content.length >= 3) {
          this.httpMethod('POST', 'reply/', {
            'commentId': this.commentObj.reply.commentId,
            'content': this.commentObj.reply.content,
            'number': this.commentObj.reply.number,
            'repliedId': this.commentObj.reply.repliedId,
            'isAnonymous': this.commentObj.reply.isAnonymous ? 1 : 0,
          }).then((data) => {
            this.$message.success('回复成功')
            this.commentObj.replies.total++;
            if (Math.ceil((this.commentObj.replies.total) / 10) > this.commentObj.reply.currentPage) {
              this.commentObj.reply.currentPage = Math.ceil(this.commentObj.replies.total / 10)
              this.getReply(this.index)
            } else {
              let str = data.user + " :  "
              str += (data.number ? ('@' + data.repliedUser + ' : ') : "") + data.content
              this.$set(data, 'height', api.getLength(str))
              this.commentObj.replies.replies.push(data)
            }
            this.commentObj.reply.content = ''
            this.content = ''
          }).catch((e) => {
            this.$message.error(e)
          })
        } else {
          this.$message.error("字数少于3")
        }
      },
      deleteReply(id, index) {
        this.$confirm('确认删除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.httpMethod('DELETE', 'reply/', {
            'id': id
          }).then((data) => {
            this.$message.success('删除成功')
            this.commentObj.replies.replies.splice(index, 1)
            this.commentObj.replies.total--;
          }).catch((e) => {
            this.$message.error(e)
          })
        })
      },
      replycolumnStyle() {
        return 'background:#f5f6f7;vertical-align:top;padding:5px;'
      },
    }
  }
</script>

<style scoped>
  .avatar {
    margin-top: 5px;
    width: 32px;
    height: 32px;
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