<template>
  <div class="c-page">
    <div class="crumb">
      <span>当前位置：</span>
      <router-link to="">基金管理 ></router-link>
      <router-link to="">基金委托查询</router-link>
    </div>
    <div class="search">
      <div style="display: flex; align-items: center; flex-wrap: wrap">
        <div class="search-box">
          <div class="label">委托人：</div>
          <div class="input-wrap"><input v-model="userName" type="text"></div>
        </div>
        <div class="search-box">
          <div class="label">完成状态：</div>
          <div class="input-wrap dropdown-wrap">
            <el-dropdown @command="handleCommand">
            <span class="el-dropdown-link">
              {{finishStatusText || '全部'}}<i class="el-icon-arrow-down el-icon--right"></i>
            </span>
              <el-dropdown-menu class="menu" slot="dropdown">
                <el-dropdown-item :command="item" v-for="(item, index) in finishStatusEnumList" :key="index">{{item.text}}
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </div>
        <div class="search-box">
          <div class="label">委托类型：</div>
          <div class="input-wrap dropdown-wrap">
            <el-dropdown @command="handleCommand">
            <span class="el-dropdown-link">
              {{commissionTypeText || '全部'}}<i class="el-icon-arrow-down el-icon--right"></i>
            </span>
              <el-dropdown-menu class="menu" slot="dropdown">
                <el-dropdown-item :command="item" v-for="(item, index) in commissionTypeEnumList" :key="index">{{item.text}}
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </div>
        <div class="search-box">
          <div class="label">状态：</div>
          <div class="input-wrap dropdown-wrap">
            <el-dropdown @command="handleCommand">
            <span class="el-dropdown-link">
              {{statusText || '全部'}}<i class="el-icon-arrow-down el-icon--right"></i>
            </span>
              <el-dropdown-menu class="menu" slot="dropdown">
                <el-dropdown-item :command="item" v-for="(item, index) in statusEnumList" :key="index">{{item.text}}
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
    </div>
    <list-wrap :list="list" :total="total" @change="getData">
      <div class="web-table">
        <table>
          <tr class="thead">
            <td>ID</td>
            <td>委托人</td>
            <td>委托价格</td>
            <td>委托数量</td>
            <td>成交数量</td>
            <td>成交金额</td>
            <td>可交易委托</td>
            <td style="width: 12%">卖家成交手续费</td>
            <td>状态</td>
            <td>完成状态</td>
            <td>委托类型</td>
            <td style="width: 12%">创建时间</td>
          </tr>
          <tr v-for="(item, index) in list" :key="index">
            <td>{{item.id}}</td>
            <td>{{item.userName}}</td>
            <td>{{item.price}}</td>
            <td>{{item.amount}}</td>
            <td>{{item.tradeAmount}}</td>
            <td>{{item.turnover}}</td>
            <td>{{item.leftAmount}}</td>
            <td>{{item.tradeFee || 0}}</td>
            <td>{{matchType(statusEnumList, item.state)}}</td>
            <td>{{matchType(finishStatusEnumList, item.finishState)}}</td>
            <td>{{matchType(commissionTypeEnumList, item.etype)}}</td>
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
      finishStatusText: '',
      finishType: '',
      finishStatusEnumList: [],

      commissionTypeText: '',
      commissionType: '',
      commissionTypeEnumList: [],

      statusText: '',
      statusType: '',
      statusEnumList: [],

      list: [],
      total: 0,
      pageIndex: 1,
      loadShow: false,
    }
  },
  created() {
    this.getDropDownList()
  },
  methods: {

    resetFields() {
      this.userName = ''
      this.finishStatusText = '全部'
      this.finishType = -1
      this.commissionTypeText = '全部'
      this.commissionType = -1
      this.statusText = '全部'
      this.statusType = -1
    },

    handleCommand(command) {
      if (command.type === 0) {
        this.finishStatusText = command.text
        this.finishType = command.id
      } else if (command.type === 1) {
        this.commissionTypeText = command.text
        this.commissionType = command.id
      } else if (command.type === 2) {
        this.statusText = command.text
        this.statusType = command.id
      }
    },

    getData(pageIndex) {
      this.loadShow = true
      let finishType = parseInt(this.finishType, 10) >= 0 ? parseInt(this.finishType, 10) : ''
      let commissionType = parseInt(this.commissionType, 10) >= 0 ? parseInt(this.commissionType, 10) : ''
      let statusType = parseInt(this.statusType, 10) >= 0 ? parseInt(this.statusType, 10) : ''
      this.$fetch.post(`fund/fundentrust/queryFundEntrustList`, {
        userName : this.userName,
        state : statusType,
        finishState: finishType,
        eType: commissionType,
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
      this.getDropDownFinishStateList()
      this.getDropDownCommissionTypeList()
      this.getDropDownStatusList()
    },
    getDropDownFinishStateList() {
      this.$fetch.post(`/public/enumValue`, {
        classPackage: 'FundEntrust$FinishStateEnum',
        flag: true,
        state: 1
      }).then((res) => {
        res.data.data.FinishStateEnum && res.data.data.FinishStateEnum.forEach((item) => {
          item.type = 0
        })
        this.finishStatusEnumList = res.data.data.FinishStateEnum
      })
    },
    getDropDownCommissionTypeList() {
      this.$fetch.post(`/public/enumValue`, {
        classPackage: 'FundEntrust$ETypeEnum',
        flag: true,
        state: 1
      }).then((res) => {
        res.data.data.ETypeEnum && res.data.data.ETypeEnum.forEach((item) => {
          item.type = 1
        })
        this.commissionTypeEnumList = res.data.data.ETypeEnum
      })
    },
    getDropDownStatusList() {
      this.$fetch.post(`/public/enumValue`, {
        classPackage: 'FundEntrust$StateEnum',
        flag: true,
        state: 1
      }).then((res) => {
        res.data.data.StateEnum && res.data.data.StateEnum.forEach((item) => {
          item.type = 2
        })
        this.statusEnumList =  res.data.data.StateEnum
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
