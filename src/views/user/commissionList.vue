<template>
  <div class="c-page">
    <div class="crumb">
      <span>当前位置：</span>
      <router-link to="">用户交易管理 ></router-link>
      <router-link to="">查询委托列表</router-link>
    </div>
    <div class="search">
      <div class="search-box">
        <div class="label">账号地址：</div>
        <div class="input-wrap"><input v-model="accountAddress" type="text"></div>
      </div>
      <div class="search-box">
        <div class="label">状态：</div>
        <div class="input-wrap dropdown-wrap">
          <el-dropdown @command="handleCommand">
            <span class="el-dropdown-link">
              {{changeStatusText || '全部'}}<i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu class="menu" slot="dropdown">
              <el-dropdown-item :command="item" v-for="(item, index) in ChangeStatusEnumList" :key="index">{{item.text}}
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>
      <div class="search-box">
        <div class="label">委托类别：</div>
        <div class="input-wrap dropdown-wrap">
          <el-dropdown @command="handleCommand">
            <span class="el-dropdown-link">
              {{changeTypeText || '全部'}}<i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu class="menu" slot="dropdown">
              <el-dropdown-item :command="item" v-for="(item, index) in ChangeTypeEnumList" :key="index">{{item.text}}
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>
      <div class="search-box">
        <div class="label">委托日期：</div>
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
      <div class="btns" style="margin-right: 20px">
        <div class="btn" @click="search">查询</div>
        <div class="btn black" @click="resetFields()">清空</div>
      </div>
    </div>
    <list-wrap :list="list" :total="total" @change="getData">
      <div class="web-table">
        <table>
          <tr class="thead">
            <td style="width: 7%">ID</td>
            <td style="width: 20%">账户地址</td>
            <td>委托价格</td>
            <td>委托数量</td>
            <td>委托金额（USD/PI）</td>
            <td style="width: 7%">类别</td>
            <td>状态</td>
            <td>成交数量</td>
            <td>成交金额</td>
            <td style="width: 10%">委托时间</td>
          </tr>
          <tr v-for="(item, index) in list" :key="index">
            <td>{{item.id}}</td>
            <td>{{item.address}}</td>
            <td>{{item.price}}</td>
            <td>{{item.amount}}</td>
            <td>{{item.cashAmount}}</td>
            <td>{{matchType(ChangeTypeEnumList, item.etype)}}</td>
            <td>{{matchType(ChangeStatusEnumList, item.state)}}</td>
            <td>{{item.tradeAmount}}</td>
            <td>{{item.tradeCashAmount}}</td>
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
      userName: '',
      accountAddress: '',

      changeStatusText: '',
      changeStatusType: '',
      ChangeStatusEnumList: [],

      changeTypeText: '',
      changeType: '',
      ChangeTypeEnumList: [],

      startTime: '',
      endTime: '',
      list: [],
      total: 0,
      pageIndex: 1,
      loadShow: false
    }
  },

  created() {
    this.getDropDownList()
  },
  methods: {

    resetFields() {
      this.userName = ''
      this.accountAddress = ''
      this.changeStatusText = '全部'
      this.changeStatusType = ''
      this.changeTypeText = '全部'
      this.changeType = ''
      this.startTime = ''
      this.endTime = ''
    },

    handleCommand(command) {
      if (command.type === 0) {
        this.changeStatusText = command.text
        this.changeStatusType = command.id
      } else if (command.type === 1) {
        this.changeTypeText = command.text
        this.changeType = command.id
      }
    },
    getData(pageIndex) {
      if (parseInt(this.total) !== 0) {
        this.loadShow = true
        let state = parseInt(this.changeStatusType, 10) >= -1 ? parseInt(this.changeStatusType, 10) : ''
        let type = parseInt(this.changeType, 10) >= -1 ? parseInt(this.changeType, 10) : ''
        this.$fetch.post(`oldtrade/entrust/queryEntrustList`, {
          userName: this.userName,
          address: this.accountAddress,
          state: state,
          etype: type,
          startDate: this.startTime,
          endDate: this.endTime,
          pageIndex: pageIndex || this.pageIndex,
          pageSize: 10,
        }).then((res) => {
          this.loadShow = false
          this.list = res.data.page.list
          this.total = res.data.page.totalCount
        })
      }
    },
    getDropDownList() {
      this.getDropDownStatusList()
      this.getDropDownTypeList()
    },

    getDropDownStatusList() {
      this.$fetch.post(`/public/enumValue`, {
        classPackage: 'Entrust$StateEnum',
        flag: true,
        state: 1
      }).then((res) => {
        res.data.data.StateEnum && res.data.data.StateEnum.forEach((item) => {
          item.type = 0
        })
        this.ChangeStatusEnumList = res.data.data.StateEnum
      })
    },

    getDropDownTypeList() {
      this.$fetch.post(`/public/enumValue`, {
        classPackage: 'Entrust$ETypeEnum',
        flag: true,
        state: 1
      }).then((res) => {
        res.data.data.ETypeEnum && res.data.data.ETypeEnum.forEach((item) => {
          item.type = 1
        })
        this.ChangeTypeEnumList = res.data.data.ETypeEnum

      })
    },

    search() {
      this.total = 1 // hook listWrap组件的loading
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
