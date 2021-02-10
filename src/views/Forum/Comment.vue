<template>
  <div style="width:960px">
    <el-main v-if="postId!=0" class="my_table" style="width:90%;padding:0;">
      <el-table :header-cell-style="headerStyle" :stripe="false" :data="comment" v-loading="loading"
        :cell-style="columnStyle">
        <el-table-column align="center" :label="'评论:' + total" width="96">
          <template slot-scope="scope">
            <el-col>
              <el-image class="avatar" src="https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9dpng.png"
                fit="cover" lazy>
              </el-image>
            </el-col>
            <el-col class="userName">{{ scope.row.user }}</el-col>
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
            <el-row type="flex" align="middle">
              <el-col :span="2">
                <div style="min-width: 27px">
                  {{ scope.row.level + "楼" }}
                </div>
              </el-col>
              <el-col :span="18">
                {{ scope.row.time.substring(0, 10) }}
                {{ scope.row.time.substring(11, 16) }}
              </el-col>
              <el-col :span="3">
                <el-button class="buttonSelect" v-if="uuid==scope.row.uuid" size="mini"
                  @click="deleteComment(scope.row.id, scope.$index)" type="danger">
                  删除
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
              <Reply :uuid="uuid" :limit="limit" :index="scope.$index" :commentObj="scope.row" :getReply="getReply"
                :httpMethod="httpMethod" />
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
        uuid: '1',
        input: '',
        content: '',
        isAnonymous: 0,
      }
    },
    mounted() {
      debugger
      this.init().then(res => {
        sessionStorage.setItem('uuid', JSON.parse(res).uuid)
        this.uuid = sessionStorage.getItem('uuid')
      })
      if (!api.getQueryVariable("id")) return
      else this.postId = api.getQueryVariable("id")
      this.getComment()
    },
    methods: {
      async init() {
        const xml = new XMLHttpRequest();
        xml.open('GET', "https://127.0.0.1" + "/login/");
        xml.withCredentials = true
        xml.setRequestHeader('Authorization', api.getASPSESSION());
        xml.send();
        return new Promise((resolve) => {
          xml.onload = () => {
            resolve(xml.responseText)
          }
        })
      },
      async httpMethod(method, url, data) {
        url = 'https://127.0.0.1/' + url
        const xml = new XMLHttpRequest();
        xml.withCredentials = true
        let str = '';
        let isFirst = true;
        for (const i in data) {
          if (isFirst) {
            isFirst = false;
            str += i + '=' + data[i]
          } else str += '&' + i + '=' + data[i]
        }

        if (method == 'GET' || method == 'DELETE') {
          xml.open(method, url + '?' + str);
          xml.send(null);
        } else if (method == 'POST') {
          xml.open(method, url);
          xml.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
          xml.send(str);
        }
        return new Promise((resolve, reject) => {
          xml.onload = () => {
            if (xml.status == 200) resolve(JSON.parse(xml.responseText))
            else reject(xml.responseText);
          }
        })
      },
      getComment() {
        this.loading = true;
        this.httpMethod('GET', 'comment/', {
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
              let str = rArr[j].user + " :  "
              str += (rArr[j].number ? ('@' + rArr[j].repliedUser + ' : ') : "") + rArr[j].content
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
        if (this.content.length >= 3) {
          this.httpMethod('POST', 'comment/', {
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
              data['replies'] = {}
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
          this.$message.error("字数少于3")
        }
      },
      deleteComment(id, index) {
        this.$confirm('确认删除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.httpMethod('DELETE', 'comment/', {
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
      getReply(index) {
        this.comment[index].reply.loading = true
        this.httpMethod('GET', 'reply/', {
          'commentId': this.comment[index].id,
          'limit': this.limit,
          'offset': this.comment[index].reply.currentPage,
        }).then((data) => {
          for (const i in data) {
            if (i == 'replies') {
              for (const j in data[i]) {
                let str = data[i][j].user + " :  "
                str += (data[i][j].number ? ('@' + data[i][j].repliedUser + ' : ') : "") + data[i][j].content
                this.$set(data[i][j], 'height', api.getLength(str))
              }
            }
            this.comment[index].replies[i] = data[i]
          }
          this.comment[index].reply.loading = false
        }).catch((e) => {
          this.$message.error(e)
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
        if (columnIndex == 0) return 'background:#ebeef5;'
      }
    }
  }
</script>
<style scoped>
  .cell {
    font-size: 14px;
  }

  .buttonSelect span {
    color: #fff;
    font-family: 微软雅黑;
    font-size: 14px;
    line-height: 100%;
  }

  .userName {
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
</style>