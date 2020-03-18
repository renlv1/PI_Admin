<template>
  <div class="c-verify c-page">
    <div class="crumb">
      <span>当前位置：</span>
      <span>配置管理 > </span>
      <span>验证码管理</span>
    </div>
    <div class="search">
      <div class="search-box">
        <div class="label">手机号码或邮箱：</div>
        <div class="input-wrap"><input type="text" v-model="phoneNumber"></div>
      </div>
      <div class="search-box">
        <div class="label labelCom">IP地址：</div>
        <div class="input-wrap"><input type="text" v-model="address"></div>
      </div>

      <div class="search-box">
        <div class="label labelCom">IP地址：</div>
        <div class="input-wrap"><input type="text" v-model="address"></div>
      </div>

      <div class="search-box" style="margin-right: 40px">
        <div class="input-item">
          <div class="label">创建时间：</div>
          <div class="input-wrap">
            <el-date-picker
              v-model="startDate"
              :picker-options="pickerBeginDateBefore"
              format="yyyy-MM-dd"
              type="date">
            </el-date-picker>
          </div>
          <span class="margin">到</span>
          <div class="input-wrap">
            <el-date-picker
              :picker-options="pickerBeginDateAfter"
              format="yyyy-MM-dd"
              v-model="endDate"
              type="date">
            </el-date-picker>
          </div>
        </div>
      </div>
      <div class="btns">
        <div class="btn" @click="searchBtn()">查询</div>
        <div class="btn black" @click="clearBtn()">清空</div>
      </div>
    </div>
    <list-wrap :list="list" :total="total" @change="getData">
      <div class="web-table">
        <table>
          <tr class="thead">
            <td style="width: 7%">ID</td>
            <td>电话/邮箱</td>
            <td>验证码</td>
            <td >IP地址</td>
            <td>创建时间</td>
            <td>发送平台</td>
            <td style="width: 10%">备注</td>
          </tr>
          <tr v-for="(item,index) in list" :key="index" :loadShow="loadShow">
            <td>{{item.id}}</td>
            <td class="img-b">{{item.phoneNumber}}</td>
            <td>{{item.verifyCode}}</td>
            <td>{{item.ip}}</td>
            <td class="url">{{item.createAt | time}}</td>
            <td>{{item.sendPlatform ? item.sendPlatform : '-'}}</td>
            <td>{{item.backup1}}</td>
          </tr>
          <div style="z-index: 9999" class="web-loading1" v-show="loadShow">
            <img src="~@img/loading.gif" />
          </div>
        </table>
      </div>
    </list-wrap>
  </div>
</template>

<script>
  export default {
    data() {
      return{
        phoneNumber: '',
        address: '',
        startDate: '',
        endDate: '',
        list: [],
        total: -1,
        pageIndex: 1,
        loadShow: false,
        //        日期控件
        pickerBeginDateBefore: {
          disabledDate: (time) => {
            let beginDateVal = this.endDate
            if (beginDateVal) {
              return time.getTime() > beginDateVal
            }
          }
        },
        pickerBeginDateAfter: {
          disabledDate: (time) => {
            let beginDateVal = this.startDate
            if (beginDateVal) {
              return time.getTime() < beginDateVal
            }
          }
        },
      }
    },
    methods: {
      // 查询
      searchBtn() {
      this.getData(1)
      },
      // 清空
      clearBtn() {
        this.phoneNumber = ''
        this.address = ''
        this.startDate = ''
        this.endDate = ''
        this.getData(1)
      },
      getData(pageIndex,pageSize) {
        let formData = {}
        if (pageIndex) {
          formData.pageIndex = pageIndex
        } else {
          formData.pageIndex = this.pageIndex
        }
        if (pageSize) {
          formData.pageSize = pageSize
        } else {
          formData.pageSize = 10
        }
        if (this.phoneNumber) {
          formData.phoneNumber = this.phoneNumber
        }
        if (this.address) {
          formData.ip = this.address
        }
        if (this.startDate) {
          formData.startCreateAt = this.$changeDate(this.startDate, '-', 2)
        }
        if (this.endDate) {
          formData.endCreateAt = this.$changeDate(this.endDate, '-', 3)
        }
        this.loadShow = true
        this.$fetch.post(`/system/verifyCode/queryVerifyCodeList`,formData).then(res => {
           if (res.msg === '成功') {
             this.list = res.data.page.list
             this.total = res.data.page.totalCount
             this.loadShow = false
           } else {
             this.loadShow = false
           }
        })
      },
    }
  }
</script>

<style lang="less" scoped>
  .input-item{
    /*margin-left: 30px;*/
    /*margin: 30px 30px 0 0;*/
    float: left;
    display: flex;
    align-items: center;
    &.btn-ctrl-w{
      float: right;
    }
    .margin{
      margin: 0 10px;
    }
    .input-wrap{
      /deep/ .el-date-editor{
        width: 140px !important;
        input{
          width: 140px !important;
          height: 25px;
          border-radius: 4px;
        }
        .el-icon-date{

        }
        .el-input__icon{
          line-height: 27px;
        }
      }
      input{
        width: 140px;
        height: 24px;
        padding: 0 10px;
        font-size: 14px;
        color: #474747;
        border-radius: 4px;
      }
    }
    .dropdown-input{
      width: 140px;
      height: 25px;
      text-align: center;
      border: 1px solid #aaa;
      border-radius: 6px;
      cursor: pointer;
      .el-dropdown{
        width: 100%;
        /deep/ .el-dropdown-link{
          width: 100%;
          height: 25px;
          display: block;
        }
      }
    }
    .btn-ctrl{
      width: 80px;
      height: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 4px;
      background-color: #1571cc;
      color: #fff;
      font-size: 14px;
      cursor: pointer;
      &.btn-empty{
        background-color: #474747;
        margin: 0 10px;
      }
    }
  }
  .search-r{
    margin-right: 100px;
  }
</style>
<style lang="stylus" scoped>
  .search
    position relative
    display flex
    flex-direction row
    flex-wrap wrap
    input {
      width 130px
      height 25px
      margin-right 0
    }
    .search-box
      margin-right 20px
      display flex
      flex-direction row
      align-items center
      .dropdown-wrap
        cursor pointer
        text-align center
        line-height 25px
        min-width: 130px;
        margin-right: 20px;
        background-color #fff
        border: 1px solid #DCDFE6;
        border-radius: 6px;
        padding: 0 10px;
        font-size 15px
        height 25px
    .btns
      .btn
        line-height 25px
        height 25px
        width auto
        padding 0 20px
</style>
