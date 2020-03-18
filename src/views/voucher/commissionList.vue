<template>
  <div class="c-page">
    <div class="crumb">
      <span>当前位置：</span>
      <router-link to="">餐券交易 ></router-link>
      <router-link to="">查询餐券委托记录</router-link>
    </div>
    <div class="search">
      <div class="search-box">
        <div class="label">用户名：</div>
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
        <div class="btn black" @click="resetFields">清空</div>
      </div>
    </div>
    <list-wrap :list="list" :total="total" @change="getData">
      <div class="web-table">
        <table>
          <tr class="thead">
            <td style="width: 7%">ID</td>
            <td>用户名</td>
            <td>委托价格</td>
            <td>委托数量</td>
            <td>成交数量</td>
            <td>可交易委托</td>
            <td>状态</td>
            <td style="width: 9%">完成状态</td>
            <td>委托类型</td>
            <td>手续费</td>
            <td>委托总金额</td>
            <td style="width: 12%">创建时间</td>
            <td style="width: 12%">更新时间</td>
          </tr>
          <tr v-for="(item, index) in list" :key="index">
            <td>{{item.id}}</td>
            <td>{{item.userName}}</td>
            <td>{{item.price}}</td>
            <td>{{item.amount}}</td>
            <td>{{item.tradeAmount}}</td>
            <td>{{item.leftAmount || 0}}</td>
            <td>{{matchType(statusEnumList, item.state)}}</td>
            <td>{{matchType(finishStatusEnumList, item.finishState)}}</td>
            <td>{{matchType(commissionTypeEnumList, item.etype)}}</td>
            <td>{{item.tradeFee || 0}}</td>
            <td>{{item.sumAmount || 0}}</td>
            <td>{{item.createAt | time}}</td>
            <td>{{item.updateAt | time}}</td>
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
      startTime: '',
      endTime: '',

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
      this.finishType = ''
      this.commissionTypeText = '全部'
      this.commissionType = ''
      this.statusText = '全部'
      this.statusType = ''
      this.startTime = ''
      this.endTime = ''
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
      let finishType = parseInt(this.finishType, 10) >= -1 ? parseInt(this.finishType, 10) : ''
      let commissionType = parseInt(this.commissionType, 10) >= -1 ? parseInt(this.commissionType, 10) : ''
      let statusType = parseInt(this.statusType, 10) >= -1 ? parseInt(this.statusType, 10) : ''
      this.$fetch.post(`voucher/voucher/queryEntrustList`, {
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
        classPackage: 'VoucherEntrust$FinishStateEnum',
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
        classPackage: 'VoucherEntrust$ETypeEnum',
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
        classPackage: 'VoucherEntrust$StateEnum',
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
