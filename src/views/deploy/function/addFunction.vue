<template>
  <div class="c-function">
    <div class="crumb">
      <span>当前位置：</span>
      <span>配置管理 > </span>
      <span>功能配置管理  > </span>
      <span v-if="addOredit === 1">新增功能</span>
      <span v-if="addOredit === 2">编辑功能</span>
    </div>
    <div class="mian-c">
      <h3 class="add-title">新建功能</h3>
      <ul class="com-ul">
        <li class="com-li" v-show="addOredit === 2">
          <span>ID</span>
          <div class="input-box">{{id}}</div>
        </li>
        <li class="com-li">
          <span>功能图片</span>
          <div class="logo-img" v-show="functionImage">
            <img :src="functionImage" alt="" class="logo-a">
          </div>
          <div class="btn-upload">
            <input @change="uploadImg()" ref="uploadFile" type="file" id="uploadFile" accept="image/*" multiple="multiple" />
<!--            <img width="14" height="14" src="../assets/img/newFunction/upload.png">-->
            <div class="btn-fn">选择图片</div>
          </div>
        </li>
        <li class="com-li">
          <span>功能名称</span>
          <div class="input-box">
            <input type="text" v-model="functionName">
          </div>
        </li>
        <li class="com-li">
          <span>功能访问url</span>
          <div class="input-box">
            <input type="text" v-model="functionUrl" maxlength="50">
          </div>
        </li>
        <li class="com-li">
          <span>功能类型</span>
          <div class="record-type" @click="changeState(1)">
            <div class="type-box" >
              <div class="fixed-type" >{{typeText}}</div>
              <div class="sel-img"><i class="arrowDown" :class="{'active-Img': activeChange}"></i></div>
              <ul class="selectMenu" :class="{'selectMenuActive': activeChange}" @click.stop>
                <li v-for="(item, index) in typeArr" :key="index" @click="chooseState(item.text,1,index)">{{item.text}}</li>
              </ul>
            </div>
          </div>
        </li>
        <li class="com-li">
          <span>所在页面</span>
          <div class="record-type" @click="changeState(2)">
            <div class="type-box" >
              <div class="fixed-type" >{{pageText}}</div>
              <div class="sel-img"><i class="arrowDown" :class="{'active-Img': activeChange2}"></i></div>
              <ul class="selectMenu" :class="{'selectMenuActive': activeChange2}" @click.stop>
                <li v-for="(item, index) in pageArr" :key="index" @click="chooseState(item,2,index)">{{item}}</li>
              </ul>
            </div>
          </div>
        </li>
        <li class="com-li">
          <span>页面位置</span>
          <div class="record-type" @click="changeState(3)">
            <div class="type-box" >
              <div class="fixed-type" >{{locationText}}</div>
              <div class="sel-img"><i class="arrowDown" :class="{'active-Img': activeChange3}"></i></div>
              <ul class="selectMenu" :class="{'selectMenuActive': activeChange3}" @click.stop>
                <li v-for="(item, index) in locationArr" :key="index" @click="chooseState(item,3,index)">{{item}}</li>
              </ul>
            </div>
          </div>
        </li>
        <li class="com-li">
          <span>语种</span>
          <div class="input-box">
            <input type="text" v-model="langText">
          </div>
<!--          <div class="record-type" @click="changeState(4)">-->
<!--            <div class="type-box" >-->
<!--              <div class="fixed-type" >{{langText}}</div>-->
<!--              <div class="sel-img"><i class="arrowDown" :class="{'active-Img': activeChange4}"></i></div>-->
<!--              <ul class="selectMenu" :class="{'selectMenuActive': activeChange4}" @click.stop>-->
<!--                <li v-for="(item, index) in langArr" :key="index" @click="chooseState(item,4)">{{item}}</li>-->
<!--              </ul>-->
<!--            </div>-->
<!--          </div>-->
        </li>
        <li class="com-li">
          <span>功能状态</span>
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
            <li  class="li-save li-back" @click="$router.push('/deploy/function')">返回</li>
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
    data () {
      return{
        id: this.$route.query.id,
        addOredit : parseInt(this.$route.query.flag),
        functionImage: '', // 功能图片
        functionName: '', // 功能名称
        functionUrl: '', // 功能访问url
        functionType: 1, // 功能类型
        location: '', // 所在页面
        pageLocation: '', // 页面位置
        langType: '', // 语种
        status: 1, // 1正常 2隐藏
        activeChange: false,
        activeChange2: false,
        activeChange3: false,
        activeChange4: false,
        error1: '',
        typeArr: [],
        typeText: '客户',
        pageArr: ['工具', '我的'],
        pageText: '工具',
        locationText: '头部',
        locationArr: ['头部','中部'],
        langText: '',
        langArr: ['en','en'],
        funStatus: ['启用', '隐藏'],
        checkAllFlag: 0,
        imgUrl: '',
        fileName: ''
      }
    },
    created () {
      this.getType()
      if(this.addOredit === 2) {
        this.getDetail()
      }
    },
    methods: {
      getType() {
        this.$fetch.get(`/public/enumValue?classPackage=FunctionAllocation$FunctionAllocationStatusEnum;FunctionAllocation$FunctionAllocationTypeEnum&flag=false&state=1`).then(res => {
          if (res.msg === '成功') {
            // this.recordArr = res.data.data.FunctionAllocationStatusEnum
            this.typeArr = res.data.data.FunctionAllocationTypeEnum
          }
        })
      },
      verifyErr () {
        if (this.functionImage === '' || !this.functionImage) {
          this.error1 = '功能图片不能为空'
          return false
        }
        if (this.functionName === '') {
          this.error1 = '功能名称不能为空'
          return false
        }
        if (this.functionUrl === '') {
          this.error1 = '功能访问url不能为空'
          return false
        }
        return  true
    },
      // 保存
      btnSave() {
        if (this.verifyErr()) {
          if (this.typeText === '客户') {
            this.functionType = 1
          } else if (this.typeText === '商户') {
            this.functionType = 2
          }
          if (this.pageText === '工具') {
            this.location = 1
          } else if (this.pageText === '我的') {
            this.location = 2
          }
          if (this.locationText === '头部') {
            this.pageLocation = 1
          } else if (this.locationText === '中部') {
            this.pageLocation = 2
          }
          let formData = {
            functionName: this.functionName,
            functionUrl: this.functionUrl,
            status: this.status,
            functionType: this.functionType,
            location: this.location,
            pageLocation: this.pageLocation,
            languages: this.langText,
            functionImage: this.fileName
          }
          if (this.addOredit === 2) {
            formData.id = this.$route.query.id
          }
          this.$store.commit('SET_LOADING', true)
          this.$fetch.post(`/system/function/save`,formData).then(res => {
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
        }
      },
      getDetail () {
        this.$fetch.post(`/system/function/info/${this.$route.query.id}`).then(res => {
          if (res.msg === '成功') {
            let resultData = res.data.resultData
            this.functionImage = resultData.functionImage
            this.functionName = resultData.functionName
            this.functionType = resultData.functionType ? resultData.functionType : 1
            if (Number(this.functionType) === 1) {
              this.typeText =  '客户'
            } else if (Number(this.functionType) === 2) {
              this.typeText = '商户'
            }
            this.functionUrl = resultData.functionUrl
            this.langText = resultData.languages
            this.location = resultData.location ? resultData.location : 1
            if (Number(this.location) === 1) {
              this.pageText =  '工具'
            } else if (Number(this.location) === 2) {
              this.pageText = '我的'
            }
            this.pageLocation = resultData.pageLocation ? resultData.pageLocation : 1
            if (Number(this.pageLocation) === 1) {
              this.locationText =  '头部'
            } else if (Number(this.pageLocation) === 2) {
              this.locationText = '中部'
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
      checkStatus(index) {
        this.checkAllFlag = index
        this.status = index + 1
      },
      changeState (i) {
        if (i === 1) {
          this.activeChange = !this.activeChange
          this.activeChange2 = false
          this.activeChange3 = false
          this.activeChange4 = false
        } else if (i === 2) {
          this.activeChange2 = !this.activeChange2
          this.activeChange = false
          this.activeChange3 = false
          this.activeChange4 = false
        }  else if (i === 3) {
          this.activeChange3 = !this.activeChange3
          this.activeChange2 = false
          this.activeChange = false
          this.activeChange4 = false
          
        }
      },
      chooseState (item,num) {
        if(num === 1) {
          this.activeChange = false
          this.typeText = item
        } else if (num === 2) {
          this.activeChange2 = false
          this.pageText = item
        } else if (num === 3) {
          this.activeChange3 = false
          this.locationText = item
        }
      },
      uploadImg () {
        let imgVal = this.$refs.uploadFile
        let imgObj = imgVal.files[0]
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
              // console.log(blob)
              // console.log( self.$refs.uploadFile.files[0])
            formData.append('myfile',blob)
            formData.append('sourceType', 2)
            self.$fetch.postFormdata(`${self.$api}/upload/uploadImg`, formData).then(res => {
              if (res.msg === '成功') {
                self.$store.commit('SET_LOADING', false)
                self.fileName = res.data.data.fileName
                self.functionImage = res.data.data.fileUrl
              }
            })
            }
          }
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
</style>
