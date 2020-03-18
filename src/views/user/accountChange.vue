<template>
  <div class="c-page">
    <div class="crumb">
      <span>当前位置：</span>
      <router-link to="">用户交易管理 ></router-link>
      <router-link to="">账变记录管理</router-link>
    </div>
    <div class="search">
      <div class="search-box">
        <div class="label">用户名：</div>
        <div class="input-wrap"><input v-model="userName" type="text"></div>
      </div>
      <div class="search-box">
        <div class="label">账户地址：</div>
        <div class="input-wrap"><input v-model="accountAddress" type="text"></div>
      </div>
      <div class="search-box">
        <div class="label">币种：</div>
        <div class="input-wrap"><input v-model="currency" type="text"></div>
      </div>
      <div class="search-box">
        <div class="label">账变类型：</div>
        <div class="input-wrap dropdown-wrap">
          <el-dropdown @command="handleCommand">
            <span class="el-dropdown-link">
              {{changeText || '全部'}}<i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu class="menu" slot="dropdown">
              <el-dropdown-item :command="item" v-for="(item, index) in ChangeTypeEnumList" :key="index">{{item.text}}
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>
      <div class="search-box">
        <div class="label">交易时间：</div>
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
    <list-wrap :list="list" :total="total" @change="getData">
      <div class="web-table">
        <table>
          <tr class="thead">
            <td style="width: 7%">ID</td>
            <td style="width: 7%">用户名</td>
            <td style="width: 13%">用户地址</td>
            <td style="width: 5%">币种</td>
            <td style="width: 9%">变动前余额</td>
            <td style="width: 7%">变动金额</td>
            <td style="width: 9%">变化后金额</td>
            <td>变动前冻结余额</td>
            <td>变动冻结余额</td>
            <td>最终冻结余额</td>
            <td>账变类型</td>
            <td style="width: 6%">业务ID</td>
            <td style="width: 10%">时间</td>
          </tr>
          <tr v-for="(item, index) in list" :key="index">
            <td>{{item.id}}</td>
            <td>{{item.userName}}</td>
            <td>{{item.address}}</td>
            <td>{{item.currency}}</td>
            <td>{{item.beforeChangeBalance}}</td>
            <td>{{item.changeAmount}}</td>
            <td>{{item.finalBalance}}</td>
            <td>{{item.beforeChangeFreezeBalance}}</td>
            <td>{{item.changeAmountFreeze}}</td>
            <td>{{item.finalFreezeBalance}}</td>
            <td>{{matchType(ChangeTypeEnumList, item.changeType)}}</td>
            <td>{{item.orderId || '-'}}</td>
            <td>{{item.createAt}}</td>
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
  name: "accountChange",
  data() {
    return {
      list: [],
      ChangeTypeEnumList: [], // 枚举类型
      total: 0,
      userName: '',
      accountAddress: '',
      status: '',
      startTime: '',
      endTime: '',
      currency: '',
      changeText: '',
      changeType: '',
      pageIndex: 1,
      loadShow: false
    }
  },
  mounted() {
    this.getDropDownList()
  },
  methods: {
    resetFields() {
      this.userName = ''
      this.accountAddress = ''
      this.currency = ''
      this.changeText = '全部'
      this.changeType = -1
      this.startTime = ''
      this.endTime = ''
    },
    handleCommand(command) {
      this.changeText = command.text
      this.changeType = command.id
    },
    getData(pageIndex) {
      if (parseInt(this.total) !== 0) {
        this.loadShow = true
        let changeType = parseInt(this.changeType, 10) >= 0 ? parseInt(this.changeType, 10) : ''
        this.$fetch.post(`user/user/queryUserAccountLogList`, {
          userName: this.userName,
          address: this.accountAddress,
          currency: this.currency,
          changeType: changeType,
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
      this.$fetch.post(`/public/enumValue`, {
        classPackage: 'UserAccountLog$ChangeTypeEnum',
        flag: true,
        state: 1
      }).then((res) => {
        this.ChangeTypeEnumList = res.data.data.ChangeTypeEnum
      })
    },

    matchType(arr, target) {
      let text
      arr.forEach((item) => {
        if (parseInt(item.id) === parseInt(target)) {
          text = item.text
        }
      })
      return text
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
  input {
    width: 130px !important;
    height: 25px !important;
  }

  .menu {
    display: flex;
    flex-direction: column;
    height: 300px !important;
    overflow-y: auto;
  }

  .el-date-editor.el-input {
    width: 180px !important;
    height: 25px !important;
  }

  >>> .el-date-editor.el-input input {
    padding: 0 10px;
    width: 160px;
    height: 25px;
  }
</style>
