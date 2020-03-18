<template>
  <div class="c-add">
    <div class="crumb">
      <span>当前位置：</span>
      <span>配置管理 > </span>
      <span>UI配置管理  > </span>
      <span>新建UI配置</span>
    </div>
    <div class="mian-c">
      <h3 class="add-title" v-show="addOredit === 1">新建UI配置</h3>
      <h3 class="add-title" v-show="addOredit === 2 || $store.state.addOreditFlag === 2">UI配置详情</h3>
      <ul class="com-ul">
        <li class="com-li" v-show="addOredit === 2 || $store.state.addOreditFlag === 2">
          <span>ID</span>
          <div class="input-box">{{id}}</div>
        </li>
        <li class="com-li">
          <span>图片</span>
          <div class="logo-img" v-show="uiImage">
            <img :src="uiImage" alt="" class="logo-a">
          </div>
          <div class="btn-upload">
            <input @change="uploadImg()" ref="uploadFile" type="file" id="uploadFile" accept="image/*" multiple="multiple" />
            <!--            <img width="14" height="14" src="../assets/img/newFunction/upload.png">-->
            <div class="btn-fn">选择图片</div>
          </div>
        </li>
        <li class="com-li">
          <span>图片code</span>
          <div class="input-box">
            <input type="text" v-model="imgCode">
          </div>
        </li>
        <li class="com-li">
          <span>父级code</span>
          <div class="input-box">
            <input type="text" v-model="parentCode">
          </div>
        </li>
        <li class="com-li">
          <span>UI所属</span>
          <div class="input-wrap dropdown-input">
            <el-dropdown trigger="click" @command="dropFN1">
            <span class="el-dropdown-link">
              {{uiBelongsText}}<i class="el-icon-caret-bottom"></i>
            </span>
              <el-dropdown-menu class="dropdown-menu" slot="dropdown">
                <el-dropdown-item :command="item" v-for="(item, index) in typeArr" :key="index">{{item}}
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </li>
        <li class="com-li">
          <span>字体颜色编码</span>
          <div class="input-box">
            <input type="text" v-model="wordColor">
          </div>
        </li>
        <li class="com-li">
          <span>图片位置说明文字</span>
          <div class="input-box">
            <input type="text" v-model="locationRemark">
          </div>
        </li>
        <li class="com-li">
          <span>是否启用</span>
          <ul class="ul-status">
            <li v-for="(item, index) in funStatus" :key="index" class="li-status">
              <div class="checkone-check" :class="{'isChecked': checkAllFlag === index}" @click="checkStatus(index)"></div>
              <div>{{item}}</div>
            </li>
          </ul>
        </li>
        <li class="com-li">
          <span></span>
          <ul class="ul-status ul-btn">
            <p class="err-tip">{{error1}}</p>
            <li  class="li-save" @click="btnSave">保存</li>
            <li  class="li-save li-back" @click="$router.push('/deploy/uiGanage')">返回</li>
          </ul>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
  import Dialog from '@/components/dialog/dialog'
  import {compress, dataURItoBlob} from '../js/upload'
  export default {
    data() {
      return{
        addOredit: this.$route.query.flag,
        id: this.$route.query.id,
        imgCode: '',
        parentCode: '',
        wordColor: '',
        locationRemark: '',
        uiImage: '',
        uiBelongsText: '客户端',
        typeArr: ['客户端', '商户端'],
        clientType: 1,
        funStatus: ['启用', '停用'],
        checkAllFlag: 0,
        status: 1, // 1.启用 2.不启用
        error1: '',
        fileName: ''
      }
    },
    created () {
      if(this.addOredit === 2 || this.$store.state.addOreditFlag === 2) {
        this.getDetail()
      }
    },
    methods: {
      dropFN1 (obj) {
        this.uiBelongsText = obj
      },
      getDetail () {
        this.$fetch.post(`/system/uidynamic/info/${this.id}`).then(res => {
           if (res.msg === '成功') {
             let resultData = res.data.resultData
             this.uiImage = resultData.imgUrl
             this.imgCode = resultData.imgCode ? resultData.imgCode : ''
             this.parentCode = resultData.parentCode ? resultData.parentCode : ''
             this.wordColor = resultData.wordColor ? resultData.wordColor : ''
             this.locationRemark = resultData.locationRemark ? resultData.locationRemark : ''
             this.clientType = resultData.clientType
             if (Number(this.clientType) === 1) {
               this.uiBelongsText =  '客户端'
             } else if (Number(this.clientType) === 2) {
               this.uiBelongsText = '商户端'
             }
             this.status = resultData.status
             if (Number(this.status) === 1) {
               this.checkAllFlag =  0
             } else if (Number(this.status) === 2) {
               this.checkAllFlag = 1
             }
           }
        })
      },
      // verifyErr () {
      // },
      // 保存
      btnSave () {
        if (this.uiImage === '') {
          this.error1 = '请选择图片'
          return
        }
        let formData = {}
        if (this.id) {
          formData.id = this.id
        }
        if (this.fileName) {
          formData.imgUrl = this.fileName
        }
        if (this.imgCode) {
          formData.imgCode = this.imgCode
        }
        if (this.parentCode) {
          formData.parentCode = this.parentCode
        }
        if (this.wordColor) {
          formData.wordColor = this.wordColor
        }
        if (this.locationRemark) {
          formData.locationRemark = this.locationRemark
        }
        formData.status = this.status
        if (this.uiBelongsText ===  '客户端') {
          this.clientType = 1
        } else if (this.uiBelongsText === '商户端') {
          this.clientType = 2
        }
        formData.clientType = this.clientType
        this.$fetch.post(`/system/uidynamic/save`,formData).then(res => {
           if (res.msg === '成功') {
             Dialog({
               title: '保存成功',
               okFn: () => {
                 this.$router.push('/deploy/uiGanage')
               }
             })
           } else {
             Dialog({
               title: res.msg
             })
           }
        })
      },
      uploadImg () {
        let imgVal = this.$refs.uploadFile
        let imgObj = imgVal.files[0]
        // this.imgUrl = imgVal.files[0]
        // console.log(imgObj)
        if (imgObj) {
          let isLt2M = imgObj.size / 1024 / 1024 <= 5
          let isType = /(jpg|png|JPG|PNG|jpeg)$/g.test(imgObj.type)
          if (!isType) {
            this.error1 = '格式不正确'
            imgVal.value = ''
            return
          } else if (!isLt2M) {
            this.error1 = '图片太大'
            return
          }
        } else {
          return
        }
        let reader = new FileReader()
        let self = this
        reader.readAsDataURL(imgObj)
        // self.logoLoading = true
        self.$store.commit('SET_LOADING', true)
        reader.onloadend = function () {
          let result = this.result
          let img = new Image()
          img.src = result
          img.onload = function () {
            let formData = new FormData()
            let data = compress(img)
            self.imgUrl = result
            let blob = dataURItoBlob(data)
            let reader2 = new FileReader()
            reader2.readAsArrayBuffer(blob)
            reader2.onloadend = function () {
              // let f = new File([this.result], imgObj.name)
              // let fileImg
              // if (f) {
              //   fileImg = new File([this.result], imgObj.name)
              // } else {
              //   fileImg = self.$refs.uploadFile.files[0]
              // }
              formData.append('myfile', self.$refs.uploadFile.files[0])
              formData.append('sourceType', 2)
              self.$fetch.postFormdata(`${self.$api}/upload/uploadImg`, formData).then(res => {
                if (res.msg === '成功') {
                  self.$store.commit('SET_LOADING', false)
                  self.fileName = res.data.data.fileName
                  self.uiImage = res.data.data.fileUrl
                }
              })
            }
          }
        }
      },
  
      checkStatus(index) {
        this.checkAllFlag = index
        this.status = index + 1
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
  .logo-img{
    margin-left 25px
    width 46px
    margin-right 20px
    img {
      max-width 46px
    }
  }
  .record-type{
    margin-left 25px
    width: 240px;
    height: 30px;
    border-radius: 4px;
    border: 1px solid #474747;
    padding: 0 10px;
    color: #474747;
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
  .checkone-check{
    width: 20px;
    height: 20px;
    background-color: #fff;
    border: 1px solid #dcdfe6;
    border-radius 50%
    cursor: pointer;
    position: relative;
    &::before{
      -webkit-box-sizing: content-box;
      box-sizing: content-box;
      content: "";
      border: 1px solid #fff;
      border-left: 0;
      border-top: 0;
      height: 7px;
      left: 7px;
      position: absolute;
      top: 4px;
      transform: rotate(45deg) scaleY(0);
      width: 3px;
      -webkit-transition: -webkit-transform .15s ease-in .05s;
      transition: -webkit-transform .15s ease-in .05s;
      transition: transform .15s ease-in .05s, -webkit-transform .15s ease-in .05s;
      -webkit-transform-origin: center;
      transform-origin: center;
    }
    &.isChecked{
      background-color: #43DE03;
      border-color: none;
      &::before{
        transform: rotate(45deg) scaleY(1);
      }
    }
    &.no-CheckBox{
      background-color: #edf2fc;
      cursor: not-allowed;
    }
  }
  .dropdown-input{
    margin-left 25px
    width: 240px;
    height: 30px;
    text-align: center;
    border: 1px solid #474747;
    border-radius: 6px;
    cursor: pointer;
    .el-dropdown{
      width: 100%;
      /deep/ .el-dropdown-link{
        width: 100%;
        height: 30px;
        line-height: 30px;
        display: block;
      }
    }
  }
</style>
