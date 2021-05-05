<template>
  <div>
    <el-row>
      <el-col :span="12">
        <div v-if="showPic" class="picBox">
          <img :style="'height:'+240*imgHRate+'px;width:'+240*imgWRate+'px'" :src="img64">
          <div class="shadow-pic"></div>
          <div class="anti-shadow" :style="theWidthMove">
            <div class="anti-shadow-pic" :style="shadowWH">
              <img class="anti-shadow-img"
                :style="'height:'+240*imgHRate+'px;width:'+240*imgWRate+'px;top:'+(-cutTop)+'px;left:'+(-cutLeft)+'px;'"
                :src="img64">
            </div>
            <div class="anti-shadow-move" @mousedown="clickBox" :style="shadowWH">
              <span @mousedown="(e)=>{dragBox(e,1)}" class="drag-point point-lt"></span>
              <!-- <span @mousedown="(e)=>{dragBox(e,2)}" class="drag-point point-lb"></span> -->
              <!-- <span @mousedown="(e)=>{dragBox(e,3)}" class="drag-point point-rt"></span> -->
              <span @mousedown="(e)=>{dragBox(e,4)}" class="drag-point point-rb"></span>
            </div>
          </div>
        </div>
        <div v-else class="picBox" @click="inputFile">
          <i style="font-size:28px" class="el-icon-plus"></i>
        </div>
        <el-row>
          <el-button style="margin:5px 30%" class="buttonSelect" size="small" type="primary" v-if="showPic"
            @click="inputFile">重新选择</el-button>
        </el-row>
        <input ref="file_input" type="file" name="image" accept="image/png,image/jpg,image/jpeg" style="display:none;"
          @change="getFile">
      </el-col>
      <el-col type="flex" justify="center" align="middle" :span="12">
        <el-row>头像预览</el-row>
        <el-row>
          <div class="picView">
            <div class="view-pic">
              <img class="view-img" :style="viewpic" :src="img64">
            </div>
          </div>
        </el-row>
        <el-row>
          <el-button class="buttonSelect" size="small" type="primary" @click="submitPic">提交</el-button>
        </el-row>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import api from '../../function/utils'
  export default {
    data() {
      return {
        imgObj: null,
        img64: '',
        imgWRate: 1,
        imgHRate: 1,
        showPic: false,
        cutHeight: 50,
        cutWidth: 50,
        cutTop: 50,
        cutLeft: 50,
      }
    },
    methods: {
      inputFile() {
        this.$refs.file_input.dispatchEvent(new MouseEvent('click'))
      },
      getFile() {
        const inputFile = this.$refs.file_input.files[0]
        if (inputFile) {
          if (inputFile.type !== 'image/jpeg' && inputFile.type !== 'image/png' && inputFile.type !== 'image/gif') {
            this.$message.error('不是有效的图片文件！');
            return;
          }
          var reader = new FileReader();
          reader.that = this
          reader.onload = function () {
            reader.that.img64 = reader.result;
            let img = new Image();
            img.onload = function () {
              reader.that.imgObj = img
              if (this.width / this.height <= 1) reader.that.imgWRate = this.width / this.height
              else reader.that.imgHRate = this.height / this.width
            };
            img.src = reader.result;
            reader.that.imgWRate = 1
            reader.that.imgHRate = 1
            reader.that.cutHeight = 50
            reader.that.cutWidth = 50
            reader.that.cutTop = 50
            reader.that.cutLeft = 50
            reader.that.showPic = true
            reader.that.imgObj = null
          }
          reader.readAsDataURL(inputFile);
        } else {
          return;
        }
      },
      submitPic() {
        if (this.imgObj) {
          var canvas = document.createElement('canvas');
          var context = canvas.getContext('2d');

          var sourceX = this.cutLeft / 240 * this.imgObj.width;
          var sourceY = this.cutTop / 240 * this.imgObj.height;
          var sourceWidth = this.cutWidth / (240 * this.imgWRate) * this.imgObj.width;
          var sourceHeight = this.cutHeight / (240 * this.imgHRate) * this.imgObj.height;

          canvas.width = sourceWidth
          canvas.height = sourceHeight

          context.drawImage(this.imgObj, sourceX, sourceY, sourceWidth, sourceHeight, 0, 0, sourceWidth, sourceHeight);
          var res = canvas.toDataURL((/data:(.*?);/g.exec(this.img64) || ['', 'image/jpeg'])[1]); // base64
          console.log(res)
          api.httpJsonMethod('POST', 'media/setavatar/', {
            'base64': encodeURIComponent(res)
          }).then(res => {
            let that = this
            setTimeout(() => {
              that.$root.AVATAR = res.url
            }, 200)
            this.$message.success('更换头像成功')
          }).catch((e) => {
            this.$message.error(e)
          })
        }
      },
      clickBox(e) {
        let that = this
        let baseY = that.cutTop - e.clientY
        let baseX = that.cutLeft - e.clientX
        document.onmousemove = (e) => {
          let tempY = baseY + e.clientY
          let tempX = baseX + e.clientX
          if (tempY < 0) that.cutTop = 0
          else if (240 * that.imgHRate - that.cutHeight < tempY)
            that.cutTop = 240 * that.imgHRate - that.cutHeight
          else that.cutTop = tempY

          if (tempX < 0) that.cutLeft = 0
          else if (240 * that.imgWRate - that.cutHeight < tempX)
            that.cutLeft = 240 * that.imgWRate - that.cutHeight
          else that.cutLeft = tempX
        }
        document.onmouseup = (e) => {
          document.onmousemove = null
          document.onmouseup = null
        }
      },
      dragBox(e, pos) {
        e.stopPropagation()
        if (pos == 1) {
          let that = this
          let baseX = e.clientX + that.cutWidth
          document.onmousemove = (e) => {
            let tempW = baseX - e.clientX
            let preWidth = that.cutWidth
            if (tempW < 8) {
              that.cutHeight = that.cutWidth = 8
            } else if (that.cutTop !== 0 && that.cutLeft < tempW - preWidth)
              that.cutHeight = that.cutWidth = preWidth + that.cutLeft
            else if (that.cutTop < tempW - that.cutHeight)
              that.cutHeight = that.cutWidth = that.cutHeight + that.cutTop
            else that.cutHeight = that.cutWidth = tempW

            that.cutLeft += preWidth - that.cutWidth
            that.cutTop += preWidth - that.cutWidth
          }
        } else if (pos == 4) {
          let that = this
          let baseX = e.clientX - that.cutWidth
          document.onmousemove = (e) => {
            let tempW = e.clientX - baseX
            if (tempW < 8) that.cutHeight = that.cutWidth = 8
            else if (Math.abs(that.cutWidth + that.cutTop - 240 * that.imgHRate) > 0.01 &&
              240 * that.imgWRate - that.cutLeft < tempW)
              that.cutHeight = that.cutWidth = 240 * that.imgWRate - that.cutLeft
            else if (240 * that.imgHRate - that.cutTop < tempW)
              that.cutHeight = that.cutWidth = 240 * that.imgHRate - that.cutTop
            else that.cutHeight = that.cutWidth = tempW
          }
        }
        document.onmouseup = (e) => {
          document.onmousemove = null
          document.onmouseup = null
        }
      }
    },
    computed: {
      shadowWH() {
        let str = ''
        str += 'height:' + this.cutHeight + 'px;'
        str += 'width:' + this.cutWidth + 'px;'
        str += 'top:' + this.cutTop + 'px;'
        str += 'left:' + this.cutLeft + 'px;'
        return str
      },
      viewpic() {
        let val = {
          'width': 0,
          'height': 0,
          'top': 0,
          'left': 0,
        }
        val.height = 240 / this.cutHeight * 190 * this.imgHRate
        val.width = 240 / this.cutWidth * 190 * this.imgWRate
        val.top = -val.height * this.cutTop / 240
        val.left = -val.width * this.cutLeft / 240
        let str = ''
        for (const i in val) {
          str += i + ':' + val[i] + 'px;'
        }
        return str
      },
      theWidthMove() {
        let val = {
          'width': 0,
          'height': 0,
          'top': 0,
          'left': 0,
        }
        val.left = (1 - this.imgWRate) * 120 + 7
        val.top = (1 - this.imgHRate) * 120 + 7
        val.width = 240 * this.imgWRate;
        val.height = 240 * this.imgHRate;
        let str = ''
        for (const i in val) {
          str += i + ':' + val[i] + 'px;'
        }
        return str
      }
    }
  }
</script>

<style scoped>
  .point-lt {
    top: -10px;
    left: -10px;
    cursor: nw-resize;
  }

  .point-lb {
    bottom: -10px;
    left: -10px;
    cursor: sw-resize;
  }

  .point-rt {
    top: -10px;
    right: -10px;
    cursor: ne-resize;
  }

  .point-rb {
    bottom: -10px;
    right: -10px;
    cursor: se-resize;
  }

  .drag-point {
    display: inline-block;
    width: 10px;
    height: 10px;
    background-color: #409eff;
    /* border: 1px solid rgb(0, 17, 255); */
    position: absolute;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
  }

  .anti-shadow-move {
    position: absolute;
    cursor: move;
  }

  .anti-shadow-img {
    position: absolute;
  }

  .anti-shadow-pic {
    position: absolute;
    overflow: hidden;
  }

  .anti-shadow {
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    position: absolute;
    z-index: 10;
    cursor: crosshair;
  }

  .shadow-pic {
    position: absolute;
    width: 240px;
    height: 240px;
    background-color: rgba(0, 0, 0, .5);
  }

  .view-img {
    position: absolute;
  }

  .view-pic {
    width: 190px;
    height: 190px;
    position: absolute;
    overflow: hidden;
  }

  .picView {
    display: inline-flex;
    width: 200px;
    height: 200px;
    border-radius: 5px;
    border: 2px solid #c4c4c4;
    text-align: center;
    justify-content: center;
    align-items: center;
  }

  .picBox {
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    display: inline-flex;
    width: 250px;
    height: 250px;
    border-radius: 5px;
    border: 2px solid #c4c4c4;
    text-align: center;
    justify-content: center;
    align-items: center;
    cursor: pointer;
  }

  .picBox:hover,
  .picView:hover {
    border: 2px solid #409eff;
  }
</style>