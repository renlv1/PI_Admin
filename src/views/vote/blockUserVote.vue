<template>
  <div class="transaction-list">
    <!--查询区块投票-->
    <div class="crumb">
      <span>当前位置：</span>
      <span>投票管理 > </span>
      <span>查询用户投票纪录</span>
    </div>
    <div class="search clearfix">
      <div class="input-item">
        <div class="label">ID：</div>
        <div class="input-wrap"><input type="text" v-model.trim="transferId"></div>
      </div>
      <div class="input-item">
        <div class="label">投票ID：</div>
        <div class="input-wrap"><input type="text" v-model.trim="voteId"></div>
      </div>
      <div class="input-item">
        <div class="label">选项ID：</div>
        <div class="input-wrap"><input type="text" v-model.trim="optionId"></div>
      </div>
      <div class="input-item">
        <div class="label">用户名：</div>
        <div class="input-wrap"><input type="text" v-model.trim="userName"></div>
      </div>
      <div class="input-item">
        <div class="btn-ctrl" @click="getData(1)">查询</div>
        <div class="btn-ctrl btn-empty" @click="emptyFn">清空</div>
      </div>
    </div>
    <list-wrap :list="listData" :total="totalData" @change="getData" :pageSize="pageSize">
      <div class="web-table">
        <table>
          <tr class="thead">
            <td style="width: 7%">ID</td>
            <td>用户名</td>
            <td style="width: 18%">用户地址</td>
            <td style="width: 7%">投票ID</td>
            <td style="width: 7%">选项ID</td>
            <td>投票数</td>
            <td>投票金额</td>
            <td>冻结状态</td>
            <td style="width: 10%">支付ID / 退返支付ID</td>
            <td style="width: 10%">创建时间</td>
            <td style="width: 10%">修改时间</td>
          </tr>
          <tr v-for="(item, index) in listData" :key="index">
            <td>{{item.id}}</td>
            <td>{{item.userName}}</td>
            <td>{{isEmpty(item.userAddress)}}</td>
            <td>{{item.voteId}}</td>
            <td>{{item.optionId}}</td>
            <td>{{item.voteNumber}}</td>
            <td>{{item.voteAmount}}</td>
            <td>{{isType(item.amountStatus)}}</td>
            <td>{{item.payId}} / {{item.returnPayId}}</td>
            <td>{{item.createAt}}</td>
            <td>{{item.updateAt}}</td>
          </tr>
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
        optionId: '',
        userName:'',
        voteId: '',
        sendPaiState: '',
        IssendpaiEnum: [],
        PaystatusEnum: [],
        StatusEnum: [],
        TypeEnum: [],
        searchId: '',
        dialogFormVisible: false,
        pageSize: 20,
        totalData: 0,
        dialogVisible: false,
        listData: [],
        transferId: '',
        sendUserName: '',
        sendAddress: '',
        receiveUser: '',
        receiveAddress: '',
        businessOrder: '',
        startDate: '',
        endDate: '',
        callbackState: '',
        state: '',
        orderTypeState: '',
        total: -1,
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
        orderType: []
      }
    },
    created () {
      // this.getStatus()
    },
    methods: {
      getStatus () {
        this.$fetch.get('/public/enumValue?classPackage=BlockChainVote$TypeEnum;BlockChainVote$SyncFlagEnum;BlockChainUserVote$AmountStatusEnum&flag=false&state=1').then(res => {
          console.log(res)
        })
      },
      cancelSearch () {
        this.searchId = ''
        this.dialogFormVisible = false
      },
      isType(type) {
        if (type === 1) return '金额冻结中'
        if (type === 2) return '已退回冻结金额'
        if (type === 3) return '退回冻结金额失败'
        if (type === 4) return '退回中'
      },
      syncStatus (status) {
        if (status === 1) return '未同步'
        if (status === 2) return '同步中'
        if (status === 3) return '已同步'
        return '-'
      },
      showDialogFn () {
        this.dialogFormVisible = true
        this.searchId = ''
      },
      emptyFn () {
        this.transferId = ''
        this.voteId = ''
        this.optionId = ''
        this.userName = ''
      },
      btnFn (state, callback) {
        if (state === 0) return '取消订单'
        if (callback === 4) return '重新回调'
        return '-'
      },
      // 获取列表数据
      getData (index, pageSize) {
        if (pageSize) {
          this.pageSize = pageSize
        }
        let dataObj = {
          pageIndex: index,
          pageSize: this.pageSize
        }
        if (this.transferId) dataObj.id = this.transferId
        if (this.voteId) dataObj.voteId = this.voteId
        if (this.optionId) dataObj.optionId = this.optionId
        if (this.userName) dataObj.userName = this.userName
	      this.$store.commit('SET_LOADING', true)
        this.$fetch.post(`/vote/blockVote/queryUserVoteList`, dataObj).then(res => {
          this.listData = res.data.page.list
          this.totalData = res.data.page.totalCount
	        this.$store.commit('SET_LOADING', false)
        }).catch(() => {
	        this.$store.commit('SET_LOADING', false)
        })
      },
      // 是否发送到派钱包
      dropFN4 (obj) {
        this.sendPaiText = obj.text
        this.sendPaiState = obj.id
      },
      // 转账类型
      dropFN1 (obj) {
        this.orderTypeText = obj.text
        this.orderTypeState = obj.id
      },
      // 转账状态
      dropFN2 (obj) {
        this.stateEnumText = obj.text
        this.state = obj.id
      },
      // 回调状态
      dropFN3 (obj) {
        this.callbackStatus = obj.text
        this.callbackState = obj.id
      },
    }
  }
</script>
