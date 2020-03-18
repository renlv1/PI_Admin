<template>
  <div class="c-page">
    <div class="crumb">
      <span>当前位置：</span>
      <router-link to="">基金管理 ></router-link>
      <router-link to="">基金派别累计查询</router-link>
    </div>
    <div class="search">
      <div class="search-box">
        <div class="label">用户名：</div>
        <div class="input-wrap"><input v-model="userName" type="text"></div>
      </div>
      <div class="search-box">
        <div class="label">上级用户：</div>
        <div class="input-wrap"><input v-model="supUserName" type="text"></div>
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
      <div class="f1"></div>
      <div style="margin-right: 180px" class="btns">
        <div class="btn" @click="search">查询</div>
        <div class="btn black" @click="resetFields">清空</div>
      </div>
    </div>
    <list-wrap :list="list" :total="total" @change="getData">
      <div class="web-table">
        <table>
          <tr class="thead">
            <td style="width: 5%">ID</td>
            <td>用户名</td>
            <td>买入总额</td>
            <td>卖出总金额</td>
            <td>最后卖出价格</td>
            <td>派别买入总金额/卖出总金额</td>
            <td>派别持有总量</td>
            <td>总买π/总卖π</td>
            <td>派别总买π/总卖π</td>
            <td>派别持有π总量</td>
            <td>已赠送股数</td>
            <td>最后赠送时间</td>
            <td>创建时间</td>
          </tr>
          <tr v-for="(item, index) in list" :key="index">
            <td>{{item.id}}</td>
            <td>{{item.userName}}</td>
            <td>{{item.buyTotal}}</td>
            <td>{{item.sellTotal}}</td>
            <td>{{item.lastSellPrice}}</td>
            <td>{{item.groupBuyTotal || 0}}/{{item.groupSellTotal || 0}}</td>
            <td>{{item.groupHoldFund}}</td>

            <td>{{item.buyPiTotal}}/{{item.sellPiTotal}}</td>
            <td>{{item.groupBuyPiTotal}}/{{item.groupSellPiTotal}}</td>
            <td>{{item.groupHoldPiTotal}}</td>
            <td>{{item.presentTotal}}</td>
            <td>{{item.presentAt | time}}</td>
            <td>{{item.createAt | time}}</td>
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
    return {
      userName: '',
      supUserName: '',
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
      this.userName = ''
      this.supUserName = ''
      this.startTime = ''
      this.endTime = ''
    },

    getData(pageIndex) {
      this.loadShow = true
      this.$fetch.post(`fund/grouptotal/queryGroupTotalList`, {
        userName: this.userName,
        refUserName: this.supUserName,
        queryStartDate: this.startTime,
        queryEndDate: this.endTime,
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
