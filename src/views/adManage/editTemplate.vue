<template>
  <div class="c-page">
    <div class="crumb">
      <span>当前位置：</span>
      <router-link to="">广告位管理 > </router-link>
      <router-link to="/adManage/templateSearch">广告位模板查询 > </router-link>
      <router-link to="">编辑广告位模板</router-link>
    </div>
    <div class="form-wrap">
      <div class="tit">编辑广告位</div>
      <div class="form">
        <div class="input-wrap">
          <div class="label">投票ID</div>
          <div class="right-text">{{id}}</div>
        </div>
        <div class="input-wrap">
          <div class="label">广告位置</div>
          <div class="dropdown-input2 center-input">
            <el-dropdown trigger="click" @command="dropFN1">
            <span class="el-dropdown-link">
              {{StationEnumText}}<i class="el-icon-caret-bottom"></i>
            </span>
              <el-dropdown-menu class="dropdown-menu dropdown-menu3" slot="dropdown">
                <el-dropdown-item :command="item" v-for="(item, index) in StationEnum" :key="index">{{item.text}}</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </div>
        <div class="input-wrap">
          <div class="label">模板图片</div>
          <div class="right-upload">
            <img :src="imgUrl" alt="">
            <div class="btn-upload">
              <input @change="uploadImg(1)" ref="uploadFile1" type="file" id="uploadFile" class="uploadFile2" accept="image/*" multiple="multiple" />
              <!--            <img width="14" height="14" src="../assets/img/newFunction/upload.png">-->
              <div class="btn-fn btn-fn-t">选择图片</div>
            </div>
          </div>
        </div>
        <div class="input-wrap">
          <div class="label">无文字模板图片</div>
          <div class="right-upload center-input">
            <img :src="wordUrl" alt="">
            <div class="btn-upload">
              <input @change="uploadImg(2)" ref="uploadFile2" type="file" id="uploadFile2" class="uploadFile2" accept="image/*" multiple="multiple" />
              <!--            <img width="14" height="14" src="../assets/img/newFunction/upload.png">-->
              <div class="btn-fn btn-fn-t">选择图片</div>
            </div>
          </div>
        </div>
        <div class="input-wrap center-input">
          <div class="label">字体颜色编码</div>
          <input type="text" v-model.trim="fontColor">
        </div>
        <div class="input-wrap center-input">
          <div class="label">上边距</div>
          <input type="text" v-model.trim="margin">
        </div>
        <div class="input-wrap center-input">
          <div class="label">左边距</div>
          <input type="text" v-model.trim="leftMargin">
        </div>
        <div class="input-wrap">
          <div class="label">状态</div>
          <div class="dropdown-input2 center-input">
            <el-dropdown trigger="click" @command="dropFN2">
            <span class="el-dropdown-link">
              {{StatusEnumText}}<i class="el-icon-caret-bottom"></i>
            </span>
              <el-dropdown-menu class="dropdown-menu dropdown-menu3" slot="dropdown">
                <el-dropdown-item :command="item" v-for="(item, index) in StatusEnum" :key="index">{{item.text}}</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </div>
        <div class="btns">
          <div class="btn" @click="btnSave" :class="{'loading-btn': loadingShow}">
            <span>保存</span>
          </div>
          <div class="btn black" @click="$router.go(-1)">返回</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  /*eslint-disable*/
	import Dialog from '@/components/dialog/dialog'
	import {compress, dataURItoBlob} from '../deploy/js/upload'
	export default {
		data () {
			return{
				loadingShow: false,
				imgUrl: '',
				wordUrl: '',
				fontColor: '',
				margin: '',
				leftMargin: '',
				// statusArr: this.$store.state.tempArr,
				StatusEnumText: '',
				StationEnumText: '',
				StationEnumid: '',
				StationEnum: [],
				StatusEnum: [],
				StatusEnumid: '',
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
				typeArr: ['客户', '商户'],
				typeText: '客户',
				pageArr: ['工具', '我的'],
				pageText: '工具',
				locationText: '头部',
				locationArr: ['头部','中部'],
				langText: '',
				langArr: ['en','en'],
				funStatus: ['启用', '隐藏'],
				checkAllFlag: 0
			}
		},
		created () {
			this.getStatus()
		},
		methods: {
			getStatus () {
				this.$fetch.post('/public/enumValue?classPackage=AdvertiseTemplet$StationEnum;AdvertiseTemplet$StatusEnum;&flag=false&state=1').then(res => {
					this.StationEnum = res.data.data.StationEnum
					this.StatusEnum = res.data.data.StatusEnum
					this.getDetail()
				})
			},
			dropFN2 (obj) {
				this.StatusEnumText = obj.text
        this.StatusEnumid = obj.id
      },
			dropFN1 (obj) {
				this.StationEnumText = obj.text
				this.StationEnumid = obj.id
			},
			verifyErr () {
				if (this.fontColor === '') {
					this.$message.error('请输入字体颜色编码')
					return false
				}
        if (!/(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test(this.fontColor)) {
	        this.$message.error('字体颜色编码不正确')
	        return false
        }
				return  true
			},
			// 保存
			btnSave() {
				if (this.verifyErr()) {
					let formData = {
						imgUrl: this.imgUrl,
						wordUrl: this.wordUrl,
						id: this.id,
						station: this.StationEnumid,
						status: this.StatusEnumid,
						fontColor: this.fontColor
					}
					if (this.margin) formData.margin = this.margin
					if (this.leftMargin) formData.leftMargin = this.leftMargin
					this.$store.commit('SET_LOADING', true)
          this.loadingShow = true
					this.$fetch.post(`/advertise/advertiseTemplet/edit`,formData).then(res => {
						this.$store.commit('SET_LOADING', false)
						this.loadingShow = false
						Dialog({
							title: res.msg,
							okFn: () => {
								this.$router.push('/adManage/templateSearch')
							}
						})
					}).catch(err => {
						this.$store.commit('SET_LOADING', false)
						this.loadingShow = false
          })
				}
			},
			getDetail () {
				this.$fetch.post(`/advertise/advertiseTemplet/detail`, {
					id: this.id
        }).then(res => {
        	let ret = res.data.detail
					this.imgUrl = ret.imgUrl
          this.wordUrl = ret.wordUrl
          this.fontColor = ret.fontColor
          this.margin = ret.margin
          this.leftMargin = ret.leftMargin
					this.StationEnumid = ret.station
          this.StationEnumText = this.StationEnum[ret.station - 1].text
					this.StatusEnumid = ret.status
          this.StatusEnumText = this.StatusEnum[ret.status - 1].text
				})
			},
			uploadImg (type) {
				let imgVal
				if (type === 1) {
					imgVal = this.$refs.uploadFile1
				} else {
					imgVal = this.$refs.uploadFile2
				}
				let imgObj = imgVal.files[0]
				if (imgObj) {
					let isLt2M = imgObj.size / 1024 / 1024 <= 7
					let isType = /(jpg|png|JPG|PNG|jpeg)$/g.test(imgObj.type)
					if (!isType) {
						this.$message.error('格式不正确')
						imgVal.value = ''
						return
					} else if (!isLt2M) {
						this.$message.error('图片太大')
						return
					}
				} else {
					return
				}
				let reader = new FileReader()
				let self = this
				reader.readAsDataURL(imgObj)
				self.$store.commit('SET_LOADING', true)
				reader.onloadend = function () {
					let result = this.result
					let img = new Image()
					img.src = result
					img.onload = function () {
						let formData = new FormData()
						let data = compress(img)
						let blob = dataURItoBlob(data)
						let reader2 = new FileReader()
						reader2.readAsArrayBuffer(blob)
						reader2.onloadend = function () {
							formData.append('myfile', imgObj)
							formData.append('sourceType', 2)
							self.$fetch.postFormdata(`${self.$api}/upload/uploadImg`, formData).then(res => {
								self.$store.commit('SET_LOADING', false)
								if (type === 1) {
									self.imgUrl = res.data.data.fileUrl
								} else {
									self.wordUrl = res.data.data.fileUrl
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
