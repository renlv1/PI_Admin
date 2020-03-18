 <template>
  <div class="transaction-list">
    <!--转账记录管理-->
    <div class="crumb">
      <span>当前位置：</span>
      <span>交易管理 > </span>
      <span>派钱包转账记录管理</span>
    </div>
    <div class="search clearfix">
      <div class="input-item">
        <div class="label">ID：</div>
        <div class="input-wrap"><input type="text" v-model.trim="transferId"></div>
      </div>
      <div class="input-item">
        <div class="label">发送方用户名：</div>
        <div class="input-wrap"><input type="text" v-model.trim="sendUserName"></div>
      </div>
      <div class="input-item">
        <div class="label">接收方用户名：</div>
        <div class="input-wrap"><input type="text" v-model.trim="userName"></div>
      </div>
      <div class="input-item">
        <div class="label">是否发送到派钱包：</div>
        <div class="input-wrap dropdown-input">
          <el-dropdown trigger="click" @command="dropFN4">
            <span class="el-dropdown-link">
              {{sendPaiText}}<i class="el-icon-caret-bottom"></i>
            </span>
            <el-dropdown-menu class="dropdown-menu" slot="dropdown">
              <el-dropdown-item :command="item" v-for="(item, index) in IssendpaiEnum" :key="index">{{item.text}}
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
        <div class="label">转账类型：</div>
        <div class="input-wrap dropdown-input">
          <el-dropdown trigger="click" @command="dropFN1">
            <span class="el-dropdown-link">
              {{orderTypeText}}<i class="el-icon-caret-bottom"></i>
            </span>
            <el-dropdown-menu class="dropdown-menu dropdown-menu-auto" slot="dropdown">
              <el-dropdown-item :command="item" v-for="(item, index) in TypeEnum" :key="index">{{item.text}}
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>
      <div class="input-item">
        <div class="label">状态：</div>
        <div class="input-wrap dropdown-input">
          <el-dropdown trigger="click" @command="dropFN2">
            <span class="el-dropdown-link">
              {{stateEnumText}}<i class="el-icon-caret-bottom"></i>
            </span>
            <el-dropdown-menu class="dropdown-menu" slot="dropdown">
              <el-dropdown-item :command="item" v-for="(item, index) in StatusEnum" :key="index">{{item.text}}
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>
      <div class="input-item">
        <div class="label">支付状态：</div>
        <div class="input-wrap dropdown-input">
          <el-dropdown trigger="click" @command="dropFN3">
            <span class="el-dropdown-link">
              {{callbackStatus}}<i class="el-icon-caret-bottom"></i>
            </span>
            <el-dropdown-menu class="dropdown-menu" slot="dropdown">
              <el-dropdown-item :command="item" v-for="(item, index) in PaystatusEnum" :key="index">{{item.text}}
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>
      <div class="input-item btn-ctrl-w">
        <div class="btn-ctrl" @click="search">查询</div>
        <div class="btn-ctrl btn-empty" @click="emptyFn">清空</div>
      </div>
    </div>
    <list-wrap :list="listData" :total="totalData" @change="getData" :pageSize="pageSize">
      <div class="web-table">
        <table>
          <tr class="thead">
            <td style="width: 4%">ID</td>
            <td>转出用户</td>
            <td style="width: 15%">转出用户地址</td>
            <td>接收用户</td>
            <td style="width: 15%">接收用户地址</td>
            <td>转账金额</td>
            <td style="width: 10%">转账类型</td>
            <td>状态</td>
            <td>支付状态</td>
            <td style="width: 10%">时间</td>
            <td>发送到派钱包</td>
            <td>派钱包订单ID</td>
            <td style="width: 5%">重试次数</td>
          </tr>
          <tr v-for="(item, index) in listData" :key="index">
            <td>{{item.id}}</td>
            <td>{{isEmpty(item.sendName)}}</td>
            <td>{{item.sendAddress}}</td>
            <td>{{isEmpty(item.userName)}}</td>
            <td>{{item.userAddress}}</td>
            <td>{{item.amount}} {{item.currency}}</td>
            <td>{{item.typeStr}}</td>
            <td>{{item.statusStr}}</td>
            <td>{{isEmpty(item.payStatusStr)}}</td>
            <td>{{item.createAt}}</td>
            <td>{{isEmpty(item.isSendPaiStr)}}</td>
            <td>{{isEmpty(item.paiorderid)}}</td>
            <td>{{btnFn(item.count)}}</td>
          </tr>
          <div style="z-index: 9999" class="web-loading1" v-show="loadShow">
            <img src="~@img/loading.gif" />
          </div>
        </table>
      </div>
    </list-wrap>
  </div>
</template>

<script type="text/ecmascript-6">
/*eslint-disable*/
import Dialog from '@/components/dialog/dialog'

export default {
  data() {
    return {
      sendPaiState: '',
      IssendpaiEnum: [],
      PaystatusEnum: [],
      StatusEnum: [],
      TypeEnum: [],
      searchId: '',
      dialogFormVisible: false,
      pageSize: 10,
      totalData: 0,
      dialogVisible: false,
      listData: [],
      transferId: '',
      sendUserName: '',
      userName: '',
      sendAddress: '',
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
      sendPaiText: '全部',
      callbackEnum: [],
      stateEnum: [],
      orderType: [],
      loadShow: false
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
      this.$fetch.post('/trade/transaction/payOrder', {
        id: this.searchId
      }).then(res => {
        if (res.code === 0) {
          this.total = 1 // hook listWrap组件的loading
          this.getData()
          this.cancelSearch()
          Dialog({
            title: res.msg
          })
        }
      })
    },
    cancelSearch() {
      this.searchId = ''
      this.dialogFormVisible = false
    },
    isSendpaiFn(type) {
      if (type === 1) return '是'
      if (type === 2) return '否'
      return '-'
    },
    showDialogFn() {
      this.dialogFormVisible = true
      this.searchId = ''
    },
    emptyFn() {
      this.transferId = ''
      this.sendUserName = ''
      this.sendAddress = ''
      this.receiveAddress = ''
      this.businessOrder = ''
      this.startDate = ''
      this.endDate = ''
      this.callbackState = ''
      this.state = ''
      this.userName = ''
      this.orderTypeState = ''
      this.sendPaiText = '全部'
      this.sendPaiState = ''
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
                this.total = 1 // hook listWrap组件的loading
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
                this.total = 1 // hook listWrap组件的loading
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
      this.$fetch.get(`/public/enumValue?classPackage=PaiToDiscoveryLog$IssendpaiEnum;PaiToDiscoveryLog$PaystatusEnum;PaiToDiscoveryLog$StatusEnum;PaiToDiscoveryLog$TypeEnum;&flag=true&state=1`).then(res => {
        if (res.code === 0) {
          this.IssendpaiEnum = res.data.data.IssendpaiEnum
          this.PaystatusEnum = res.data.data.PaystatusEnum
          this.StatusEnum = res.data.data.StatusEnum
          this.TypeEnum = res.data.data.TypeEnum
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
        this.loadShow = true
        if (this.userName) dataObj.userName = this.userName
        if (this.transferId) dataObj.id = this.transferId
        if (this.sendUserName) dataObj.sendName = this.sendUserName
        if (this.sendPaiState) dataObj.issendpai = this.sendPaiState
        if (this.startDate) dataObj.stateCreateAt = this.$changeDate(this.startDate, '-', 2)
        if (this.endDate) dataObj.endCreateAt = this.$changeDate(this.endDate, '-', 3)
        if (this.orderTypeState) dataObj.type = this.orderTypeState
        if (this.state) dataObj.status = this.state
        if (this.callbackState) dataObj.paystatus = this.callbackState
        this.$fetch.post(`/trade/paiToDiscovery/queryPaiToDiscoveryList`, dataObj).then(res => {
          if (res.code === 0) {
            this.loadShow = false
            this.listData = res.data.page.list
            this.totalData = res.data.page.totalCount
          }
        })
      }
    },

    search() {
      this.total = 1 // hook listWrap组件的loading
      this.getData()
    },

    // 是否发送到派钱包
    dropFN4(obj) {
      this.sendPaiText = obj.text
      this.sendPaiState = Number(obj.id)
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
  }
}
</script>

<style scoped>
  >>> .web-loading1 {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 20px;
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    transform: translate(-50%, -50%);
    background-size: 20px;
  }

  .web-loading1 img {
    width: 20px;
    height: 20px;
  }
</style>
