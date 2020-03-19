<template>
  <div class="transaction-list">
    <!--转账记录管理-->
    <div class="crumb">
      <span>当前位置：</span>
      <span>新币种管理 > </span>
      <span>新币种货币对查询</span>
    </div>
    <div class="search clearfix">
      <div class="input-item">
        <div class="label">ID：</div>
        <div class="input-wrap"><input type="text" v-model.trim="transferId"></div>
      </div>
      <div class="input-item">
        <div class="label">状态：</div>
        <div class="input-wrap dropdown-input">
          <el-dropdown trigger="click" @command="dropFN1">
            <span class="el-dropdown-link">
              {{sendPaiText}}<i class="el-icon-caret-bottom"></i>
            </span>
            <el-dropdown-menu class="dropdown-menu" slot="dropdown">
              <el-dropdown-item :command="item" v-for="(item, index) in StatusEnum" :key="index">{{item.text}}
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>
      <div class="input-item">
        <div class="label">货币对类型：</div>
        <div class="input-wrap dropdown-input">
          <el-dropdown trigger="click" @command="dropFN2">
            <span class="el-dropdown-link">
              {{pairTypeText}}<i class="el-icon-caret-bottom"></i>
            </span>
            <el-dropdown-menu class="dropdown-menu" slot="dropdown">
              <el-dropdown-item :command="item" v-for="(item, index) in PairTypeEnum" :key="index">{{item.text}}
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>
      <div class="input-item">
        <div class="label">货币区类别：</div>
        <div class="input-wrap dropdown-input">
          <el-dropdown trigger="click" @command="dropFN3">
            <span class="el-dropdown-link">
              {{orderTypeText}}<i class="el-icon-caret-bottom"></i>
            </span>
            <el-dropdown-menu class="dropdown-menu" slot="dropdown">
              <el-dropdown-item :command="item" v-for="(item, index) in TypeEnum" :key="index">{{item.text}}
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>
      <div class="input-item">
        <div class="label">创建时间：</div>
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
            <td style="width: 6%">ID</td>
            <td>货币对</td>
            <td>平台货币</td>
            <td>状态</td>
            <td>货币类型</td>
            <td>货币区类别</td>
            <td>最小委托数</td>
            <td style="width: 8%">买入交易费率</td>
            <td>卖出交易费率</td>
            <td style="width: 12%">创建时间</td>
            <td style="width: 12%">更新时间</td>
          </tr>
          <tr v-for="(item, index) in listData" :key="index">
            <td>{{item.id}}</td>
            <td>{{isEmpty2(item.firstCurrency, item.secondCurrency)}}</td>
            <td>{{isEmpty(item.coinCurrency)}}</td>
            <td>{{matchType(StatusEnum, item.status)}}</td>
            <td>{{matchType(PairTypeEnum, item.pairType)}}</td>
            <td>{{matchType(TypeEnum, item.coinQueType)}}</td>
            <td>{{item.minEntrustNum}}</td>
            <td>{{item.buyFeeRate}}</td>
            <td>{{item.sellFeeRate}}</td>
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
export default {
  data() {
    return {
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
  created() {
    this.getStatus()
  },
  methods: {
    isEmpty2(one, two) {
      if (one) {
        return `${one}/${two}`
      } else {
        return '-'
      }
    },
    emptyFn() {
      this.transferId = ''
      this.startDate = ''
      this.endDate = ''
      this.callbackState = ''
      this.state = ''
      this.sendPaiState = ''
      this.sendPaiText = '全部'
      this.pairTypeText = '全部'
      this.orderTypeText = '全部'
    },
    // 获取状态
    getStatus() {
      this.$fetch.get(`/public/enumValue?classPackage=CoinCurrencyPair$StateEnum;CoinCurrencyPair$PairTypeEnum;CoinCurrencyPair$CoinQueTypeEnum;&flag=true&state=1`).then(res => {
        this.PairTypeEnum = res.data.data.PairTypeEnum
        this.StatusEnum = res.data.data.StateEnum
        this.TypeEnum = res.data.data.CoinQueTypeEnum
      })
    },
    // 获取列表数据
    getData(index, pageSize) {
      this.$store.commit('SET_LOADING', true)
      if (pageSize) {
        this.pageSize = pageSize
      }
      let dataObj = {
        pageIndex: index,
        pageSize: this.pageSize
      }
      if (this.transferId) dataObj.id = this.transferId
      if (this.sendPaiState) dataObj.status = this.sendPaiState
      if (this.startDate) dataObj.startCreateAt = this.$changeDate(this.startDate, '-', 2)
      if (this.endDate) dataObj.endCreateAt = this.$changeDate(this.endDate, '-', 3)
      if (this.state) dataObj.pairType = this.state
      if (this.callbackState) dataObj.coinQueType = this.callbackState
      this.$fetch.post(`/coin/coinCurrencyPair/queryCoinCurrencyPairList`, dataObj).then(res => {
        this.listData = res.data.page.list
        this.totalData = res.data.page.totalCount
        this.$store.commit('SET_LOADING', false)
      })
    },
    // 状态
    dropFN1(obj) {
      this.sendPaiText = obj.text
      this.sendPaiState = Number(obj.id)
    },
    // 货币对类型
    dropFN2(obj) {
      this.pairTypeText = obj.text
      this.state = Number(obj.id)
    },
    // 区状态
    dropFN3(obj) {
      this.orderTypeText = obj.text
      this.callbackState = Number(obj.id)
    },
  }
}
</script>
