<template>
  <div>
    <div class="sidebar">
      <el-menu :default-active="active" class="el-menu-vertical-demo" @select="selectIcon" :collapse="true">
        <el-popover placement="right-start" width="400" trigger="click">
          <el-table :data="gridData">
            <el-table-column width="150" property="date" label="日期"></el-table-column>
            <el-table-column width="100" property="name" label="姓名"></el-table-column>
            <el-table-column width="300" property="address" label="地址"></el-table-column>
          </el-table>
          <el-menu-item slot="reference" index="1">
            <el-badge :hidden="!$root.MESSAGE" :value="$root.MESSAGE" :max="99" style="top:16px">
              <el-image style="width: 24px; height: 24px;"
                :src="$root.AVATAR||'https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9dpng.png'">
              </el-image>
            </el-badge>
            <span slot="title">{{$root.NICKNAME}}</span>
          </el-menu-item>
        </el-popover>
        <el-menu-item index="2">
          <i class="el-icon-edit-outline" style="position: relative; top:16px"></i>
          <span slot="title">修改昵称</span>
        </el-menu-item>
        <el-menu-item index="3">
          <i class="el-icon-picture-outline" style="position: relative;top:16px"></i>
          <span slot="title">修改头像</span>
        </el-menu-item>
        <el-menu-item index="4">
          <i class="el-icon-warning-outline" style="position: relative;top:16px"></i>
          <span slot="title">提交反馈</span>
        </el-menu-item>
      </el-menu>
    </div>
    <el-dialog align="left" title="选择头像(不要涩图)" :visible.sync="dialogVisible" width="590px"
      :close-on-click-modal='false'>
      <Picture />
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">关闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import api from '../../function/utils'
  import Picture from './Picture.vue'
  export default {
    components: {
      Picture
    },
    data() {
      return {
        active: '1',
        dialogVisible: false,
        gridData: [{
          date: '2016-05-02',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          date: '2016-05-04',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          date: '2016-05-01',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          date: '2016-05-03',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }]
      };
    },
    methods: {
      selectIcon(index) {
        this.active = index
        if (index == 1);
        else if (index == 2) this.setNickname()
        else if (index == 3) this.dialogVisible = true
        else if (index == 4) this.debug()
      },
      setNickname() {
        this.$prompt('请输入要修改的昵称', '注意长度', {
          closeOnClickModal: false,
          distinguishCancelAndClose: true,
          confirmButtonText: '确定修改',
          cancelButtonText: '清空已存在昵称',
          inputValidator: (value) => {
            if (value.length > 12) return false
            return true
          },
          inputErrorMessage: '长度过长'
        }).then(({
          value
        }) => {
          api.httpMethod("POST", "setnickname/", {
            'nickname': value
          }).then((data) => {
            this.$root.NICKNAME = data['nickname']
            this.$message({
              type: 'success',
              message: '修改成功 ' + data.nickname
            });
          }).catch((e) => {
            this.$message.error(e)
          })
        }).catch((action) => {
          if (action === 'cancel')
            api.httpMethod("POST", "setnickname/", {
              'empty': 'empty'
            }).then((data) => {
              this.$root.NICKNAME = data['user']
              this.$message({
                type: 'success',
                message: '清空昵称成功'
              });
            })
        });
      },
      debug() {
        this.$alert('发送到邮箱1972404126@qq.com', '问题反馈', {
          confirmButtonText: '确定'
        });
      }
    }
  }
</script>

<style scoped>
  .sidebar {
    top: 225px;
    left: 0;
    position: fixed;
    z-index: 2022;
  }

  .sidebar>>>.el-tooltip {
    line-height: 24px;
  }
</style>