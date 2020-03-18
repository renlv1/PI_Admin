<template>
  <div class="c-page">
    <div class="crumb">
      <span>当前位置：</span>
      <router-link to="">基金管理 ></router-link>
      <router-link to="">基金统计查询</router-link>
    </div>
    <div class="search">
      <div class="search-box">
        <div class="label">用户名：</div>
        <div class="input-wrap"><input v-model="userName" type="text"></div>
      </div>
      <div class="search-box">
        <div class="label">创建时间：</div>
        <el-date-picker
          prefix-icon="none"
          clear-icon="none"
          v-model="startTime"
          type="datetime"
          value-format="yyyy-MM-dd HH:mm:ss"
        >
        </el-date-picker>

        <span style="margin-right: 20px">到</span>

        <el-date-picker
          prefix-icon="none"
          clear-icon="none"
          v-model="endTime"
          type="datetime"
          value-format="yyyy-MM-dd HH:mm:ss"
        >
        </el-date-picker>
      </div>
      <div class="btns">
        <div class="btn" @click="search">查询</div>
        <div class="btn black" @click="resetFields">清空</div>
      </div>
    </div>
    <div class="web-table">
      <table>
        <tr class="thead">
          <td>总买基金π</td>
          <td>总买基金股数</td>
          <td>总卖基金π</td>
          <td>总卖基金股数</td>
          <td>赠送总π</td>
          <td>赠送总股数</td>
        </tr>
        <tr v-if="sumsObj.buyPi">
          <td>{{sumsObj.buyPi}}</td>
          <td>{{sumsObj.buyAmount}}</td>
          <td>{{sumsObj.sellPi}}</td>
          <td>{{sumsObj.sellAmount}}</td>
          <td>{{sumsObj.presentPi}}</td>
          <td>{{sumsObj.presentAmount}}</td>
        </tr>
        <div style="z-index: 9999" class="web-loading1" v-show="loadShow">
          <img src="~@img/loading.gif" />
        </div>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      userName: '',
      startTime: '',
      endTime: '',

      sumsObj: {},
      loadShow: false,
    }
  },
  methods: {

    resetFields() {
      this.userName = ''
      this.startTime = ''
      this.endTime = ''
    },

    getData() {
      this.loadShow = true
      this.$fetch.post(`fund/grouptotal/queryCount`, {
        userName: this.userName,
        queryStartDate: this.startTime,
        queryEndDate: this.endTime
      }).then((res) => {
          this.loadShow = false
          this.sumsObj.buyPi = res.data.buyPi
          this.sumsObj.buyAmount = res.data.buyAmount
          this.sumsObj.sellPi = res.data.sellPi
          this.sumsObj.sellAmount = res.data.sellAmount
          this.sumsObj.presentPi = res.data.presentPi
          this.sumsObj.presentAmount = res.data.presentAmount
        }
      )
    },
    search() {
      if (this.userName) {
        this.getData()
      } else {
        this.$message.error('输入需要查询的用户名')
      }
    },
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  .search
    position relative
    display flex
    flex-direction row
    flex-wrap wrap
    input {
      width 130px
      height 25px
    }
    .search-box
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
        cursor pointer
</style>

<style scoped>

  .el-date-editor.el-input  {
    width: 180px !important;
    height: 25px !important;
  }
  >>>.el-date-editor.el-input input {
    padding: 0 10px;
    width: 160px;
    height: 25px;
  }
</style>
