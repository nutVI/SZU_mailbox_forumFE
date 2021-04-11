<template>
  <el-collapse-transition>
    <div v-show="commentObj.reply.showReply" style="margin-top:10px;">
      <el-table :data="commentObj.replies.replies" :show-header="false" :cell-style="replycolumnStyle"
        v-loading="commentObj.reply.loading">
        <el-table-column align="center" width="52" label="head">
          <template slot-scope="item">
            <el-image class="avatar"
              :src="item.row.creator.avatar||'https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9dpng.png'"
              fit="cover" lazy>
            </el-image>
          </template>
        </el-table-column>
        <el-table-column label="content">
          <template slot-scope="item">
            <el-row :style="'height:'+ item.row.height +'px'">
              <font style="color:#0b66c0;">{{item.row.creator.user}}</font>{{": "}}
              <font v-if="item.row.replied">
                @<font style="color:#0b66c0;">{{item.row.replied.user}}</font>{{': '}}
              </font>
              {{item.row.content}}
            </el-row>
            <el-row style="height:23px" type="flex" align="middle" justify="end" class="reply-delete">
              <el-col :span="16">
                <div style="min-width: 27px">
                  {{ item.row.level + "层" }}
                </div>
              </el-col>
              <el-col :span="1">
                <el-row style="position:relation;left:10px" type="flex" justify="center" align="middle">
                  <el-button v-if="$root.UUID==item.row.creator.uuid" style="padding:0;margin-bottom:2px" type="text"
                    class="text-dangerous-buttonSelect" @click="deleteReply(item.row.id, item.$index)"> 删除
                  </el-button>
                </el-row>
              </el-col>
              <el-col :span="6" style="font-family: Avenir, Helvetica, Arial, sans-serif;">
                <el-row type="flex" justify="center" align="middle">
                  <div style="margin-left:10px">
                    {{ item.row.time.substring(0, 10) }}
                    {{ item.row.time.substring(11, 16) }}
                  </div>
                </el-row>
              </el-col>

              <el-col :span="2">
                <el-button size="mini" type="text" style="padding:0;" @click="likeIt(item.row.id, item.$index)">
                  <i v-if="!item.row.isLike" style="font-size:16px;" class="iconfont icon0_like1 iconfont-hover" />
                  <i v-else style="font-size:16px;" class="iconfont icon0_like2" />
                  <font style="font-size:12px;position:relative;top:-1px;color:#aaaaaa">{{item.row.like}}</font>
                </el-button>
              </el-col>
              <el-col :span="2">
                <el-button style="padding:0;margin-bottom:2px" type="text" class="text-buttonSelect"
                  @click="postReply(item.row.level,item.row.creator.user,item.row.id)">回复
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
            @current-change="getReply()">
          </el-pagination>
        </el-col>
        <el-col :span="3">
          <el-button style="padding: 0;" type="text" class="text-buttonSelect"
            @click="postReply(0,commentObj.creator.user,commentObj.id)">
            回复楼主
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
      limit: Number,
      commentObj: Object
    },
    mounted() {
      let idTime = setInterval(() => {
        if (this.$root.UUID != -1) clearInterval(idTime)
      }, 250)
    },
    methods: {
      likeIt(id, index) {
        let isLike = this.commentObj.replies.replies[index].isLike
        if (!isLike) {
          api.httpMethod('POST', 'addlike/', {
            'id': id,
            'type': 'reply'
          }).then(() => {
            this.commentObj.replies.replies[index].like++;
            this.commentObj.replies.replies[index].isLike = !isLike;
          }).catch(e => {
            this.$message.error(e)
          })
        } else {
          api.httpMethod('POST', 'cancelike/', {
            'id': id,
            'type': 'reply'
          }).then(() => {
            this.commentObj.replies.replies[index].like--;
            this.commentObj.replies.replies[index].isLike = !isLike;
          }).catch(e => {
            this.$message.error(e)
          })
        }
      },
      getReply() {
        this.commentObj.reply.loading = true
        api.httpMethod('GET', 'reply/', {
          'commentId': this.commentObj.id,
          'limit': this.limit,
          'offset': this.commentObj.reply.currentPage,
        }).then((data) => {
          for (const i in data) {
            if (i == 'replies') {
              for (const j in data[i]) {
                let str = data[i][j].creator.user + " :  "
                str += (data[i][j].replied ? ('@' + data[i][j].replied.user + ' : ') : "") + data[i][j].content
                this.$set(data[i][j], 'height', api.getLength(str))
              }
            }
            this.commentObj.replies[i] = data[i]
          }
          this.commentObj.reply.loading = false
        }).catch((e) => {
          this.$message.error(e)
        })
      },
      postReply(level, repliedUser, repliedId) {
        if (this.commentObj.reply.showInput && level == this.commentObj.reply.number)
          this.commentObj.reply.showInput = false
        else this.commentObj.reply.showInput = true
        this.commentObj.reply.number = level
        this.commentObj.reply.repliedUser = repliedUser
        this.commentObj.reply.repliedId = repliedId
      },
      replySubmit() {
        if (this.commentObj.reply.content.length >= 2) {
          let postData = {
            'content': this.commentObj.reply.content,
            'isAnonymous': this.commentObj.reply.isAnonymous ? 1 : 0,
          }
          if (this.commentObj.reply.number == 0) postData['commentId'] = this.commentObj.reply.commentId
          else postData['repliedId'] = this.commentObj.reply.repliedId
          api.httpMethod('POST', 'reply/', postData).then((data) => {
            this.$message.success('回复成功')
            this.commentObj.replies.total++;
            if (Math.ceil((this.commentObj.replies.total) / 10) > this.commentObj.reply.currentPage) {
              this.commentObj.reply.currentPage = Math.ceil(this.commentObj.replies.total / 10)
              this.getReply()
            } else {
              let str = data.creator.user + " :  "
              str += (data.replied ? ('@' + data.replied.user + ' : ') : "") + data.content
              this.$set(data, 'height', api.getLength(str))
              this.commentObj.replies.replies.push(data)
            }
            this.commentObj.reply.content = ''
            this.content = ''
          }).catch((e) => {
            this.$message.error(e)
          })
        } else {
          this.$message.error("字数少于2")
        }
      },
      deleteReply(id, index) {
        this.$confirm('确认删除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          api.httpMethod('DELETE', 'reply/', {
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

  .iconfont-hover {
    color: #95adc5;
  }

  .iconfont-hover:hover {
    color: #409EFF;
  }

  .reply-delete>div:nth-of-type(2) {
    visibility: hidden;
  }

  .reply-delete:hover>div:nth-of-type(2) {
    visibility: visible;
  }
</style>