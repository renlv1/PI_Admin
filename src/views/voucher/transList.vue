<template>
  <div class="c-page">
    <div class="crumb">
      <span>当前位置：</span>
      <router-link to="">餐券交易 ></router-link>
      <router-link to="">查询餐券交易记录</router-link>
    </div>
    <div class="search">
      <div style="width: 92%; display: flex; align-items: center">
        <div class="search-box">
          <div class="label">买入用户：</div>
          <div class="input-wrap"><input v-model="buyUserName" type="text"></div>
        </div>
        <div class="search-box">
          <div class="label">卖出用户：</div>
          <div class="input-wrap"><input v-model="sellUserName" type="text"></div>
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
          <div class="btn black"  @click="resetFields">清空</div>
        </div>
      </div>
    </div>
    <list-wrap :list="list" :total="total" @change="getData">
      <div class="web-table">
        <table>
          <tr class="thead">
            <td style="width: 5%">ID</td>
            <td>买入用户</td>
            <td style="width: 16%">买入用户地址</td>
            <td>卖出用户</td>
            <td style="width: 16%">卖出用户地址</td>
            <td>买入订单id</td>
            <td>卖出订单id</td>
            <td>成交价格</td>
            <td>成交数量</td>
            <td>成交金额</td>
            <td>成交手续费</td>
            <td style="width: 13%">成交时间</td>
          </tr>
          <tr v-for="(item, index) in list" :key="index">
            <td>{{item.id}}</td>
            <td>{{item.buyName}}</td>
            <td>{{item.buyAddress}}</td>
            <td>{{item.sellName}}</td>
            <td>{{item.sellAddress}}</td>
            <td>{{item.buyTrustId}}</td>
            <td>{{item.sellTrustId}}</td>

            <td>{{item.tradePrice}}</td>
            <td>{{item.tradeAmount}}</td>
            <td>{{item.turnover}}</td>
            <td>{{item.tradeFee}}</td>
            <td>{{item.createAt | time}}</td>
          </tr>
          <div style="z-index: 9999" class="web-loading1" v-show="loadShow">
            <img src="~@img/loading.gif"/>
          </div>
        </table>
      </div>
    </list-wrap>
  </div>
</template>

<script>
export default {
  data() {
    return {
      buyUserName: '',
      sellUserName: '',
      startTime: '',
      endTime: '',
      list: [],
      total: 0,
      pageIndex: 1,
      loadShow: false
    }
  },
  methods: {

    resetFields() {
      this.buyUserName = ''
      this.sellUserName = ''
      this.startTime = ''
      this.endTime = ''
    },

    getData(pageIndex) {
      this.loadShow = true
      this.$fetch.post(`voucher/voucher/queryTradeList`, {
        buyName: this.buyUserName,
        sellName: this.sellUserName,
        stateCreateAt: this.startTime,
        endCreateAt: this.endTime,
        pageIndex: pageIndex || this.pageIndex,
        pageSize: 10,
      }).then((res) => {
        this.loadShow = false
        this.list = res.data.page.list
        this.total = res.data.page.totalCount
      })
    },
    search() {
      this.getData()
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
