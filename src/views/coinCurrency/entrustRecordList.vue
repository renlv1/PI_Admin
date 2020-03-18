<template>
  <div class="transaction-list">
    <!--转账记录管理-->
    <div class="crumb">
      <span>当前位置：</span>
      <span>新币种管理 > </span>
      <span>新币种委托记录查询</span>
    </div>
    <div class="search clearfix">
      <div class="input-item">
        <div class="label">ID：</div>
        <div class="input-wrap"><input type="text" v-model.trim="transferId"></div>
      </div>
      <div class="input-item">
        <div class="label">委托地址：</div>
        <div class="input-wrap"><input type="text" v-model.trim="entrustAddress"></div>
      </div>
      <div class="input-item">
        <div class="label">买入币种：</div>
        <div class="input-wrap"><input type="text" v-model.trim="buyCurrency"></div>
      </div>
      <div class="input-item">
        <div class="label">卖出币种：</div>
        <div class="input-wrap"><input type="text" v-model.trim="sellCurrency"></div>
      </div>
      <div class="input-item">
        <div class="label">交易类型：</div>
        <div class="input-wrap dropdown-input">
          <el-dropdown trigger="click" @command="dropFN4">
            <span class="el-dropdown-link">
              {{eTypeEnumText}}<i class="el-icon-caret-bottom"></i>
            </span>
            <el-dropdown-menu class="dropdown-menu" slot="dropdown">
              <el-dropdown-item :command="item" v-for="(item, index) in ETypeEnum" :key="index">{{item.text}}</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>
      <div class="input-item">
        <div class="label">状态：</div>
        <div class="input-wrap dropdown-input">
          <el-dropdown trigger="click" @command="dropFN1">
            <span class="el-dropdown-link">
              {{sendPaiText}}<i class="el-icon-caret-bottom"></i>
            </span>
            <el-dropdown-menu class="dropdown-menu" slot="dropdown">
              <el-dropdown-item :command="item" v-for="(item, index) in StatusEnum" :key="index">{{item.text}}</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>
      <div class="input-item">
        <div class="label">完成状态：</div>
        <div class="input-wrap dropdown-input">
          <el-dropdown trigger="click" @command="dropFN2">
            <span class="el-dropdown-link">
              {{pairTypeText}}<i class="el-icon-caret-bottom"></i>
            </span>
            <el-dropdown-menu class="dropdown-menu" slot="dropdown">
              <el-dropdown-item :command="item" v-for="(item, index) in PairTypeEnum" :key="index">{{item.text}}</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>
      <div class="input-item">
        <div class="label">价格类型：</div>
        <div class="input-wrap dropdown-input">
          <el-dropdown trigger="click" @command="dropFN3">
            <span class="el-dropdown-link">
              {{orderTypeText}}<i class="el-icon-caret-bottom"></i>
            </span>
            <el-dropdown-menu class="dropdown-menu" slot="dropdown">
              <el-dropdown-item :command="item" v-for="(item, index) in TypeEnum" :key="index">{{item.text}}</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>
      <div class="input-item">
        <div class="label">委托时间：</div>
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
      <div class="input-item btn-ctrl-w">
        <div class="btn-ctrl" @click="getData(1)">查询</div>
        <div class="btn-ctrl btn-empty" @click="emptyFn">清空</div>
      </div>
    </div>
    <list-wrap :list="listData" :total="totalData" @change="getData" :pageSize="pageSize">
      <div class="web-table">
        <table>
          <tr class="thead">
            <td>ID</td>
            <td>用户名</td>
            <td style="width: 15%">委托地址</td>
            <td>货币对</td>
            <td>交易类型</td>
            <td>委托价格</td>
            <td>委托数量</td>
            <td>委托总金额</td>
            <td>状态</td>
            <td>成交数量</td>
            <td>成交总金额</td>
            <td>完成状态</td>
            <td>手续费</td>
            <td>价格类型</td>
            <td style="width: 10%">委托时间</td>
            <td>操作</td>
          </tr>
          <tr v-for="(item, index) in listData" :key="index">
            <td>{{item.id}}</td>
            <td>{{item.userName}}</td>
            <td>{{isEmpty(item.entrustAddress)}}</td>
            <td>{{isEmpty2(item.buyCurrency, item.sellCurrency)}}</td>
            <td>{{matchType(ETypeEnum, item.etype)}}</td>
            <td>{{item.price}}</td>
            <td>{{item.amount}}</td>
            <td>{{item.cashAmount}}</td>
            <td>{{matchType(StatusEnum, item.state)}}</td>
            <td>{{item.tradeAmount}}</td>
            <td>{{item.tradeCashAmount}}</td>
            <td>{{matchType(PairTypeEnum, item.finishState)}}</td>
            <td>{{isEmpty3(item.tradeFee)}}</td>
            <td>{{matchType(TypeEnum, item.priceType)}}</td>
            <td>{{item.createAt}}</td>
            <td class="btn-ctrl" @click="cancelFn(item)">{{ctrlFn(item.state)}}</td>
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
				entrustAddress: '',
				buyCurrency: '',
				sellCurrency: '',
				ETypeEnum: [],
				eTypeEnumText: '全部',
				eTypeEnumId: '',
				PairTypeEnum: [],
				pairTypeText: '全部',
				CoinQueTypeEnum: [],
				sendPaiState: '',
				StatusEnum: [],
				TypeEnum: [],
				searchId: '',
				pageSize: 20,
				totalData: 0,
				listData: [],
				transferId: '',
				startDate: '',
				endDate: '',
				callbackState: '',
				state: '',
				total: -1,
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
				orderTypeText: '全部',
				sendPaiText: '全部',
				stateEnum: [],
				orderType: []
			}
		},
		created () {
			this.getStatus()
		},
		methods: {
			cancelFn (item) {
				if (item.state === 1 || item.state === 3) {
					Dialog({
            title: '是否取消该订单',
            okFn: () => {
            	this.$fetch.post('/coin/coinEntrustRecord/cancelCoinEntrust', {
		            id: item.id
              }).then(res => {
              	this.getData(1, 20, '2')
              	Dialog({
                  title: '操作成功'
                })
              })
            }
          })
        }
      },
			ctrlFn (type) {
				if (type === 1 || type === 3) return '取消订单'
        return '-'
      },
			isEmpty3 (str) {
				if (str) return str
        return '0'
      },
			isEmpty2 (one, two) {
				if (one) {
					return `${one}/${two}`
				} else {
					return '-'
				}
			},
			//     "coinQueType": 1,             1主区 2ico
			emptyFn () {
				this.transferId = ''
				this.entrustAddress = ''
        this.buyCurrency = ''
        this.sellCurrency = ''
				this.startDate = ''
				this.endDate = ''
				this.callbackState = ''
				this.state = ''
        this.eTypeEnumId = ''
				this.sendPaiState = ''
				this.sendPaiText = '全部'
				this.pairTypeText = '全部'
				this.orderTypeText = '全部'
        this.eTypeEnumText = '全部'
			},
			// 获取状态
			getStatus () {
				this.$fetch.get(`/public/enumValue?classPackage=CoinEntrustRecord$ETypeEnum;CoinEntrustRecord$StateEnum;CoinEntrustRecord$FinishStateEnum;CoinEntrustRecord$PriceTypeEnum;&flag=true&state=1`).then(res => {
					this.PairTypeEnum = res.data.data.FinishStateEnum
					this.StatusEnum = res.data.data.StateEnum
					this.TypeEnum = res.data.data.PriceTypeEnum
					this.ETypeEnum = [
						{id: "select", text: "全部"},
						{id: "1", text: "买入"},
            {id: "2", text: "卖出"}
          ]
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
				if (this.transferId) dataObj.id = this.transferId
				if (this.entrustAddress) dataObj.entrustAddress = this.entrustAddress
				if (this.buyCurrency) dataObj.buyCurrency = this.buyCurrency
				if (this.sellCurrency) dataObj.sellCurrency = this.sellCurrency
				if (this.startDate) dataObj.startCreateAt = this.$changeDate(this.startDate, '-', 2)
				if (this.endDate) dataObj.endCreateAt = this.$changeDate(this.endDate, '-', 3)
				if (this.state) dataObj.finishState = this.state
				if (this.callbackState) dataObj.priceType = this.callbackState
				if (this.eTypeEnumId) dataObj.etype  = this.eTypeEnumId
        if (this.sendPaiState) dataObj.state = this.sendPaiState
        if (!flag) {
	        this.$store.commit('SET_LOADING', true)
        }
				this.$fetch.post(`/coin/coinEntrustRecord/queryCoinEntrustRecordList`, dataObj).then(res => {
					this.listData = res.data.page.list
					this.totalData = res.data.page.totalCount
					this.$store.commit('SET_LOADING', false)
				})
			},
			// 状态
			dropFN1 (obj) {
				this.sendPaiText = obj.text
				this.sendPaiState = Number(obj.id)
			},
			// 货币对类型
			dropFN2 (obj) {
				this.pairTypeText = obj.text
				this.state = Number(obj.id)
			},
			// 区状态
			dropFN3 (obj) {
				this.orderTypeText = obj.text
				this.callbackState = Number(obj.id)
			},
			dropFN4 (obj) {
				this.eTypeEnumText = obj.text
				this.eTypeEnumId = Number(obj.id)
      }
		}
	}
</script>
