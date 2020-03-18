<template>
  <div class="transaction-list">
    <!--转账记录管理-->
    <div class="crumb">
      <span>当前位置：</span>
      <span>交易管理 > </span>
      <span>转账记录管理</span>
    </div>
    <div class="search clearfix">
      <div class="input-item">
        <div class="label">ID：</div>
        <div class="input-wrap"><input type="text" v-model.trim="transferId"></div>
      </div>
      <div class="input-item">
        <div class="label">转出用户：</div>
        <div class="input-wrap"><input type="text" v-model.trim="transferOutUser"></div>
      </div>
      <div class="input-item">
        <div class="label">转出地址：</div>
        <div class="input-wrap"><input type="text" v-model.trim="transferOutAddress"></div>
      </div>
      <div class="input-item">
        <div class="label">接收用户：</div>
        <div class="input-wrap"><input type="text" v-model.trim="receiveUser"></div>
      </div>
      <div class="input-item">
        <div class="label">接收地址：</div>
        <div class="input-wrap"><input type="text" v-model.trim="receiveAddress"></div>
      </div>
      <div class="input-item">
        <div class="label">业务订单号：</div>
        <div class="input-wrap"><input type="text" v-model.trim="businessOrder"></div>
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
        <div class="label">转账类型：</div>
        <div class="input-wrap dropdown-input">
          <el-dropdown trigger="click" @command="dropFN1">
            <span class="el-dropdown-link">
              {{orderTypeText}}<i class="el-icon-caret-bottom"></i>
            </span>
            <el-dropdown-menu class="dropdown-menu dropdown-menu-hidden" slot="dropdown">
              <el-dropdown-item :command="item" v-for="(item, index) in orderType" :key="index">{{item.text}}
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>
      <div class="input-item">
        <div class="label">转账状态：</div>
        <div class="input-wrap dropdown-input">
          <el-dropdown trigger="click" @command="dropFN2">
            <span class="el-dropdown-link">
              {{stateEnumText}}<i class="el-icon-caret-bottom"></i>
            </span>
            <el-dropdown-menu class="dropdown-menu" slot="dropdown">
              <el-dropdown-item :command="item" v-for="(item, index) in stateEnum" :key="index">{{item.text}}
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>
      <div class="input-item">
        <div class="label">回调状态：</div>
        <div class="input-wrap dropdown-input">
          <el-dropdown trigger="click" @command="dropFN3">
            <span class="el-dropdown-link">
              {{callbackStatus}}<i class="el-icon-caret-bottom"></i>
            </span>
            <el-dropdown-menu class="dropdown-menu" slot="dropdown">
              <el-dropdown-item :command="item" v-for="(item, index) in callbackEnum" :key="index">{{item.text}}
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>
      <div class="input-item btn-ctrl-w">
        <div class="btn-ctrl" @click="search">查询</div>
        <div class="btn-ctrl btn-empty" @click="emptyFn">清空</div>
        <div class="btn-ctrl" @click="showDialogFn">支付订单</div>
      </div>
    </div>
    <list-wrap :list="listData" :total="totalData" @change="getData" :pageSize="pageSize">
      <div class="web-table">
        <table>
          <tr class="thead">
            <td style="width: 5%">ID</td>
            <td>转出用户</td>
            <td style="width: 12%">转出用户地址</td>
            <td>接收用户</td>
            <td style="width: 12%">接收用户地址</td>
            <td>转账金额</td>
            <td style="width: 10%">转账类型</td>
            <td>状态</td>
            <td>回调状态</td>
            <td style="width: 10%">时间</td>
            <td>业务订单号</td>
            <td>转账说明</td>
            <td>操作</td>
          </tr>
          <tr v-if="listData.length !== 0" v-for="(item, index) in listData" :key="index">
            <td>{{item.id}}</td>
            <td>{{item.sendUserName}}</td>
            <td>{{item.sendAddress}}</td>
            <td>{{item.receiveUserName}}</td>
            <td>{{item.receiveAddress}}</td>
            <td>{{item.amount}} {{item.currency}}</td>
            <td>{{item.paymentTypeStr}}</td>
            <td>{{item.stateStr}}</td>
            <td>{{isEmpty(item.callbackStateStr)}}</td>
            <td>{{item.createAt}}</td>
            <td>{{isEmpty(item.orderId)}}</td>
            <td>{{isEmpty(item.remark)}}</td>
            <td class="btn-ctrl" @click="btnCtrlFn(item.state, item.id, item.callbackState)">{{btnFn(item.state,
              item.callbackState)}}
            </td>
          </tr>
        </table>
      </div>
    </list-wrap>
    <el-dialog title="支付订单" :visible.sync="dialogFormVisible" class="pay-dialog-a" center>
      <div>
        <input type="请输入订单号" placeholder="请输入订单号" v-model.trim="searchId">
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
      searchId: '',
      dialogFormVisible: false,
      pageSize: 20,
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
      pageIndex: 1,
      callbackStatus: '全部',
      stateEnumText: '全部',
      orderTypeText: '全部',
      callbackEnum: [],
      stateEnum: [],
      orderType: []
    }
  },
  created() {
    this.getStatus()
  },
  methods: {
    searchIdFn() {
      if (this.searchId === '') {
        this.$message.error('请输入订单号')
        return
      }
      this.loadingShow = true
      this.$fetch.post('/trade/transaction/payOrder', {
        id: this.searchId
      }).then(res => {
        this.getData()
        this.cancelSearch()
        this.loadingShow = false
        Dialog({
          title: res.msg
        })
      }).catch(() => {
        this.loadingShow = false
      })
    },
    cancelSearch() {
      this.searchId = ''
      this.dialogFormVisible = false
    },
    showDialogFn() {
      this.dialogFormVisible = true
      this.searchId = ''
    },
    emptyFn() {
      this.transferId = ''
      this.transferOutUser = ''
      this.transferOutAddress = ''
      this.receiveUser = ''
      this.receiveAddress = ''
      this.businessOrder = ''
      this.startDate = ''
      this.endDate = ''
      this.callbackState = ''
      this.state = ''
      this.orderTypeState = ''
      this.callbackStatus = '全部'
      this.stateEnumText = '全部'
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
                this.getData()
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
                this.getData()
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
      this.$fetch.get(`/public/enumValue?classPackage=Transaction$CallbackEnum;Transaction$OrderType;Transaction$StateEnum&flag=true&state=1`).then(res => {
        if (res.code === 0) {
          this.callbackEnum = res.data.data.CallbackEnum
          this.stateEnum = res.data.data.StateEnum
          this.orderType = res.data.data.OrderType
        }
      })
    },
    // 获取列表数据
    getData(index, pageSize) {
      if (parseInt(this.total) !== 0) {
        if (pageSize) {
          this.pageSize = pageSize
        }
        let dataObj = {
          pageIndex: index,
          pageSize: this.pageSize
        }
        if (this.transferId) dataObj.id = this.transferId
        if (this.transferOutUser) dataObj.sendUserName = this.transferOutUser
        if (this.transferOutAddress) dataObj.sendAddress = this.transferOutAddress
        if (this.receiveUser) dataObj.receiveUserName = this.receiveUser
        if (this.receiveAddress) dataObj.receiveAddress = this.receiveAddress
        if (this.businessOrder) dataObj.orderId = this.businessOrder
        if (this.startDate) dataObj.startDate = this.$changeDate(this.startDate, '-', 2)
        if (this.endDate) dataObj.endDate = this.$changeDate(this.endDate, '-', 3)
        if (this.callbackState) dataObj.callbackState = this.callbackState
        if (this.state) dataObj.state = this.state
        if (this.orderTypeState) dataObj.orderType = this.orderTypeState
        this.$store.commit('SET_LOADING', true)
        this.$fetch.post(`/trade/transaction/queryTransactionList`, dataObj).then(res => {
          this.listData = res.data.page.list
          this.totalData = res.data.page.totalCount
          this.$store.commit('SET_LOADING', false)
        })
      }
    },
    // 转账类型
    dropFN1(obj) {
      this.orderTypeText = obj.text
      this.orderTypeState = Number(obj.id)
    },
    // 转账状态
    dropFN2(obj) {
      this.stateEnumText = obj.text
      this.state = Number(obj.id)
    },
    // 回调状态
    dropFN3(obj) {
      this.callbackStatus = obj.text
      this.callbackState = Number(obj.id)
    },
    search() {
      this.total = 1 // hook listWrap组件的loading
      this.getData()
    },
  }
}
</script>


