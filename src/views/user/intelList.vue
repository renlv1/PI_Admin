<template>
  <div class="c-page">
    <div class="crumb">
      <span>当前位置：</span>
      <router-link to="">用户交易管理 ></router-link>
      <router-link to="">查询开通智能列表</router-link>
    </div>
    <div class="search">
      <div class="search-box">
        <div class="label">用户名：</div>
        <div class="input-wrap"><input v-model="userName" type="text"></div>
      </div>
      <div class="search-box">
        <div class="label">邮箱：</div>
        <div class="input-wrap"><input v-model="email" type="text"></div>
      </div>
      <div class="search-box">
        <div class="label">订单类型：</div>
        <div class="input-wrap dropdown-wrap">
          <el-dropdown @command="handleCommand">
            <span class="el-dropdown-link">
              {{changeText || '全部'}}<i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu class="menu" slot="dropdown">
              <el-dropdown-item :command="item" v-for="(item, index) in ChangeOrderTypeEnumList" :key="index">{{item.text}}
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
        <div class="label">订单状态：</div>
        <div class="input-wrap dropdown-wrap">
          <el-dropdown @command="handleCommand">
            <span class="el-dropdown-link">
              {{changeOrderText || '全部'}}<i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu class="menu" slot="dropdown">
              <el-dropdown-item :command="item" v-for="(item, index) in ChangeOrderStatusEnumList" :key="index">{{item.text}}
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
            <td style="width: 5%">ID</td>
            <td style="width: 5%">用户名</td>
            <td>邮箱</td>
            <td>订单类型</td>
            <td>订单状态</td>
            <td>状态</td>
            <td>支付币种</td>
            <td>币种汇率</td>
            <td>支付金额</td>
            <td>美金价格</td>
            <td style="width: 12%">开始时间/结束时间</td>
            <td>账单ID</td>
            <td>推送时间</td>
            <td>已推送次数</td>
            <td>创建时间</td>
          </tr>
          <tr v-for="(item, index) in list" :key="index">
            <td>{{item.id}}</td>
            <td>{{item.userName}}</td>
            <td>{{item.email}}</td>
            <td>{{matchType(ChangeOrderTypeEnumList, item.orderType)}}</td>
            <td>{{matchType(ChangeOrderStatusEnumList, item.orderStatus)}}</td>
            <td>{{matchType(ChangeStatusEnumList, item.status)}}</td>
            <td>{{item.currency}}</td>
            <td>{{item.currencyRate}}</td>
            <td>{{item.orderAmount}}</td>
            <td>{{item.orderPrice}}</td>
            <td>{{item.aiStartTime}} / {{item.aiEndTime}}</td>
            <td>{{item.payId}}</td>
            <td>{{item.pushAt}}</td>
            <td>{{item.pushCount}}</td>
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
      email: '',
      changeText: '',
      orderType: '',
      ChangeOrderTypeEnumList: [],
      changeOrderText: '',
      orderStatus: '',
      ChangeOrderStatusEnumList: [],
      changeStatusText: '',
      status: '',
      ChangeStatusEnumList: [],
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
      this.email = ''
      this.changeText = '全部'
      this.orderType = -1
      this.changeOrderText = '全部'
      this.orderStatus = -1
      this.changeStatusText = '全部'
      this.status = -1
    },

    handleCommand(command) {
      if (command.type === 0) {
        this.changeText = command.text
        this.orderType = command.id
      } else if (command.type === 1) {
        this.changeOrderText = command.text
        this.orderStatus = command.id
      } else if (command.type === 2) {
        this.changeStatusText = command.text
        this.status = command.id
      }
    },
    getDropDownList() {
      this.getDropDownOrderTypeList()
      this.getDropDownOrderStatusList()
      this.getDropDownStatusList()
    },
    getDropDownOrderTypeList() {
      this.$fetch.post(`/public/enumValue`, {
        classPackage: 'OpenAiRecord$OrderTypeEnum',
        flag: true,
        state: 1
      }).then((res) => {
        res.data.data.OrderTypeEnum && res.data.data.OrderTypeEnum.forEach((item) => {
          item.type = 0
        })
        this.ChangeOrderTypeEnumList = res.data.data.OrderTypeEnum
      })
    },
    getDropDownOrderStatusList() {
      this.$fetch.post(`/public/enumValue`, {
        classPackage: 'OpenAiRecord$OrderStatusEnum',
        flag: true,
        state: 1
      }).then((res) => {
        res.data.data.OrderStatusEnum && res.data.data.OrderStatusEnum.forEach((item) => {
          item.type = 1
        })
        this.ChangeOrderStatusEnumList = res.data.data.OrderStatusEnum
      })
    },
    getDropDownStatusList() {
      this.$fetch.post(`/public/enumValue`, {
        classPackage: 'OpenAiRecord$StatusEnum',
        flag: true,
        state: 1
      }).then((res) => {
        res.data.data.StatusEnum && res.data.data.StatusEnum.forEach((item) => {
          item.type = 2
        })
        this.ChangeStatusEnumList = res.data.data.StatusEnum
      })
    },
    getData(pageIndex) {
      if (parseInt(this.total) !== 0) {
        this.loadShow = true
        let orderType = parseInt(this.orderType, 10) >= 0 ? parseInt(this.orderType, 10) : ''
        let status = parseInt(this.status, 10) >= 0 ? parseInt(this.status, 10) : ''
        let orderStatus = parseInt(this.orderStatus, 10) >= 0 ? parseInt(this.orderStatus, 10) : ''
        this.$fetch.post(`user/openai/queryOpenAiList`, {
          userName : this.userName,
          email: this.email,
          orderType: orderType,
          status: status,
          orderStatus: orderStatus,
          pageIndex: pageIndex || this.pageIndex,
          pageSize: 10,
        }).then((res) => {
          this.loadShow = false
          this.list = res.data.page.list
          this.total = res.data.page.totalCount
        })
      }
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
