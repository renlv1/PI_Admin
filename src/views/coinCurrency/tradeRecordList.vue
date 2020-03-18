<template>
  <div class="transaction-list">
    <!--转账记录管理-->
    <div class="crumb">
      <span>当前位置：</span>
      <span>新币种管理 > </span>
      <span>新币种成交记录管理</span>
    </div>
    <div class="search clearfix">
      <div class="input-item">
        <div class="label">ID：</div>
        <div class="input-wrap"><input type="text" v-model.trim="transferId"></div>
      </div>
      <div class="input-item">
        <div class="label">买家地址：</div>
        <div class="input-wrap"><input type="text" v-model.trim="buyAddress"></div>
      </div>
      <div class="input-item">
        <div class="label">卖家地址：</div>
        <div class="input-wrap"><input type="text" v-model.trim="sellAddress"></div>
      </div>
      <div class="input-item">
        <div class="label">买单ID：</div>
        <div class="input-wrap"><input type="text" v-model.trim="buyId"></div>
      </div>
      <div class="input-item">
        <div class="label">卖单ID：</div>
        <div class="input-wrap"><input type="text" v-model.trim="sellId"></div>
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
            <td style="width: 15%">买家地址</td>
            <td style="width: 15%">卖家地址</td>
            <td>买单ID</td>
            <td>卖单ID</td>
            <td>买单价格</td>
            <td>卖单价格</td>
            <td>买入币种</td>
            <td>卖出币种</td>
            <td>状态</td>
            <td>成交价格</td>
            <td>成交数量</td>
            <td>成交总金额</td>
            <td>成交手续费</td>
            <td style="width: 10%">创建时间</td>
          </tr>
          <tr v-for="(item, index) in listData" :key="index">
            <td>{{item.id}}</td>
            <td>{{item.buyAddress}}</td>
            <td>{{item.sellAddress}}</td>
            <td>{{item.buyId}}</td>
            <td>{{item.sellId}}</td>
            <td>{{item.buyPrice}}</td>
            <td>{{item.sellPrice}}</td>
            <td>{{item.buyCurrency}}</td>
            <td>{{item.sellCurrency}}</td>
            <td>{{matchType(StatusEnum, item.state)}}</td>
            <td>{{item.tradePrice}}</td>
            <td>{{item.tradeAmount}}</td>
            <td>{{item.tradeTotalPrice}}</td>
            <td>{{item.tradeFee}}</td>
            <td>{{item.createAt}}</td>
          </tr>
        </table>
      </div>
    </list-wrap>
  </div>
</template>

<script type="text/ecmascript-6">
	/*eslint-disable*/
	export default {
		data() {
			return {
				buyAddress: '',
				sellAddress: '',
				buyId: '',
				sellId: '',
				buyCurrency: '',
				sellCurrency: '',
				PairTypeEnum: [],
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
				sendPaiText: '全部',
				stateEnum: [],
				orderType: []
			}
		},
		created () {
			this.getStatus()
		},
		methods: {
			stateFn (type) {
				if (type === 1) return '成功'
				if (type === 2) return '失败'
      },
			emptyFn () {
				this.transferId = ''
				this.startDate = ''
				this.endDate = ''
				this.callbackState = ''
				this.state = ''
				this.sendPaiState = ''
				this.buyAddress = ''
        this.sellAddress = ''
        this.buyId = ''
        this.sellId = ''
        this.buyCurrency = ''
        this.sellCurrency = ''
				this.sendPaiText = '全部'
			},
			// 获取状态
			getStatus () {
				this.$fetch.get(`/public/enumValue?classPackage=CoinTradeRecord$StateEnum;&flag=true&state=1`).then(res => {
					this.StatusEnum = res.data.data.StateEnum
				})
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
				if (this.sendPaiState) dataObj.state = this.sendPaiState
				if (this.startDate) dataObj.startCreateAt = this.$changeDate(this.startDate, '-', 2)
				if (this.endDate) dataObj.endCreateAt = this.$changeDate(this.endDate, '-', 3)
				if (this.buyAddress) dataObj.buyAddress  = this.buyAddress
				if (this.sellAddress) dataObj.sellAddress  = this.sellAddress
				if (this.buyId) dataObj.buyId  = this.buyId
				if (this.sellId) dataObj.sellId  = this.sellId
				if (this.buyCurrency) dataObj.buyCurrency  = this.buyCurrency
				if (this.sellCurrency) dataObj.sellCurrency  = this.sellCurrency
				this.$store.commit('SET_LOADING', true)
				this.$fetch.post(`/coin/coinTradeRecord/queryCoinTradeRecordList`, dataObj).then(res => {
					this.listData = res.data.page.list
					this.totalData = res.data.page.totalCount
					this.$store.commit('SET_LOADING', false)
				})
			},
			// 状态
			dropFN1 (obj) {
				this.sendPaiText = obj.text
				this.sendPaiState = Number(obj.id)
			}
		}
	}
</script>
