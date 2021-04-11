<template>
  <div style="width:960px">
    <el-main v-if="postId!=0" class="my_table" style="width:90%;padding:0;">
      <el-table :header-cell-style="headerStyle" :stripe="false" :data="comment" v-loading="loading"
        :cell-style="columnStyle">
        <el-table-column align="center" :label="'评论:' + total" width="96">
          <template slot-scope="scope">
            <el-col>
              <el-image class="avatar"
                :src="scope.row.creator.avatar||'https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9dpng.png'"
                fit="cover" lazy>
              </el-image>
            </el-col>
            <el-col class="userName">{{scope.row.creator.user }}</el-col>
          </template>
        </el-table-column>
        <el-table-column label="content">
          <template slot="header" slot-scope="scope">
            <el-row type="flex" align="middle">
              <el-col :span="18"></el-col>
              <el-col :span="3">
                <el-button class="buttonSelect" size="small" type="primary" @click="postComment()">评论</el-button>
              </el-col>
              <el-col :span="3">
                <el-button class="buttonSelect" size="small" type="primary" @click="getComment()">刷新</el-button>
              </el-col>
              <el-col :span="3">
                <el-button class="buttonSelect" size="small" :disabled="true" type="primary"
                  @click="sortComment(scope.$index, scope.row)">
                  按时间:
                  {{ sort == "id" ? "旧" : "新" }}</el-button>
              </el-col>
            </el-row>
          </template>
          <template slot-scope="scope">
            <div class="commentContent">{{scope.row.content}}</div>
            <el-row type="flex" align="middle" class="comment-delete">
              <el-col :span="2">
                <div style="min-width: 27px">
                  {{ scope.row.level + "楼" }}
                </div>
              </el-col>
              <el-col :span="17">
                {{ scope.row.time.substring(0, 10) }}
                {{ scope.row.time.substring(11, 16) }}
              </el-col>
              <el-col :span="2">
                <el-row type="flex" justify="center" align="middle">
                  <el-button class="text-dangerous-buttonSelect" v-if="$root.UUID==scope.row.creator.uuid"
                    @click="deleteComment(scope.row.id, scope.$index)" size="mini" type="text">
                    删除
                  </el-button>
                </el-row>
              </el-col>

              <el-col :span="2">
                <el-button size="mini" type="text" style="padding:0;" @click="likeIt(scope.row.id, scope.$index)">
                  <i v-if="!scope.row.isLike" style="font-size:22px;" class="iconfont icon0_like1 iconfont-hover" />
                  <i v-else style="font-size:22px;" class="iconfont icon0_like2" />
                  <font style="font-size:12px;position:relative;top:-2px;color:#aaaaaa">{{scope.row.like}}</font>
                  <!-- icon0_like2 -->
                </el-button>
              </el-col>

              <el-col :span="3">
                <el-badge :value="scope.row.replies.total" type="primary">
                  <el-button class="buttonSelect" size="mini" type="primary" @click="popReply(scope.$index)">回复
                  </el-button>
                </el-badge>
              </el-col>
            </el-row>
            <el-row>
              <Reply :limit="limit" :commentObj="scope.row" />
            </el-row>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination style="text-align: center; margin: 10px 0 10px 0" background layout="prev, pager, next"
        :total="total" :current-page.sync="currentPage" :page-size="limit" @current-change="getComment()">
      </el-pagination>
      <el-card>
        <el-row style="margin-bottom:10px">
          <el-input type="textarea" :autosize="{ minRows: 3}" v-model="content" placeholder="请写下你的评论">
          </el-input>
        </el-row>
        <el-row type="flex" align="middle">
          <el-col :span="2" :offset="20">
            <el-checkbox v-model="isAnonymous">匿名</el-checkbox>
          </el-col>
          <el-col :span="2">
            <el-button class="buttonSelect" size="mini" type="primary" @click="commentSubmit()">发送</el-button>
          </el-col>
        </el-row>
        <div id="commentEdit" style="position:relative;top:76px"></div>
      </el-card>
    </el-main>
  </div>
</template>

<script>
  import Reply from './Reply.vue'
  import api from '../../function/utils'
  export default {
    components: {
      Reply
    },
    data() {
      return {
        loading: true,
        currentPage: 1,
        total: 0,
        limit: 10,
        postId: 0,

        comment: [],
        sort: "id",
        input: '',
        content: '',
        isAnonymous: 0,
      }
    },
    mounted() {
      this.postId = api.getQueryVariable("id")
      let idTime = setInterval(() => {
        if (this.$root.UUID != -1) {
          clearInterval(idTime)
          this.getComment()
        }
      }, 250)
    },
    methods: {
      likeIt(id, index) {
        console.log(id, index)
        let isLike = this.comment[index].isLike
        if (!isLike) {
          api.httpMethod('POST', 'addlike/', {
            'id': id,
            'type': 'comment'
          }).then(() => {
            this.comment[index].like++;
            this.comment[index].isLike = !isLike;
          }).catch(e => {
            this.$message.error(e)
          })
        } else {
          api.httpMethod('POST', 'cancelike/', {
            'id': id,
            'type': 'comment'
          }).then(() => {
            this.comment[index].like--;
            this.comment[index].isLike = !isLike;
          }).catch(e => {
            this.$message.error(e)
          })
        }
      },
      getComment() {
        this.loading = true;
        api.httpMethod('GET', 'comment/', {
          'postId': this.postId,
          'limit': this.limit,
          'offset': this.currentPage,
        }).then((data) => {
          this.comment = data.comments
          for (const i in this.comment) {
            this.$set(this.comment[i], 'reply', {
              'commentId': this.comment[i].id,
              'content': '',
              'number': 0,
              'repliedId': this.comment[i].id,
              'isAnonymous': 0,
              'repliedUser': '',
              'showReply': false,
              'showInput': false,
              'loading': false,
              'currentPage': 1
            })
            const rArr = this.comment[i].replies.replies
            for (const j in rArr) {
              let str = rArr[j].creator.user + " :  "
              str += (rArr[j].replied ? ('@' + rArr[j].replied.user + ' : ') : "") + rArr[j].content
              this.$set(rArr[j], 'height', api.getLength(str))
            }
            this.comment[i].reply.showReply = this.comment[i].replies.total != 0
          }
          this.total = data.total
          this.loading = false
        }).catch((e) => {
          this.$message.error(e)
        })
      },
      postComment() {
        document.getElementById("commentEdit").scrollIntoView({
          block: 'end',
          behavior: 'smooth'
        })
      },
      commentSubmit() {
        if (this.content.length >= 2) {
          api.httpMethod('POST', 'comment/', {
            'postId': this.postId,
            'content': this.content,
            'isAnonymous': this.isAnonymous ? 1 : 0,
          }).then((data) => {
            this.$message.success('评论成功')
            this.total++;
            if (Math.ceil((this.total) / 10) > this.currentPage) {
              this.currentPage = Math.ceil(this.total / 10)
              this.getComment()
            } else {
              this.$set(data, 'reply', {
                'commentId': data.id,
                'content': '',
                'number': 0,
                'repliedId': data.id,
                'isAnonymous': 0,
                'repliedUser': '',
                'showReply': false,
                'showInput': false,
                'loading': false,
                'currentPage': 1
              })
              this.comment.push(data)
            }
            this.content = ''
          }).catch((e) => {
            this.$message.error(e)
          })
        } else {
          this.$message.error("字数少于2")
        }
      },
      deleteComment(id, index) {
        this.$confirm('确认删除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          api.httpMethod('DELETE', 'comment/', {
            'id': id
          }).then((data) => {
            this.$message.success('删除成功')
            this.comment.splice(index, 1)
            this.total--;
          }).catch((e) => {
            this.$message.error(e)
          })
        })
      },
      popReply(index) {
        this.comment[index].reply.showReply = !this.comment[index].reply.showReply
      },
      sortComment(index, row) {
        this.sort = this.sort == 'id' ? '-id' : 'id';
        this.$set(this.comment, index, row)
        this.getComment()
      },
      columnStyle({
        columnIndex
      }) {
        if (columnIndex == 0) return 'background:#cddade;vertical-align:top;'
        else return 'background:#fff;vertical-align:top;'
      },
      headerStyle({
        columnIndex
      }) {
        if (columnIndex == 0) return 'background:#ebeef5;font-size: 14px;'
      }
    }
  }
</script>
<style scoped>
  .userName {
    position: relative;
    right: 4px;
    width: 84px;
    font-size: 12px;
    color: #0b66c0;
    margin: 7px 0 9px 0;
  }

  .avatar {
    margin-top: 12px;
    width: 76px;
    height: 76px;
  }

  .commentContent {
    min-height: 97px;
  }

  .iconfont-hover {
    color: #95adc5;
  }

  .iconfont-hover:hover {
    color: #409EFF;
  }

  .comment-delete>div:nth-of-type(3) {
    visibility: hidden;
  }

  .comment-delete:hover>div:nth-of-type(3) {
    visibility: visible;
  }
</style>