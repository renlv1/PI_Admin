<template>
  <div class="c-manage">
    <div class="crumb">
      <span>当前位置：</span>
      <span>配置管理 > </span>
      <span>功能配置管理 > </span>
      <span>压缩包管理</span>
    </div>
    <div class="mian-c">
      <h3 class="add-title">压缩包管理</h3>
      <ul class="com-ul">
        <li class="com-li">
          <span>版本号</span>
          <div class="input-box">
            <input type="text" v-model="version">
          </div>
        </li>
        <li class="com-li">
          <span>压缩包文件</span>
          <div class="input-box package-file">{{packageFile}}</div>
        </li>
        <li class="com-li">
          <span>压缩包名称</span>
          <div class="li-rig">
            <div class="logo-img" v-show="packageName">{{packageName}}</div>
            <div class="btn-upload">
              <input @change="uploadFiles()" ref="uploadFile" type="file" id="uploadFile" multiple="multiple" />
              <!--            <img width="14" height="14" src="../assets/img/newFunction/upload.png">-->
              <div class="btn-fn">上传压缩包文件</div>
            </div>
          </div>
        </li>
        <li class="com-li">
          <span></span>
          <ul class="ul-status ul-btn">
            <p class="err-tip">{{error1}}</p>
            <li  class="li-save" @click="btnSave">保存</li>
            <li  class="li-save li-back" @click="$router.push('/deploy/function')">返回</li>
          </ul>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
  import Dialog from '@/components/dialog/dialog'
  export default {
    data() {
      return{
        version: '',
        packageFile: '',
        error1: '',
        packageName: ''
      }
    },
    created() {
      this.getPackPage()
    },
    methods: {
      btnSave () {
        this.$store.commit('SET_LOADING', true)
        this.$fetch.post(`/system/function/addWebZipVersion`,{
          functionName: this.version,
          upfile:this.packageFile
        }).then(res => {
          if (res.msg === '成功') {
            this.$store.commit('SET_LOADING', false)
            Dialog({
              title: '保存成功',
              okFn: () => {
                this.$router.push('/deploy/function')
              }
            })
          }
        })
      },
      getPackPage () {
        this.$fetch.post(`system/function/preAddWebZipVersion/7`).then(res => {
          this.packageFile = res.data.resultData.functionUrl
          this.packageName = res.data.resultData.functionImage
          this.version = res.data.resultData.functionName
        })
      },
      uploadFiles () {
        this.error1 = ''
        let fileVal = this.$refs.uploadFile
        let fileObj = fileVal.files[0]
        // this.imgUrl = imgVal.files[0]
        let filesType = fileObj.name
        let fileend = filesType.substring(filesType.indexOf(".") + 1);
        if (fileObj) {
          // let isLt2M = imgObj.size / 1024 / 1024 <= 5
          let isType = /(zip)$/g.test(fileend)
          if (!isType) {
            this.error1 = '格式不正确'
            fileVal.value = ''
            return
          }
        } else {
          return
        }
        let reader = new FileReader()
        let self = this
        reader.readAsDataURL(fileObj)
        self.$store.commit('SET_LOADING', true)
        reader.onloadend = function () {
          let formData = new FormData()
          // let reader2 = new FileReader()
          formData.append('myfile', self.$refs.uploadFile.files[0])
          formData.append('sourceType', 2)
          self.$fetch.postFormdata(`${self.$api}/upload/uploadImg`, formData).then(res => {
            if (res.msg === '成功') {
              console.log(res.data.data.fileUrl)
              self.packageFile = res.data.data.fileUrl
              self.packageName = res.data.data.fileName
              Dialog({
                title: '上传成功'
              })
              self.$store.commit('SET_LOADING', false)
              // self.fileName = res.data.data.fileName
              // self.functionImage = res.data.data.fileUrl
            }
          })
          // reader2.onloadend = function () {
          //   console.log('324324')
          //   formData.append('myfile', self.$refs.uploadFile.files[0])
          //   formData.append('sourceType', 2)
          //   self.$fetch.postFormdata(`${self.$api}/upload/uploadImg`, formData).then(res => {
          //     if (res.msg === '成功') {
          //       self.$store.commit('SET_LOADING', false)
          //       // self.fileName = res.data.data.fileName
          //       // self.functionImage = res.data.data.fileUrl
          //     }
          //   })
          // }
        }
      },
    }
  }
</script>

<style lang="stylus" scoped>
  .btn-upload{
    overflow: hidden
    display: flex;
    align-items: center;
    justify-content: center;
    background-color #fff
    color #3376ff
    cursor pointer
    border-radius 4px
    width 100px
    /*border 1px solid #3376ff*/
    height 40px
    position relative
    text-align center
    line-height 40px
    #uploadFile {
      font-size 30px
      position: absolute;
      top: 0;
      left: 0;
      margin-left -135px
      /*width: 100%*/
      /*height: 100%*/
      display: block;
      cursor: pointer;
      opacity: 0;
    }
  }
  .ul-status{
    margin-left 20px
    display flex
    &.ul-btn{
      position relative
      margin 40px 0 80px 20px
    }
    .err-tip{
      position absolute
      top -40px
      color #ff2769
    }
    .li-status{
      display flex
      align-items center
      margin-right 40px
    }
    .li-save{
      cursor pointer
      width 100px
      height 30px
      background #1571cc
      border-radius 4px
      font-size 12px
      color #fff
      text-align center
      line-height 30px
    }
    .li-back{
      margin-left 20px
      background #474747
    }
  }
  .li-rig{
    margin-left 25px
    .logo-img{
      margin-top 30px
    }
  }
  .mian-c{
    height 700px
  }
  .package-file{
    width 400px
  }
</style>
