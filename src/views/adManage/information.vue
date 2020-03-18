<template>
  <div class="c-page">
    <div class="crumb">
      <span>当前位置：</span>
      <router-link to="">广告位管理 ></router-link>
      <router-link to="">广告位消息查询</router-link>
    </div>
    <div class="search">
      <div class="search-box">
        <div class="label">ID：</div>
        <div class="input-wrap"><input v-model="id" type="text"></div>
      </div>
      <div class="search-box">
        <div class="label">接收方地址：</div>
        <div class="input-wrap"><input v-model="receiveMessageUser" type="text"></div>
      </div>
      <div class="search-box">
        <div class="label">支付状态：</div>
        <div class="input-wrap dropdown-wrap">
          <el-dropdown @command="handleCommand">
            <span class="el-dropdown-link">
              {{payStatusText || '全部'}}<i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu class="menu" slot="dropdown">
              <el-dropdown-item :command="item" v-for="(item, index) in payStatusEnumList" :key="index">{{item.text}}
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>
      <div class="search-box">
        <div class="label">消息类型：</div>
        <div class="input-wrap dropdown-wrap">
          <el-dropdown @command="handleCommand">
            <span class="el-dropdown-link">
              {{messageTypeText || '全部'}}<i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu class="menu" slot="dropdown">
              <el-dropdown-item :command="item" v-for="(item, index) in messageTypeEnumList" :key="index">{{item.text}}
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>
      <div class="btns">
        <div class="btn" @click="search">查询</div>
        <div class="btn black" @click="resetFields">清空</div>
      </div>
    </div>
    <list-wrap :list="list" :total="total" @change="getData">
      <div class="web-table">
        <table>
          <tr class="thead">
            <td>ID</td>
            <td>接收方名称</td>
            <td>接收方地址</td>
            <td>消息内容</td>
            <td>业务ID</td>
            <td>状态</td>
            <td>消息类型</td>
            <td>创建时间</td>
          </tr>
          <tr v-for="(item, index) in list" :key="index">
            <td>{{item.id}}</td>
            <td>{{item.receiveName || '-'}}</td>
            <td>{{item.receiveAddress || '-'}}</td>
            <td>{{item.message}}</td>
            <td>{{item.businessId || '-'}}</td>
            <td>{{matchType(payStatusEnumList, item.status)}}</td>
            <td>{{matchType(messageTypeEnumList, item.type)}}</td>
            <td>{{item.createAt | time}}</td>
          </tr>
          <div style="z-index: 9999" class="web-loading1" v-show="loadShow">
            <img src="~@img/loading.gif" />
          </div>
        </table>
      </div>
    </list-wrap>
  </div>
</template>

<script>
export default {
  data() {
    return {
      id: '',
      sendMessageUser: '',
      receiveMessageUser: '',
      list: [],
      total: 0,
      pageIndex: 1,
      loadShow: false,

      payStatusText: '',
      payStatusType: '',
      payStatusEnumList: [],

      messageTypeText: '',
      messageType: '',
      messageTypeEnumList: [],
    }
  },
  created() {
    this.getDropDownList()
  },
  methods: {

    resetFields() {
      this.id = ''
      this.sendMessageUser = ''
      this.receiveMessageUser = ''
      this.payStatusText = '全部'
      this.payStatusType = -1
      this.messageTypeText = '全部'
      this.messageType = -1
    },

    handleCommand(command) {
      if (command.type === 1) {
        this.payStatusText = command.text
        this.payStatusType = command.id
      } else if (command.type === 0) {
        this.messageTypeText = command.text
        this.messageType = command.id
      }
    },

    getData(pageIndex, pageSize) {
      this.loadShow = true
      let payStatusType = parseInt(this.payStatusType, 10) >= 0 ? parseInt(this.payStatusType, 10) : ''
      let messageType = parseInt(this.messageType, 10) >= 0 ? parseInt(this.messageType, 10) : ''
      this.$fetch.post(`advertise/advertiseMessage/queryAdvertiseMessageList`, {
        id: this.id,
        sendAddress : this.sendMessageUser,
        receiveAddress: this.receiveMessageUser,
        type: messageType,
        status: payStatusType,
        pageIndex: pageIndex || this.pageIndex,
        pageSize: pageSize || 10,
      }).then((res) => {
        this.loadShow = false
        if (res.data && res.data.page.list) {
          this.list = res.data.page.list
          this.total = res.data.page.totalCount
        } else {
          this.list = []
          this.total = 0
        }
      })
    },
    search() {
      this.getData()
    },

    getDropDownList() {
      this.getDropDownStatusList()
      this.getDropDownTypeList()
    },
    getDropDownStatusList() {
      this.$fetch.post(`/public/enumValue`, {
        classPackage: 'AdvertiseMessage$StatusEnum',
        flag: true,
        state: 1
      }).then((res) => {
        res.data.data.StatusEnum && res.data.data.StatusEnum.forEach((item) => {
          item.type = 1
        })
        this.payStatusEnumList = res.data.data.StatusEnum
      })
    },
    getDropDownTypeList() {
      this.$fetch.post(`/public/enumValue`, {
        classPackage: 'AdvertiseMessage$TypeEnum',
        flag: true,
        state: 1
      }).then((res) => {
        res.data.data.TypeEnum && res.data.data.TypeEnum.forEach((item) => {
          item.type = 0
        })
        this.messageTypeEnumList = res.data.data.TypeEnum
      })
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  .search
    position relative
    display flex
    flex-direction row
    flex-wrap wrap
    input {
      width 130px
      height 25px
    }
    .search-box
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
        cursor pointer
</style>

<style scoped>

  .el-date-editor.el-input {
    width: 150px !important;
    height: 25px !important;
  }

  >>>.el-date-editor .el-input__inner {
    padding: 0 10px !important;
    width: 130px !important;
    height: 25px !important;
  }
</style>
