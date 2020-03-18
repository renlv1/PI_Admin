<template>
  <div class="c-page">
    <div class="crumb">
      <span>当前位置：</span>
      <router-link to="">基金管理 ></router-link>
      <router-link to="">基金赠送查询</router-link>
    </div>
    <div class="search">
      <div style="width: 92%; display: flex; align-items: center">
        <div class="search-box">
          <div class="label">获赠用户：</div>
          <div class="input-wrap"><input v-model="giveUserName" type="text"></div>
        </div>
        <div class="search-box">
          <div class="label">赠送来源用户：</div>
          <div class="input-wrap"><input v-model="giveSourceUserName" type="text"></div>
        </div>
        <div class="search-box">
          <div class="label">赠送类型：</div>
          <div class="input-wrap dropdown-wrap">
            <el-dropdown @command="handleCommand">
            <span class="el-dropdown-link">
              {{giveTypeText || '全部'}}<i class="el-icon-arrow-down el-icon--right"></i>
            </span>
              <el-dropdown-menu class="menu" slot="dropdown">
                <el-dropdown-item :command="item" v-for="(item, index) in giveTypeEnumList" :key="index">{{item.text}}
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
    </div>
    <list-wrap :list="list" :total="total" @change="getData">
      <div class="web-table">
        <table>
          <tr class="thead">
            <td>赠送记录ID</td>
            <td>获赠用户</td>
            <td>赠送来源</td>
            <td>赠送数量</td>
            <td>赠送时派别累计量</td>
            <td>赠送百分比</td>
            <td>当前用户持有量</td>
            <td>赠送类型</td>
            <td style="width: 15%">赠送时间</td>
          </tr>
          <tr v-for="(item, index) in list" :key="index">
            <td>{{item.id}}</td>
            <td>{{item.userName}}</td>
            <td>{{item.childUserName || '-'}}</td>
            <td>{{item.presentAmount}}</td>
            <td>{{item.groupHoldFund}}</td>
            <td>{{item.presentPercent}}</td>
            <td>{{item.userHoldFund}}</td>
            <td>{{matchType(giveTypeEnumList, item.presentType)}}</td>
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
      giveUserName: '',
      giveSourceUserName: '',

      giveTypeText: '',
      giveType: '',
      giveTypeEnumList: [],

      list: [],
      total: 0,
      pageIndex: 1,
      loadShow: false,
    }
  },
  created() {
    this.getDropDownList()
  },
  methods: {

    resetFields() {
      this.giveUserName = ''
      this.giveSourceUserName = ''
      this.giveTypeText = '全部'
      this.giveType = -1
    },

    handleCommand(command) {
      this.giveTypeText = command.text
      this.giveType = command.id
    },

    getData(pageIndex) {
      this.loadShow = true
      let giveType = parseInt(this.giveType, 10) >= 0 ? parseInt(this.giveType, 10) : ''
      this.$fetch.post(`fund/fundpresent/queryFundPresentList`, {
        userName : this.giveUserName,
        childUserName: this.giveSourceUserName,
        presentType: giveType,
        pageIndex: pageIndex || this.pageIndex,
        pageSize: 10,
      }).then((res) => {
        this.loadShow = false
        this.list = res.data.page.list
        this.total = res.data.page.totalCount
      })
    },
    search() {
      this.getData()
    },

    getDropDownList() {
      this.$fetch.post(`/public/enumValue`, {
        classPackage: 'FundPresent$PresentTypeEnum',
        flag: true,
        state: 1
      }).then((res) => {
        this.giveTypeEnumList =  res.data.data.PresentTypeEnum
      })
    },
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
