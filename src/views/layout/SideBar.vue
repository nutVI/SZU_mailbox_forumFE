<template>
  <div>
    <div class="sidebar" align="left">
      <el-menu :default-active="active" class="el-menu-vertical-demo" @select="selectIcon" :collapse="true">
        <el-menu-item index="1">
          <el-image style="width: 24px; height: 24px; top:16px"
            :src="$root.AVATAR||'https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9dpng.png'">
          </el-image>
          <span slot="title">个人信息</span>
        </el-menu-item>
        <el-menu-item index="2">
          <i class="el-icon-menu" style="position: relative; top:16px"></i>
          <span slot="title">修改昵称</span>
        </el-menu-item>
        <el-menu-item index="3">
          <i class="el-icon-document" style="position: relative;top:16px"></i>
          <span slot="title">修改头像</span>
        </el-menu-item>
        <el-menu-item index="4" disabled>
          <i class="el-icon-setting" style="position: relative;top:16px"></i>
          <span slot="title">提交反馈</span>
        </el-menu-item>
      </el-menu>
    </div>
    <el-dialog title="提示" :visible.sync="dialogVisible" width="30%" :before-close="handleClose">
      <span>这是一段信息</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import api from '../../function/utils'
  export default {
    data() {
      return {
        active: '1',
        dialogVisible: false
      };
    },
    methods: {
      handleClose(done) {
        this.$confirm('确认关闭？')
          .then(_ => {
            done();
          })
          .catch(_ => {});
      },
      selectIcon(index) {
        this.active = index
        if (index == 2) this.setNickname()
        else if (index == 3) this.dialogVisible = true
      },
      setNickname() {
        this.$prompt('请输入要修改的昵称', '注意长度', {
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
              this.$message({
                type: 'success',
                message: '清空昵称成功'
              });
            })
        });
      }
    }
  }
</script>

<style scoped>
  .sidebar {
    top: 108px;
    left: 0;
    position: fixed;
  }

  .sidebar>>>.el-tooltip {
    line-height: 24px;
  }
</style>