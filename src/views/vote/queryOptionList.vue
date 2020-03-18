<template>
  <div class="transaction-list">
    <!--转账记录管理-->
    <div class="crumb">
      <span>当前位置：</span>
      <span>投票管理 > </span>
      <span>查询投票选项</span>
    </div>
    <div class="search clearfix">
      <div class="input-item">
        <div class="label">选项ID：</div>
        <div class="input-wrap"><input type="text" v-model.trim="optionID"></div>
      </div>
      <div class="input-item">
        <div class="label">投票ID：</div>
        <div class="input-wrap"><input type="text" v-model.trim="voteId"></div>
      </div>
      <div class="input-item">
        <div class="btn-ctrl" @click="getData(1)">查询</div>
        <div class="btn-ctrl btn-empty" @click="emptyFn">清空</div>
        <div class="btn-ctrl" @click="$router.push('/vote/addVoteOption?ADD=1')" style="width: 110px;">新建投票选项</div>
      </div>
    </div>
    <list-wrap :list="listData" :total="totalData" @change="getData" :pageSize="pageSize">
      <div class="web-table">
        <table>
          <tr class="thead">
            <td>ID</td>
            <td>选项描述</td>
            <td>投票ID</td>
            <td>被选次数</td>
            <td>排序</td>
            <td>创建时间</td>
            <td>操作</td>
          </tr>
          <tr v-for="(item, index) in listData" :key="index">
            <td>{{item.id}}</td>
            <td>{{isEmpty(item.description)}}</td>
            <td>{{item.voteId}}</td>
            <td>{{item.voteTotal}}</td>
            <td>{{isEmpty(item.sort)}}</td>
            <td>{{item.createAt}}</td>
            <td>
              <span class="btn-ctrl" style="margin-right: 30px" @click="modifyFn(item)">修改</span>
              <span class="btn-ctrl" @click="deleteFn(item.id)">删除</span>
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
				optionID: '',
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
				orderType: [],
				VoteUseRangeEnum: [],
				VoteUserSourceEnum: []
			}
		},
		created () {
			this.getStatus()
		},
		methods: {
			modifyFn (item) {
					// ?dataObj='+ JSON.stringify(item) +'&id=' + item.voteId
				this.$router.push({
          path: '/vote/addVoteOption',
          query: {
          	id: item.voteId,
	          voteId: item.id,
	          description: item.description,
	          sort: item.sort,
	          voteTotal: item.voteTotal
          }
        })
      },
			getStatus () {
				this.$fetch.get('/public/enumValue?classPackage=VoteRecord$VoteUserSourceEnum;VoteRecord$VoteUseRangeEnum&flag=false&state=1').then(res => {
					this.VoteUseRangeEnum = res.data.data.VoteUseRangeEnum
					this.VoteUserSourceEnum = res.data.data.VoteUserSourceEnum
				})
			},
			voteUseRangeFn (type) {
				if (!type) return '-'
				if (Number(type) === 1) return 'discovey'
				if (Number(type) === 2) return '赏金猎人'
			},
			voteUserSourceFn (type) {
				if (!type) return '-'
				if (Number(type) === 1) return '所有'
				if (Number(type) === 2) return '有餐券'
			},
			searchIdFn () {
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
			cancelSearch () {
				this.searchId = ''
				this.dialogFormVisible = false
			},
			isSendpaiFn (type) {
				if (type === 1) return '是'
				if (type === 2) return '否'
				return '-'
			},
			showDialogFn () {
				this.dialogFormVisible = true
				this.searchId = ''
			},
			emptyFn () {
				this.optionID = ''
				this.voteId = ''
			},
			btnFn (state, callback) {
				if (state === 0) return '取消订单'
				if (callback === 4) return '重新回调'
				return '-'
			},
			deleteFn (id) {
				Dialog({
					title: '是否删除该记录',
					okFn: () => {
						this.$fetch.post('/vote/vote/deleteVoteOption', {
							id: id
						}).then(res => {
							this.getData(1, 20, 1)
							Dialog({
								title: res.msg
							})
						})
					}
				})
      },
			// 获取列表数据
			getData (index, pageSize, flag) {
				if (pageSize) {
					this.pageSize = pageSize
				}
				let dataObj = {
					pageIndex: index,
					pageSize: this.pageSize
				}
				if (this.optionID) dataObj.id = this.optionID
				if (this.voteId) dataObj.voteId = this.voteId
        if (!flag) {
	        this.$store.commit('SET_LOADING', true)
        }
				this.$fetch.post(`/vote/vote/queryOptionList`, dataObj).then(res => {
					this.listData = res.data.page.list
					this.totalData = res.data.page.totalCount
					this.$store.commit('SET_LOADING', false)
				}).catch(err => {
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
