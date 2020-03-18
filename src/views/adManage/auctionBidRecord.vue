<template>
  <div class="c-page">
    <div class="crumb">
      <span>当前位置：</span>
      <span>广告位管理 > </span>
      <span>广告位竞拍出价记录</span>
    </div>
  <div class="search">
      <div class="search-box">
        <div class="label">ID：</div>
        <div class="input-wrap"><input type="text" v-model.trim="transferId"></div>
      </div>

      <div class="search-box">
        <div class="label">出价用户地址：</div>
        <div class="input-wrap"><input type="text" v-model.trim="userAdderss"></div>
      </div>

      <div class="search-box">
        <div class="label labelCom">状态：</div>
        <div class="input-wrap dropdown-input">
          <el-dropdown trigger="click" @command="dropFN2">
          <span class="el-dropdown-link">
            {{tipText}}<i class="el-icon-caret-bottom"></i>
          </span>
            <el-dropdown-menu class="dropdown-menu" slot="dropdown">
              <el-dropdown-item :command="item" v-for="(item, index) in tipArr" :key="index">{{item.text}}
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>

      <div class="btns">
        <div class="btn" @click="getData(1)">查询</div>
        <div class="btn black" @click="emptyFn()">清空</div>
      </div>
    </div>
    <list-wrap :list="listData" :total="totalData" @change="getData" :pageSize="pageSize">
      <div class="web-table">
        <table>
          <tr class="thead">
            <td style="width: 7%">ID</td>
            <td style="width: 8%">广告ID</td>
            <td>用户名</td>
            <td style="width: 18%">出价用户地址</td>
            <td>出价(π)</td>
            <td>状态</td>
            <td>竞价开始时间</td>
            <td>竞价结束时间</td>
          </tr>
          <tr v-for="(item, index) in listData" :key="index">
            <td>{{item.id}}</td>
            <td >{{item.adId}}</td>
            <td>{{isEmpty(item.userName)}}</td>
            <td>{{item.userAddress}}</td>
            <td>{{item.amount}}</td>
            <td>{{isNote(item.status)}}</td>
            <td>{{item.bidStartAt}}</td>
            <td>{{item.bidEndAt}}</td>
          </tr>
        </table>
      </div>
    </list-wrap>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        refundPayId: '',
        payId: '',
        transferId:'',
        adId: '',
        userAdderss: '',
        statusText: '全部',
        statusArr: [],
        tipText: '全部',
        tipArr: [],
        pageSize: 20,
        pageIndex: 1,
        listData: [],
        totalData: 0,
        status: '',
        tipStatus: ''
      }
    },
    created() {
      this.getStatus()
    },
    methods: {
      isBid(bid) {
        if (bid === 1) return '未开始'
        if (bid === 2) return '竞拍中'
        if (bid === 3) return '竞拍结束'
        return '-'
      },
      isNote(note) {
        if (note === 1) return '出局'
        if (note === 2) return '领先'
        if (note === 3) return '成交'
      },
      isStatus(status) {
        if (status === 1) return '待支付'
        if (status === 2) return '支付成功'
        if (status === 3) return '支付失败'
        return '-'
      },
      getStatus () {
        this.$fetch.get('/public/enumValue?classPackage=AdvertiseBidRecord$StatusEnum;AdvertiseBidRecord$PayStatusEnum;AdvertiseBidRecord$BidStatusEnum;&flag=true&state=1').then(res => {
          this.statusArr = res.data.data.PayStatusEnum
          this.tipArr = res.data.data.StatusEnum
        })
      },
      emptyFn() {
        this.transferId = ''
        this.adId = ''
        this.userAdderss = ''
        this.statusText = '全部'
        this.tipText = '全部'
        this.status = ''
        this.tipStatus = ''
        this.getData(1)
      },
      getData (index, pageSize) {
        if (pageSize) {
          this.pageSize = pageSize
        }
        let dataObj = {
          pageIndex: index,
          pageSize: this.pageSize
        }
        if (this.transferId) dataObj.id = this.transferId
        if (this.adId) dataObj.adId = this.adId
        if (this.payId) dataObj.payId = this.payId
        if (this.refundPayId) dataObj.refundPayId = this.refundPayId
        if (this.userAdderss) dataObj.userAddress = this.userAdderss
        if (this.status) dataObj.payStatus = this.status
        if (this.tipStatus) dataObj.status = this.tipStatus
        this.$fetch.post(`/advertise/advertiseBidRecord/queryAdvertiseBidRecordList`, dataObj).then(res => {
          this.listData = res.data.page.list
          this.totalData = res.data.page.totalCount
        })
      },
      dropFN1(obj) {
        this.statusText = obj.text
        this.status = Number(obj.id)
      },
      dropFN2(obj) {
        this.tipText = obj.text
        this.tipStatus = Number(obj.id)
      },
    }
  }
</script>

<style lang="less" scoped>
  .search{
    display: flex;
  }
  .input-item{
    margin-right: 20px;
    display: flex;
  }
  .labelCom{
    margin-left: 0 !important;
  }
  .input-wrap{
    /deep/ .el-date-editor{
      width: 150px;
      input{
        width: 150px;
        height: 25px;
        border-radius: 4px;
        padding: 0 30px;
      }
      .el-input__icon{
        line-height: 27px;
      }
    }
    input{
      width: 150px;
      height: 24px;
      padding: 0 10px;
      font-size: 14px;
      color: #474747;
      border-radius: 4px;
    }
  }
</style>
<style lang="stylus" scoped>
  .search
    position relative
    display flex
    flex-direction row
    flex-wrap wrap
    input {
      width 130px
      height 25px
      margin-right 0
    }
    .search-box
      margin-right 20px
      display flex
      flex-direction row
      align-items center
      .dropdown-wrap
        cursor pointer
        text-align center
        line-height 25px
        min-width: 130px;
        margin-right: 20px;
        background-color #fff
        border: 1px solid #DCDFE6;
        border-radius: 6px;
        padding: 0 10px;
        font-size 15px
        height 25px
    .btns
      .btn
        line-height 25px
        height 25px
        width auto
        padding 0 20px
</style>
