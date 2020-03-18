<template>
  <div class="transaction-list">
    <!--查询区块投票-->
    <div class="crumb">
      <span>当前位置：</span>
      <span>投票管理 > </span>
      <span>查询区块投票</span>
    </div>
    <div class="search clearfix">
      <div class="input-item">
        <div class="label">ID：</div>
        <div class="input-wrap"><input type="text" v-model.trim="transferId"></div>
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
            <td>标题</td>
            <td style="width: 20%">内容</td>
            <td style="width: 8%">类型</td>
            <td style="width: 7%">每票冻结金额</td>
            <td>开始时间</td>
            <td>截止时间</td>
            <td>创建时间</td>
            <td>修改时间</td>
            <td style="width: 8%">同步标识</td>
          </tr>
          <tr v-for="(item, index) in listData" :key="index">
            <td>{{item.id}}</td>
            <td>{{isEmpty(item.title)}}</td>
            <td>{{item.content}}</td>
            <td>{{isType(item.type)}}</td>
            <td>{{item.unitPrice}}</td>
            <td>{{item.voteStartTime}}</td>
            <td>{{item.voteEndTime}}</td>
            <td>{{item.createAt}}</td>
            <td>{{item.updateAt}}</td>
            <td>{{syncStatus(item.syncFlag)}}</td>
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
    },
    methods: {
      cancelSearch () {
        this.searchId = ''
        this.dialogFormVisible = false
      },
      isType(type) {
        if (type === 1) return '单选'
        if (type === 2) return '多选'
      },
      syncStatus (status) {
        if (status === 1) return '未同步'
        if (status === 2) return '同步中'
        if (status === 3) return '已同步'
      },
      showDialogFn () {
        this.dialogFormVisible = true
        this.searchId = ''
      },
      emptyFn () {
        this.transferId = ''
        this.getData(1)
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
        this.$fetch.post(`/vote/blockVote/queryVoteList`, dataObj).then(res => {
          this.listData = res.data.page.list
          this.totalData = res.data.page.totalCount
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
