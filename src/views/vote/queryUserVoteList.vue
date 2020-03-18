<template>
  <div class="transaction-list">
    <!--转账记录管理-->
    <div class="crumb">
      <span>当前位置：</span>
      <span>投票管理 > </span>
      <span>查询用户投票记录</span>
    </div>
    <div class="search clearfix">
      <div class="input-item">
        <div class="label">ID：</div>
        <div class="input-wrap"><input type="text" v-model.trim="userId"></div>
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
      <div class="input-item btn-ctrl-w">
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
            <td style="width: 28%">用户地址</td>
            <td>投票ID</td>
            <td style="width: 10%">选项ID</td>
            <td>创建时间</td>
          </tr>
          <tr v-for="(item, index) in listData" :key="index">
            <td>{{item.id}}</td>
            <td>{{item.userName}}</td>
            <td>{{item.userAddress}}</td>
            <td>{{item.voteId}}</td>
            <td>{{item.optionId}}</td>
            <td>{{item.createAt}}</td>
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
      userId: '',
      voteId: '',
      optionId: '',
      userName: '',
      pageSize: 20,
      totalData: 0,
      listData: [],
      pageIndex: 1,
    }
  },
  created() {
  },
  methods: {
    emptyFn() {
      this.userId = ''
      this.voteId = ''
      this.optionId = ''
      this.userName = ''
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
      if (this.userId !== '') dataObj.id = this.userId
      if (this.voteId !== '') dataObj.voteId = this.voteId
      if (this.optionId !== '') dataObj.optionId = this.optionId
      if (this.userName !== '') dataObj.userName = this.userName
      this.$store.commit('SET_LOADING', true)
      this.$fetch.post(`/vote/vote/queryUserVoteList`, dataObj).then(res => {
        this.listData = res.data.page.list
        this.totalData = res.data.page.totalCount
        this.$store.commit('SET_LOADING', false)
      }).catch(err => {
        this.$store.commit('SET_LOADING', false)
      })
    }
  }
}
</script>
