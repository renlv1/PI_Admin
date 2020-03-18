<template>
  <div class="c-page">
    <div class="crumb">
      <span>当前位置：</span>
      <router-link to="">基金管理 ></router-link>
      <router-link to="">基金购买信用度</router-link>
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
          <td>藏宝余额</td>
          <td>挖宝合成</td>
          <td>当前价格</td>
          <td>图总价值数</td>
          <td>股数</td>
        </tr>
        <tr v-if="creditObj.buriedTreasure">
          <td>{{creditObj.buriedTreasure}}</td>
          <td>{{creditObj.indianArrowheads || 0}}</td>
          <td>{{creditObj.currentPrice}}</td>
          <td>{{creditObj.mineTotal}}</td>
          <td>{{creditObj.numberShares}}</td>
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
      creditObj: {},
      loadShow: false,
    }
  },
  methods: {
    getData() {
      this.loadShow = true
      this.$fetch.post(`fund/grouptotal/fundsBuyCredit`, {
        userName: this.userName,
      }).then((res) => {
          this.loadShow = false
          this.creditObj.indianArrowheads = res.data.indianArrowheads
          this.creditObj.numberShares = res.data.numberShares
          this.creditObj.mineTotal = res.data.mineTotal
          this.creditObj.currentPrice = res.data.currentPrice
          this.creditObj.buriedTreasure = res.data.buriedTreasure
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
