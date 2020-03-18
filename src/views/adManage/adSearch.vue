<template>
  <div class="c-page">
    <div class="crumb">
      <span>当前位置：</span>
      <router-link to="">广告位管理 ></router-link>
      <router-link to="">广告位查询</router-link>
    </div>
    <div class="search">
      <div class="search-box">
        <div class="label">ID：</div>
        <div class="input-wrap"><input v-model="id" type="text"></div>
      </div>
      <div class="search-box">
        <div class="label">广告期数：</div>
        <div class="input-wrap"><input v-model="period" type="text"></div>
      </div>
      <div class="search-box">
        <div class="label">广告位置：</div>
        <div class="input-wrap dropdown-wrap">
          <el-dropdown @command="handleCommand">
            <span class="el-dropdown-link">
              {{positionTypeText || '全部'}}<i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu class="menu" slot="dropdown">
              <el-dropdown-item :command="item" v-for="(item, index) in positionTypeEnumList" :key="index">{{item.text}}
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>
      <div class="btns">
        <div class="btn" @click="search">查询</div>
        <div class="btn red" @click="$router.push('/adManage/editAd')">新增</div>
        <div class="btn black" @click="resetFields">清空</div>
      </div>
    </div>
    <list-wrap :list="list" :total="total" @change="getData">
      <div class="web-table">
        <table>
          <tr class="thead">
            <td>ID</td>
            <td>起拍价格（π）</td>
            <td>每次加价金额</td>
            <td>广告位置</td>
            <td>广告期数</td>
            <td>竞价开始时间</td>
            <td>竞价结束时间</td>
            <td>投放开始时间</td>
            <td>投放结束时间</td>
            <td>操作</td>
          </tr>
          <tr v-for="(item, index) in list" :key="index">
            <td>{{item.id}}</td>
            <td>{{item.amount || 0}}</td>
            <td>{{item.everyRise}}</td>
            <td>{{matchType(positionTypeEnumList, item.station)}}</td>
            <td>{{item.period}}</td>
            <td>{{item.bidStartAt}}</td>
            <td>{{item.bidEndAt}}</td>
            <td>{{item.putStartAt}}</td>
            <td>{{item.putEndAt}}</td>
            <td style="color: #1571cc; cursor: pointer" @click="$router.push({
               path: '/adManage/editAd',
               query: {
                 obj: JSON.stringify(item)
               }
             })">编辑
            </td>
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
      period: '',
      list: [],
      total: 0,
      pageIndex: 1,
      loadShow: false,

      positionTypeText: '',
      positionType: '',
      positionTypeEnumList: [],
    }
  },
  created() {
    this.getDropDownList()
  },
  methods: {

    resetFields() {
      this.id = ''
      this.period = ''
      this.positionTypeText = '全部'
      this.positionType = -1
    },

    handleCommand(command) {
      this.positionTypeText = command.text
      this.positionType = command.id
    },

    getData(pageIndex) {
      this.loadShow = true
      let positionType = parseInt(this.positionType, 10) >= 0 ? parseInt(this.positionType, 10) : ''
      this.$fetch.post(`advertise/advertiseRecord/queryAdvertiseRecordList`, {
        id: this.id,
        period: this.period,
        station: positionType,
        pageIndex: pageIndex || this.pageIndex,
        pageSize: 10,
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
      this.$fetch.post(`/public/enumValue`, {
        classPackage: 'AdvertiseRecord$StationEnum',
        flag: true,
        state: 1
      }).then((res) => {
        this.positionTypeEnumList = res.data.data.StationEnum
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

  >>> .el-date-editor .el-input__inner {
    padding: 0 10px !important;
    width: 130px !important;
    height: 25px !important;
  }
</style>
