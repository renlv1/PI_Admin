<template>
  <div class="c-page">
    <div class="crumb">
      <span>当前位置：</span>
      <router-link to="">基金管理 ></router-link>
      <router-link to="">基金累计明细查询</router-link>
    </div>
    <div class="search">
      <div class="search-box">
        <div class="label">累计用户：</div>
        <div class="input-wrap"><input v-model="sumUsers" type="text"></div>
      </div>
      <div class="search-box">
        <div class="label">下级用户：</div>
        <div class="input-wrap"><input v-model="subUser" type="text"></div>
      </div>
      <div class="search-box">
        <div class="label">原始来源用户：</div>
        <div class="input-wrap"><input v-model="sourceUser" type="text"></div>
      </div>
      <div class="search-box">
        <div class="label">累计类型：</div>
        <div class="input-wrap dropdown-wrap">
          <el-dropdown @command="handleCommand">
            <span class="el-dropdown-link">
              {{TotalTypeText || '全部'}}<i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu class="menu" slot="dropdown">
              <el-dropdown-item :command="item" v-for="(item, index) in TotalTypeEnumList" :key="index">{{item.text}}
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>
      <div class="search-box">
        <div class="label">交易类型：</div>
        <div class="input-wrap dropdown-wrap">
          <el-dropdown @command="handleCommand">
            <span class="el-dropdown-link">
              {{TradeTypeText || '全部'}}<i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu class="menu" slot="dropdown">
              <el-dropdown-item :command="item" v-for="(item, index) in TradeTypeEnumList" :key="index">{{item.text}}
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>
      <div class="search-box">
        <div class="label">大小边：</div>
        <div class="input-wrap dropdown-wrap">
          <el-dropdown @command="handleCommand">
            <span class="el-dropdown-link">
              {{BigOrSmallText || '全部'}}<i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu class="menu" slot="dropdown">
              <el-dropdown-item :command="item" v-for="(item, index) in BigOrSmallEnumList" :key="index">{{item.text}}
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>
      <div class="btns">
        <div class="btn" @click="search">查询</div>
        <div class="btn black" @click="resetFields">清空</div>
      </div>
    </div>
    <list-wrap :list="list" :total="total" @change="getData">
      <div class="web-table">
        <table>
          <tr class="thead">
            <td style="width: 7%">ID</td>
            <td>累计用户</td>
            <td>下级用户</td>
            <td>原始来源用户</td>
            <td>交易记录id</td>
            <td>累计值</td>
            <td>实际累计值</td>
            <td>派别累计原始值</td>
            <td>累计类型</td>
            <td>交易类型</td>
            <td>大小边</td>
            <td style="width: 12%">创建时间</td>
          </tr>
          <tr v-for="(item, index) in list" :key="index">
            <td>{{item.id}}</td>
            <td>{{item.userName}}</td>
            <td>{{item.childUserName}}</td>
            <td>{{item.tradeUserName}}</td>
            <td>{{item.tradeId}}</td>
            <td>{{item.totalAmount}}</td>
            <td>{{item.realTotalAmount}}</td>
            <td>{{item.oldRefTotal}}</td>
            <td>{{matchType(TotalTypeEnumList, item.totalType)}}</td>
            <td>{{matchType(TradeTypeEnumList, item.tradeType)}}</td>
            <td>{{matchType(BigOrSmallEnumList, item.bigOrSmall)}}</td>
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
      sumUsers: '',
      subUser: '',
      sourceUser: '',
      list: [],
      total: 0,
      pageIndex: 1,
      loadShow: false,

      // 累计类型
      TotalTypeText: '',
      TotalType: '',
      TotalTypeEnumList: [],

      // 交易类型
      TradeTypeText: '',
      TradeType: '',
      TradeTypeEnumList: [],

      // 大小边
      BigOrSmallText: '',
      BigOrSmallType: '',
      BigOrSmallEnumList: [],
    }
  },
  created() {
    this.getDropDownList()
  },
  methods: {

    resetFields() {
      this.sumUsers = ''
      this.subUser = ''
      this.sourceUser = ''
      this.TotalTypeText = '全部'
      this.TotalType = -1
      this.TradeTypeText = '全部'
      this.TradeType = -1
      this.BigOrSmallText = '全部'
      this.BigOrSmallType = -1
    },

    handleCommand(command) {
      if (command.type === 0) {
        this.TotalTypeText = command.text
        this.TotalType = command.id
      } else if (command.type === 1) {
        this.TradeTypeText = command.text
        this.TradeType = command.id
      } else if (command.type === 2) {
        this.BigOrSmallText = command.text
        this.BigOrSmallType = command.id
      }
    },

    getData(pageIndex) {
      this.loadShow = true
      let totalType = parseInt(this.TotalType, 10) >= 0 ? parseInt(this.TotalType, 10) : ''
      let tradeType = parseInt(this.TradeType, 10) >= 0 ? parseInt(this.TradeType, 10) : ''
      let bigOrSmall = parseInt(this.BigOrSmallType, 10) >= 0 ? parseInt(this.BigOrSmallType, 10) : ''
      this.$fetch.post(`fund/fundTotalDetail/queryTotalDetailList`, {
        userName: this.sumUsers,
        childUserName: this.subUser,
        tradeUserName: this.sourceUser,
        totalType : totalType,
        tradeType: tradeType,
        bigOrSmall: bigOrSmall,
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

    getDropDownList() {
      this.getDropDownTotalTypeList()
      this.getDropDownTradeTypeList()
      this.getDropDownBigOrSmallList()
    },
    getDropDownTotalTypeList() {
      this.$fetch.post(`/public/enumValue`, {
        classPackage: 'FundTotalDetailRecord$TotalTypeEnum',
        flag: true,
        state: 1
      }).then((res) => {
        res.data.data.TotalTypeEnum && res.data.data.TotalTypeEnum.forEach((item) => {
          item.type = 0
        })
        this.TotalTypeEnumList = res.data.data.TotalTypeEnum
      })
    },
    getDropDownTradeTypeList() {
      this.$fetch.post(`/public/enumValue`, {
        classPackage: 'FundTotalDetailRecord$TradeTypeEnum',
        flag: true,
        state: 1
      }).then((res) => {
        res.data.data.TradeTypeEnum && res.data.data.TradeTypeEnum.forEach((item) => {
          item.type = 1
          if (parseInt(item.id) === 1) {
            item.text = item.text + '入'
          }
          if (parseInt(item.id) === 2) {
            item.text = item.text + '出'
          }
        })

        this.TradeTypeEnumList = res.data.data.TradeTypeEnum
      })
    },
    getDropDownBigOrSmallList() {
      this.$fetch.post(`/public/enumValue`, {
        classPackage: 'FundTotalDetailRecord$BigOrSmallEnum',
        flag: true,
        state: 1
      }).then((res) => {
        res.data.data.BigOrSmallEnum && res.data.data.BigOrSmallEnum.forEach((item) => {
          item.type = 2
        })
        this.BigOrSmallEnumList =  res.data.data.BigOrSmallEnum
      })
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

  >>>.el-date-editor .el-input__inner {
    padding: 0 10px !important;
    width: 130px !important;
    height: 25px !important;
  }
</style>
