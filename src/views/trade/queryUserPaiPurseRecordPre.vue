<template>
  <div class="transaction-list">
    <!--转账记录管理-->
    <div class="crumb">
      <span>当前位置：</span>
      <span>交易管理 > </span>
      <span>派付钱包管理</span>
    </div>
    <div class="search clearfix">
      <div class="input-item">
        <div class="label">ID：</div>
        <div class="input-wrap"><input type="text" v-model.trim="transferId"></div>
      </div>
      <div class="input-item">
        <div class="label">用户名：</div>
        <div class="input-wrap"><input type="text" v-model.trim="transferOutUser"></div>
      </div>
      <div class="input-item">
        <div class="label">支付ID：</div>
        <div class="input-wrap"><input type="text" v-model.trim="payId"></div>
      </div>
      <div class="input-item">
        <div class="label">变动类型：</div>
        <div class="input-wrap dropdown-input">
          <el-dropdown trigger="click" @command="dropFN1">
            <span class="el-dropdown-link">
              {{orderTypeText}}<i class="el-icon-caret-bottom"></i>
            </span>
            <el-dropdown-menu class="dropdown-menu" slot="dropdown">
              <el-dropdown-item :command="item" v-for="(item, index) in ChangeTypeEnum" :key="index">{{item.text}}
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>
      <div class="input-item">
        <div class="label">转账时间：</div>
        <div class="input-wrap">
          <el-date-picker
            v-model="startDate"
            :picker-options="pickerBeginDateBefore"
            format="yyyy-MM-dd"
            type="date">
          </el-date-picker>
        </div>
        <span class="margin">到</span>
        <div class="input-wrap">
          <el-date-picker
            :picker-options="pickerBeginDateAfter"
            format="yyyy-MM-dd"
            v-model="endDate"
            type="date">
          </el-date-picker>
        </div>
      </div>
      <div class="input-item">
        <div class="label">业务来源ID：</div>
        <div class="input-wrap"><input type="text" v-model.trim="sourceId"></div>
      </div>
      <div class="input-item btn-ctrl-w">
        <div class="btn-ctrl" @click="search">查询</div>
        <div class="btn-ctrl btn-empty" @click="emptyFn">清空</div>
        <div class="btn-ctrl transfer-btn" @click="showDialogFn(1)">转入派付钱包</div>
        <div class="btn-ctrl transfer-btn" @click="showDialogFn(2)">转出派付钱包</div>
      </div>
    </div>
    <list-wrap :list="listData" :total="totalData" @change="getData" :pageSize="pageSize">
      <div class="web-table">
        <table>
          <tr class="thead">
            <td style="width: 7%">ID</td>
            <td>用户名</td>
            <td style="width: 18%">用户地址</td>
            <td>变动前金额</td>
            <td>变动金额</td>
            <td>变动后金额</td>
            <td>变动类型</td>
            <td>变动状态</td>
            <td style="width: 12%">时间</td>
            <td>业务来源ID</td>
            <td>支付ID</td>
            <td>备注</td>
          </tr>
          <tr v-for="(item, index) in listData" :key="index">
            <td>{{item.id}}</td>
            <td>{{item.userName}}</td>
            <td>{{item.userAddress}}</td>
            <td>{{item.beforeChangeBalance}}</td>
            <td>{{item.changeAmount}}</td>
            <td>{{item.finalBalance}}</td>
            <td>{{item.changeTypeStr}}</td>
            <td>{{item.purseStateStr}}</td>
            <td>{{item.createAt}}</td>
            <td>{{isEmpty(item.sourceId)}}</td>
            <td>{{isEmpty(item.payId)}}</td>
            <td>{{isEmpty(item.remark)}}</td>
          </tr>
          <div style="z-index: 9999" class="web-loading1" v-show="loadShow">
            <img src="~@img/loading.gif" />
          </div>
        </table>
      </div>
    </list-wrap>
    <el-dialog title="支付订单" :visible.sync="dialogFormVisible" class="pay-dialog-a" center>
      <div>
        <input :placeholder="dialogInput1" v-model.trim="inputAddress">
        <input :placeholder="dialogInput2" v-model.trim="inputAmount" class="input-b">
      </div>
      <div slot="footer" class="dialog-footer">
        <div @click="searchIdFn" class="btn-item" :class="{'disable': loadingShow}">
          <img src="@/assets/img/loading.gif" alt="" v-show="loadingShow">
          <span>确 定</span>
        </div>
        <div @click="cancelSearch" class="btn-item cancel-btn">取 消</div>
      </div>
    </el-dialog>
  </div>
</template>

<script type="text/ecmascript-6">
/*eslint-disable*/
import Dialog from '@/components/dialog/dialog'

export default {
  data() {
    return {
      loadingShow: false,
      isTranfer: 1,
      ChangeTypeEnum: [],
      searchId: '',
      dialogFormVisible: false,
      pageSize: 10,
      totalData: 0,
      dialogVisible: false,
      listData: [],
      transferId: '',
      transferOutUser: '',
      transferOutAddress: '',
      receiveUser: '',
      receiveAddress: '',
      businessOrder: '',
      startDate: '',
      endDate: '',
      callbackState: '',
      state: '',
      orderTypeState: '',
      total: 0,
      searchVal: '',
      //        日期控件
      pickerBeginDateBefore: {
        disabledDate: (time) => {
          let beginDateVal = this.endDate
          if (beginDateVal) {
            return time.getTime() > beginDateVal
          }
        }
      },
      pickerBeginDateAfter: {
        disabledDate: (time) => {
          let beginDateVal = this.startDate
          if (beginDateVal) {
            return time.getTime() < beginDateVal
          }
        }
      },
      dialogTitle: '',
      dialogInput1: '',
      dialogInput2: '',
      inputAddress: '',
      inputAmount: '',
      pageIndex: 1,
      callbackStatus: '全部',
      stateEnumText: '全部',
      orderTypeText: '全部',
      callbackEnum: [],
      stateEnum: [],
      orderType: [],
      sourceId: '',
      payId: '',
      loadShow: false
    }
  },
  created() {
    this.getStatus()
  },
  methods: {
    searchIdFn() {
      if (this.inputAddress === '') {
        this.$message.error(this.dialogInput1)
        return
      }
      if (this.inputAmount === '') {
        this.$message.error(this.dialogInput2)
        return
      }
      this.loadingShow = true
      this.$fetch.post('/trade/paiPurse/sysOperatePurse', {
        userAddress: this.inputAddress,
        changeAmount: this.inputAmount,
        changeType: this.isTranfer
      }).then(res => {
        this.loadingShow = false
        this.getData(1, 20, 2)
        this.cancelSearch()
        Dialog({
          title: res.msg
        })
      }).catch(err => {
        this.loadingShow = false
      })
    },
    cancelSearch() {
      this.inputAddress = ''
      this.inputAmount = ''
      this.dialogFormVisible = false
    },
    showDialogFn(index) {
      this.isTranfer = index
      this.dialogFormVisible = true
      this.inputAddress = ''
      this.inputAmount = ''
      if (index === 1) {
        this.dialogTitle = '转入派付钱包'
        this.dialogInput1 = '请输入转入用户地址'
        this.dialogInput2 = '请输入转入金额'
      } else {
        this.dialogTitle = '转出派付钱包'
        this.dialogInput1 = '请输入转出用户地址'
        this.dialogInput2 = '请输入转出金额'
      }
    },
    emptyFn() {
      this.transferId = ''
      this.transferOutUser = ''
      this.payId = ''
      this.sourceId = ''
      this.startDate = ''
      this.endDate = ''
      this.orderTypeState = ''
      this.orderTypeText = '全部'
    },
    btnFn(state, callback) {
      if (state === 0) return '取消订单'
      if (callback === 4) return '重新回调'
      return '-'
    },
    btnCtrlFn(state, id, callback) {
      if (state === 0) { // 取消订单
        Dialog({
          title: '是否取消订单',
          okFn: () => {
            this.$fetch.post('/trade/transaction/cancelTransaction', {
              id: id
            }).then(res => {
              if (res.code === 0) {
                this.getData(1, 20, 2)
                Dialog({
                  title: res.msg
                })
              }
            })
          }
        })
      } else if (callback === 4) { // 重新回调
        Dialog({
          title: '是否重新回调',
          okFn: () => {
            this.$fetch.post('/trade/transaction/callBackTransaction', {
              id: id
            }).then(res => {
              if (res.code === 0) {
                this.getData(1, 20, 2)
                Dialog({
                  title: res.msg
                })
              }
            })
          }
        })
      }
    },
    // 获取状态
    getStatus() {
      this.$fetch.get(`/public/enumValue?classPackage=UserPaiPurseRecord$ChangeTypeEnum;UserPaiPurseRecord$PurseStateEnum&flag=true&state=1`).then(res => {
        this.ChangeTypeEnum = res.data.data.ChangeTypeEnum
      })
    },
    // 获取列表数据
    getData(index, pageSize, flag) {
      if (parseInt(this.total) !== 0) {
        if (pageSize) {
          this.pageSize = pageSize
        }
        let dataObj = {
          pageIndex: index,
          pageSize: this.pageSize
        }
        if (this.transferId) dataObj.id = this.transferId
        if (this.transferOutUser) dataObj.userName = this.transferOutUser
        if (this.sourceId) dataObj.sourceId = this.sourceId
        if (this.payId) dataObj.payId = this.payId
        if (this.startDate) dataObj.stateCreateAt = this.$changeDate(this.startDate, '-', 2)
        if (this.endDate) dataObj.endCreateAt = this.$changeDate(this.endDate, '-', 3)
        if (this.orderTypeState) dataObj.changeType = this.orderTypeState
        if (!flag) {
          this.$store.commit('SET_LOADING', true)
        }
        this.$fetch.post(`/trade/paiPurse/queryUserPaiPurseRecordList`, dataObj).then(res => {
          this.listData = res.data.page.list
          this.totalData = res.data.page.totalCount
          this.$store.commit('SET_LOADING', false)
        })
      }
    },
    // 变动类型：
    dropFN1(obj) {
      this.orderTypeText = obj.text
      this.orderTypeState = Number(obj.id)
    },
    search() {
      this.total = 1 // hook listWrap组件的loading
      this.getData()
    },
  }
}
</script>
