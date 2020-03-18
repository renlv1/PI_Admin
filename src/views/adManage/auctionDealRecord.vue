<template>
  <div class="c-page">
    <div class="crumb">
      <span>当前位置：</span>
      <span>广告位管理 > </span>
      <span>广告位竞拍成交记录</span>
    </div>
    <div class="search">
      <div class="search-box">
        <div class="label">ID：</div>
        <div class="input-wrap"><input type="text" v-model.trim="transferId"></div>
      </div>
      <div class="search-box">
        <div class="label">广告ID：</div>
        <div class="input-wrap"><input type="text" v-model.trim="adId"></div>
      </div>
      <div class="search-box">
        <div class="label">竞拍ID：</div>
        <div class="input-wrap"><input type="text" v-model.trim="bidId"></div>
      </div>
      <div class="search-box">
        <div class="label">出价用户地址：</div>
        <div class="input-wrap"><input type="text" v-model.trim="userAddress"></div>
      </div>
      <div class="search-box">
        <div class="label labelCom">状态：</div>
        <div class="input-wrap dropdown-input">
          <el-dropdown trigger="click" @command="dropFN1">
            <span class="el-dropdown-link">
              {{statusText}}<i class="el-icon-caret-bottom"></i>
            </span>
            <el-dropdown-menu class="dropdown-menu" slot="dropdown">
              <el-dropdown-item :command="item" v-for="(item, index) in statusArr" :key="index">{{item.text}}
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>
      <div class="search-box">
        <div class="label labelCom label2">模板类型：</div>
        <div class="input-wrap dropdown-input">
          <el-dropdown trigger="click" @command="dropFN3">
            <span class="el-dropdown-link">
              {{templateType}}<i class="el-icon-caret-bottom"></i>
            </span>
            <el-dropdown-menu class="dropdown-menu" slot="dropdown">
              <el-dropdown-item :command="item" v-for="(item, index) in templateArr" :key="index">{{item.text}}
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>
      <div class="search-box">
        <div class="label labelCom">广告内容类型：</div>
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
            <td style="width:4%">ID</td>
            <td style="width:6%">广告ID</td>
            <td style="width:7%">竞拍ID</td>
            <td style="width:10%">出价用户地址</td>
            <td style="width:6%">成交价</td>
            <td style="width: 6%">支付ID</td>
            <td style="width: 8%">状态</td>
            <td style="width: 7%">模板类型</td>
            <td style="width: 13%">
              <div class="startTime">投放开始时间/结束时间</div>
              <!--<div class="endTime">/结束时间</div>-->
            </td>
            <td style="width: 5%">内容类型</td>
            <td>广告内容</td>
            <td style="width: 6%">商家店名</td>
            <td>拒绝理由</td>
            <td>操作</td>
          </tr>
          <tr v-for="(item, index) in listData" :key="index">
            <td>{{item.id}}</td>
            <td>{{item.adId}}</td>
            <td>{{item.bidId}}</td>
            <td>{{item.userAddress}}</td>
            <td>{{item.amount}}</td>
            <td>{{item.payId}}</td>
            <td>{{isStatus(item.status)}}</td>
            <td>{{isNote(item.modelType)}}</td>
            <td>
              <div class="startTime">{{item.putStartAt}}/{{item.putEndAt}}</div>
              <!--<div class="endTime">/{{item.putEndAt}}</div>-->
            </td>
            <td>{{isBid(item.imgType)}}</td>
            <td style="cursor: pointer" @click="zoomSource(item)">
              <div v-if="item.imgType == 1" class="img-f"><img :src="item.imgUrl"
                                                               style="max-width: 60px;max-height: 60px"></div>
              <div v-else>
                <video :src="item.imgUrl" style="max-width: 60px;max-height: 60px"></video>
              </div>
            </td>
            <td>{{isEmpty(item.merchantName)}}</td>
            <td>{{isEmpty(item.reason)}}</td>
            <td v-if="item.status === 3" class="audit" @click="openDialog(item)">{{$userStatus2Text(item.status, 4)}}</td>
            <td v-else>-</td>
          </tr>
        </table>
      </div>
    </list-wrap>
    <el-dialog width="30%" :visible.sync="showDialog" center>
      <div style="text-align: center; font-size: 16px; margin-bottom: 40px">审核广告位
      </div>
      <textarea style="width: 100%; height: 240px; padding: 16px 0 0 18px" v-model="reason"
                placeholder='拒绝理由（审核通过则不用填写）'></textarea>
      <div class="btns" style="margin-top: 30px">
        <div class="btn active" @click="sure">审核通过</div>
        <div class="btn red" @click="reject">审核失败</div>
      </div>
    </el-dialog>

    <el-dialog class="targetDialog" :visible.sync="showTargetDialog" :showClose="true" >
      <div style="">
        <div style="position: relative; height: 50vh; display: flex; justify-content: center; align-items: center" v-if="target.imgType == 1">
          <div @click="showTargetDialog = false" class="close" style="position: absolute; color: #fff; right: -20px; top: -20px; z-index: 99999999; font-size: 18px; cursor: pointer">X</div>
          <img style="max-width: 100%; max-height: 100%" :src="target.imgUrl" />
        </div>
        <div style="position: relative; height: 50vh; display: flex; justify-content: center; align-items: center" v-else>
          <div @click="showTargetDialog = false" class="close" style="position: absolute; color: #fff; right: -20px; top: -20px; z-index: 99999999; font-size: 18px; cursor: pointer">X</div>
          <video style="max-width: 100%; max-height: 100%" :src="target.imgUrl" controls="controls"></video>
        </div>
      </div>
    </el-dialog>

  </div>
</template>

<script>
export default {
  data() {
    return {
      templateArr: [],
      templateType: '全部',
      bidId: '',
      refundPayId: '',
      payId: '',
      transferId: '',
      adId: '',
      userAddress: '',
      statusText: '全部',
      statusArr: [],
      tipText: '全部',
      tipArr: [],
      pageSize: 20,
      pageIndex: 1,
      listData: [],
      totalData: 0,
      status: '', // 状态
      templateStatus: '', // 模板类型
      tipStatus: '', // 广告内容类型
      showDialog: false,
      showTargetDialog: false, // 放大视频，图片
      reason: '',
      reviewObj: {},
      target: {},
    }
  },
  created() {
    this.getStatus()
  },
  methods: {

    zoomSource(item) {
      // 用来放大图片和视频
      this.showTargetDialog = true
      this.target.imgType = item.imgType
      this.target.imgUrl = item.imgUrl
    },

    openDialog(item) {
      if (item.status == 1) {
        this.showDialog = true
        this.reviewObj = item
      }
    },
    sure() {
      this.operating(2)
    },

    reject() {
      this.operating(5, this.reason)
    },


    operating(type, reason) {
      // type = 2 通过； type = 5 拒绝(需要添加拒绝理由)
      this.$fetch.post('/advertise/advertiseDealRecord/audit', {
        id: this.reviewObj.id,
        adId: this.reviewObj.adId,
        reason: reason,
        status: type
      }).then(res => {
        if (res.code == 0) {
          this.showDialog = false
          this.$message.success(res.msg)
        }
      })
    },

    isBid(bid) {
      if (bid === 1) return '图片'
      if (bid === 2) return '视频'
      return '-'
    },
    isNote(note) {
      if (note === 0) return '自定义'
      if (note === 1) return '系统模板'
    },
    isEmpty(str) {
      if (str) return str
      return '-'
    },
    isStatus(status) {
      if (status === 0) return '未上传'
      if (status === 1) return '待审核'
      if (status === 2) return '未投放（审核通过）'
      if (status === 3) return '投放中'
      if (status === 4) return '投放完成（过期）'
      if (status === 5) return '审核不通过'
      return '-'
    },
    getStatus() {
      this.$fetch.get('/public/enumValue?classPackage=AdvertiseDealRecord$StatusEnum;AdvertiseDealRecord$PutStateEnum;AdvertiseDealRecord$ModelTypeEnum;AdvertiseDealRecord$ImgTypeEnum;&flag=true&state=1').then(res => {
        this.statusArr = res.data.data.StatusEnum
        this.templateArr = res.data.data.ModelTypeEnum
        this.tipArr = res.data.data.ImgTypeEnum
      })
    },
    emptyFn() {
      this.transferId = ''
      this.adId = ''
      this.userAddress = ''
      this.statusText = '全部'
      this.tipText = '全部'
      this.templateType = '全部'
      this.status = ''
      this.tipStatus = ''
      this.bidId = ''
      this.getData(1)
    },
    getData(index, pageSize) {
      if (pageSize) {
        this.pageSize = pageSize
      }
      let dataObj = {
        pageIndex: index,
        pageSize: this.pageSize
      }
      if (this.transferId) dataObj.id = this.transferId
      if (this.adId) dataObj.adId = this.adId
      if (this.bidId) dataObj.bidId = this.bidId
      if (this.refundPayId) dataObj.refundPayId = this.refundPayId
      if (this.userAddress) dataObj.userAddress = this.userAddress
      if (this.status >= 0) dataObj.status = this.status
      if (this.tipStatus >= 0) dataObj.imgType = this.tipStatus

      if (this.templateStatus !== '') dataObj.modelType = this.templateStatus
      this.$fetch.post(`/advertise/advertiseDealRecord/queryAdvertiseDealRecordList`, dataObj).then(res => {
        this.listData = res.data.page.list
        this.totalData = res.data.page.totalCount
      })
    },
    dropFN3(obj) {
      this.templateType = obj.text
      if (parseInt(obj.id) >= 0) {
        this.templateStatus = Number(obj.id)
      } else {
        this.templateStatus = ''
      }
    },
    dropFN1(obj) {
      this.statusText = obj.text
      if (parseInt(obj.id) >= 0) {
        this.status = Number(obj.id)
      }
    },
    dropFN2(obj) {
      this.tipText = obj.text
      if (parseInt(obj.id) >= 0) {
        this.tipStatus = Number(obj.id)
      }
    },
  }
}
</script>

<style lang="less" scoped>
  .search {
    display: flex;
  }

  .input-item {
    margin-right: 20px;
    display: flex;
  }

  .labelCom {
    margin-left: 0 !important;
  }

  .targetDialog {
    /deep/ .el-dialog {
      background: none;
      box-shadow: none;
    }
    /deep/ .el-dialog__close {
      display: none;
    }
  }

  .input-wrap {
    /deep/ .el-date-editor {
      width: 150px;
      input {
        width: 150px;
        height: 25px;
        border-radius: 4px;
        padding: 0 30px;
      }
      .el-input__icon {
        line-height: 27px;
      }
    }
    input {
      width: 150px;
      height: 24px;
      padding: 0 10px;
      font-size: 14px;
      color: #474747;
      border-radius: 4px;
    }
  }

  .audit {
    color: #3376ff;
    cursor: pointer;
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
