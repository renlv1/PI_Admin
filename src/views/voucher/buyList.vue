<template>
  <div class="c-page">
    <div class="crumb">
      <span>当前位置：</span>
      <router-link to="">餐券交易 ></router-link>
      <router-link to="">查询购买条件列表</router-link>
    </div>
    <div class="search">
      <div class="search-box">
        <div class="label">用户名：</div>
        <div class="input-wrap"><input v-model="userName" type="text"></div>
      </div>
      <div class="btns">
        <div class="btn" @click="search">查询</div>
        <div class="btn black" @click="userName = ''">清空</div>
      </div>
    </div>
    <div class="web-table">
      <table>
        <tr class="thead">
          <td>最多持有张数</td>
          <td>已持有张数</td>
          <td>藏宝量</td>
          <td>用户可购买余额</td>
        </tr>
        <tr v-if="buyObj.maxNumber">
          <td>{{buyObj.maxNumber}}</td>
          <td>{{buyObj.voucherBalance}}</td>
          <td>{{buyObj.mineTotal}}</td>
          <td>{{buyObj.piBalance}}</td>
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
      buyObj: {},
      loadShow: false,
    }
  },
  methods: {
    getData() {
      this.loadShow = true
      this.$fetch.post(`voucher/voucher/queryEntrustBuyList`, {
        username: this.userName,
      }).then((res) => {
          this.loadShow = false
          this.buyObj.maxNumber = res.data.page.maxNumber
          this.buyObj.voucherBalance = res.data.page.voucherBalance
          this.buyObj.mineTotal = res.data.page.mineTotal
          this.buyObj.piBalance = res.data.page.piBalance
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

  .el-date-editor.el-input {
    width: 150px !important;
    height: 25px !important;
  }

  >>> .el-date-editor .el-input__inner {
    padding: 0 10px !important;
    width: 130px !important;
    height: 25px !important;
  }
</style>
