<template>
  <div class="c-page">
    <div class="crumb">
      <span>当前位置：</span>
      <router-link to="">基金管理 > </router-link>
      <router-link to="">基金交易列表</router-link>
    </div>
    <div class="search">
      <div class="search-box">
        <div class="label">买入用户：</div>
        <div class="input-wrap"><input v-model="buyUserName" type="text"></div>
      </div>
      <div class="search-box">
        <div class="label">卖出用户：</div>
        <div class="input-wrap"><input v-model="sellUserName" type="text"></div>
      </div>
      <div class="search-box">
        <div class="label">买入累计标识：</div>
        <div class="input-wrap dropdown-wrap">
          <el-dropdown @command="handleBuyCommand">
            <span class="el-dropdown-link">
              {{changeBuyText || '全部'}}<i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu class="menu" slot="dropdown">
              <el-dropdown-item :command="item" v-for="(item, index) in ChangeTypeEnumList" :key="index">{{item.text}}
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>
      <div class="search-box">
        <div class="label">卖出累计标识：</div>
        <div class="input-wrap dropdown-wrap">
          <el-dropdown @command="handleSellCommand">
            <span class="el-dropdown-link">
              {{changeSellText || '全部'}}<i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu class="menu" slot="dropdown">
              <el-dropdown-item :command="item" v-for="(item, index) in ChangeTypeEnumList" :key="index">{{item.text}}
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>
      <div style="margin-right: 180px" class="btns">
        <div class="btn" @click="search">查询</div>
        <div class="btn black" @click="resetFields">清空</div>
      </div>
    </div>
    <list-wrap :list="list" :total="total" @change="getData">
      <div class="web-table">
        <table>
          <tr class="thead">
            <td style="width: 7%">ID</td>
            <td>买入方</td>
            <td>卖出方</td>
            <td>买入委托单id</td>
            <td>卖出委托单id</td>
            <td>成交价格</td>
            <td>成交数量</td>
            <td>成交金额</td>
            <td>成交手续费</td>
            <td>买累计标识</td>
            <td>卖累计标识</td>
            <td style="width: 10%">成交时间</td>
          </tr>
          <tr v-for="(item, index) in list" :key="index">
            <td>{{item.id}}</td>
            <td>{{item.buyUserName}}</td>
            <td>{{item.sellUserName}}</td>
            <td>{{item.buyTrustId}}</td>
            <td>{{item.sellTrustId}}</td>
            <td>{{item.tradePrice}}</td>
            <td>{{item.tradeAmount}}</td>
            <td>{{item.turnover}}</td>
            <td>{{item.tradeFee}}</td>
            <td>{{matchType(ChangeTypeEnumList, item.buyLeiFlag)}}</td>
            <td>{{matchType(ChangeTypeEnumList, item.sellLeiFlag)}}</td>
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
      changeBuyText: '',
      changeBuyType: '',
      ChangeTypeEnumList: [],
      changeSellText: '',
      changeSellType: '',
      list: [],
      total: 0,
      pageIndex: 1,
      loadShow: false
    }
  },
  mounted() {
    this.getDropDownList()
  },
  methods: {

    resetFields() {
      this.buyUserName = ''
      this.sellUserName = ''
      this.changeBuyText = '全部'
      this.changeBuyType = -1
      this.changeSellText = '全部'
      this.changeSellType = -1
    },

    handleBuyCommand(command) {
      this.changeBuyText = command.text
      this.changeBuyType = command.id
    },
    handleSellCommand(command) {
      this.changeSellText = command.text
      this.changeSellType = command.id
    },
    getDropDownList() {
      this.$fetch.post(`/public/enumValue`, {
        classPackage: 'FundTrade$LeiFlagEnum',
        flag: true,
        state: 1
      }).then((res) => {
        this.ChangeTypeEnumList = res.data.data.LeiFlagEnum
      })
    },
    getData(pageIndex) {
      this.loadShow = true
      let buyLeiFlag = parseInt(this.changeBuyType, 10) >= 0 ? parseInt(this.changeBuyType, 10) : ''
      let sellLeiFlag = parseInt(this.changeSellType, 10) >= 0 ? parseInt(this.changeSellType, 10) : ''
      this.$fetch.post(`fund/fundtrade/queryFundTradeList`, {
        buyUserName : this.buyUserName,
        sellUserName: this.sellUserName,
        buyLeiFlag: buyLeiFlag,
        sellLeiFlag: sellLeiFlag,
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
    }
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

  >>>.el-date-editor .el-input__inner {
    padding: 0 10px !important;
    width: 130px !important;
    height: 25px !important;
  }
</style>
