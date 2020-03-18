<template>
  <div class="transaction-list">
    <!--转账记录管理-->
    <div class="crumb">
      <span>当前位置：</span>
      <span>投票管理 > </span>
      <span>查询投票</span>
    </div>
    <div class="search clearfix">
      <div class="input-item">
        <div class="label">ID：</div>
        <div class="input-wrap"><input type="text" v-model.trim="transferId"></div>
      </div>
      <div class="input-item">
        <div class="btn-ctrl" @click="getData(1)">查询</div>
        <div class="btn-ctrl btn-empty" @click="emptyFn">清空</div>
        <div class="btn-ctrl" @click="$router.push('/vote/queryVoteList/addVote')">新建投票</div>
      </div>
    </div>
    <list-wrap :list="listData" :total="totalData" @change="getData" :pageSize="pageSize">
      <div class="web-table">
        <table>
          <tr class="thead">
            <td style="width: 7%">ID</td>
            <td>标题</td>
            <td style="width: 20%">内容</td>
            <td>投票平台</td>
            <td>允许投票的用户</td>
            <td>开始时间</td>
            <td>截止时间</td>
            <td>创建时间</td>
            <td>修改时间</td>
            <td>操作</td>
          </tr>
          <tr v-for="(item, index) in listData" :key="index">
            <td>{{item.id}}</td>
            <td>{{isEmpty(item.title)}}</td>
            <td>{{item.content}}</td>
            <td>{{voteUseRangeFn(item.voteUseRange)}}</td>
            <td>{{voteUserSourceFn(item.voteUserSource)}}</td>
            <td>{{item.startDate}}</td>
            <td>{{item.deadline}}</td>
            <td>{{item.createAt}}</td>
            <td>{{item.updateAt}}</td>
            <td>
              <span class="btn-ctrl" style="margin-bottom: 10px"
                   @click="$router.push('/vote/queryVoteList/addVote?id=' + item.id)">修改
              </span>
              <span class="btn-ctrl" @click="$router.push('/vote/addVoteOption?id=' + item.id)">增加选项</span>
            </td>
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
      orderType: [],
      VoteUseRangeEnum: [],
      VoteUserSourceEnum: []
    }
  },
  created() {
    this.getStatus()
  },
  methods: {
    getStatus() {
      this.$fetch.get('/public/enumValue?classPackage=VoteRecord$VoteUserSourceEnum;VoteRecord$VoteUseRangeEnum&flag=false&state=1').then(res => {
        this.VoteUseRangeEnum = res.data.data.VoteUseRangeEnum
        this.VoteUserSourceEnum = res.data.data.VoteUserSourceEnum
      })
    },
    voteUseRangeFn(type) {
      if (!type) return '-'
      if (Number(type) === 1) return 'discovey'
      if (Number(type) === 2) return '赏金猎人'
    },
    voteUserSourceFn(type) {
      if (!type) return '-'
      if (Number(type) === 1) return '所有'
      if (Number(type) === 2) return '有餐券'
    },
    searchIdFn() {
      if (this.searchId === '') {
        this.$message.error('请输入订单号')
        return
      }
      this.$fetch.post('/trade/transaction/payOrder', {
        id: this.searchId
      }).then(res => {
        if (res.code === 0) {
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
    // 获取列表数据
    getData(index, pageSize) {
      if (pageSize) {
        this.pageSize = pageSize
      }
      let dataObj = {
        pageIndex: index,
        pageSize: this.pageSize
      }
      if (this.transferId) dataObj.id = this.transferId
      this.$store.commit('SET_LOADING', true)
      this.$fetch.post(`/vote/vote/queryVoteList`, dataObj).then(res => {
        this.listData = res.data.page.list
        this.totalData = res.data.page.totalCount
        this.$store.commit('SET_LOADING', false)
      }).catch(err => {
        this.$store.commit('SET_LOADING', false)
      })
    },
    // 是否发送到派钱包
    dropFN4(obj) {
      this.sendPaiText = obj.text
      this.sendPaiState = obj.id
    },
    // 转账类型
    dropFN1(obj) {
      this.orderTypeText = obj.text
      this.orderTypeState = obj.id
    },
    // 转账状态
    dropFN2(obj) {
      this.stateEnumText = obj.text
      this.state = obj.id
    },
    // 回调状态
    dropFN3(obj) {
      this.callbackStatus = obj.text
      this.callbackState = obj.id
    },
  }
}
</script>
