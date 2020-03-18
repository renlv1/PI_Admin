<template>
  <div class="c-page">
    <div class="crumb">
      <span>当前位置：</span>
      <router-link to="">用户交易管理 ></router-link>
      <router-link to="">查询用户优化权值列表</router-link>
    </div>
    <div class="search">
      <div class="search-box">
        <div class="label">ID：</div>
        <div class="input-wrap"><input v-model="id" type="text"></div>
      </div>
      <div class="search-box">
        <div class="label">用户名：</div>
        <div class="input-wrap"><input v-model="userName" type="text"></div>
      </div>
      <div class="search-box">
        <div class="label">下级来源用户：</div>
        <div class="input-wrap"><input v-model="subSourceUser" type="text"></div>
      </div>
      <div class="search-box">
        <div class="label">数据来源用户：</div>
        <div class="input-wrap"><input v-model="dataSourceUser" type="text"></div>
      </div>
      <div class="search-box">
        <div class="label">数据来源类型：</div>
        <div class="input-wrap dropdown-wrap">
          <el-dropdown @command="handleCommand">
            <span class="el-dropdown-link">
              {{changeTypeText || '全部'}}<i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu class="menu" slot="dropdown">
              <el-dropdown-item :command="item" v-for="(item, index) in ChangeTypeEnumList" :key="index">
                {{item.text}}
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>
      <div class="search-box">
        <div class="label">数据源ID：</div>
        <div class="input-wrap"><input v-model="sourceId" type="text"></div>
      </div>
      <div class="search-box">
        <div class="label">创建日期：</div>
        <el-date-picker
          prefix-icon="none"
          clear-icon="none"
          v-model="startTime"
          type="datetime"
          value-format="yyyy-MM-dd HH:mm:ss"
        >
        </el-date-picker>
        <span style="margin-right: 20px">到</span>
        <el-date-picker
          prefix-icon="none"
          clear-icon="none"
          v-model="endTime"
          type="datetime"
          value-format="yyyy-MM-dd HH:mm:ss"
        >
        </el-date-picker>
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
            <td style="width: 7%">ID</td>
            <td>用户名</td>
            <td>下级来源用户</td>
            <td>数据来源用户</td>
            <td>数据源记录ID</td>
            <td>数据来源类型</td>
            <td style="width: 8%">比率</td>
            <td>数据来源合计</td>
            <td>优先权合计</td>
            <td style="width: 13%">创建时间</td>
          </tr>
          <tr v-for="(item, index) in list" :key="index">
            <td>{{item.id}}</td>
            <td>{{item.userName}}</td>
            <td>{{item.nextUserName}}</td>
            <td>{{item.sourceUserName}}</td>
            <td>{{item.sourceId}}</td>
            <td>{{matchType(ChangeTypeEnumList, item.type)}}</td>
            <td>{{item.rate}}</td>
            <td>{{item.sourceAmount}}</td>
            <td>{{item.priorityAmount}}</td>
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
      userName: '',
      subSourceUser: '',
      dataSourceUser: '',

      changeTypeText: '',
      changeType: '',
      ChangeTypeEnumList: [],

      sourceId: '',
      startTime: '',
      endTime: '',
      list: [],
      total: 0,
      pageIndex: 1,
      loadShow: false
    }
  },

  created() {
    this.getDropDownList()
  },
  methods: {

    resetFields() {
      this.id = ''
      this.userName = ''
      this.subSourceUser = ''
      this.dataSourceUser = ''
      this.changeTypeText = '全部'
      this.changeType = -1
      this.sourceId = ''
      this.startTime = ''
      this.endTime = ''
    },

    handleCommand(command) {
      this.changeTypeText = command.text
      this.changeType = command.id
    },
    getData(pageIndex) {
      if (parseInt(this.total) !== 0) {
        this.loadShow = true
        let type = parseInt(this.changeType, 10) >= 0 ? parseInt(this.changeType, 10) : ''
        this.$fetch.post(`oldtrade/userpriority/queryUserPriorityList`, {
          id: this.id,
          userName: this.userName,
          nextUserName: this.subSourceUser,
          sourceUserName: this.dataSourceUser,
          type: type,
          sourceId: this.sourceId,
          startDate: this.startTime,
          endDate: this.endTime,
          pageIndex: pageIndex || this.pageIndex,
          pageSize: 10,
        }).then((res) => {
          this.loadShow = false
          this.list = res.data.page.list
          this.total = res.data.page.totalCount
        })
      }
    },
    getDropDownList() {
      this.$fetch.post(`/public/enumValue`, {
        classPackage: 'UserPriorityRecord$PriorityTypeEnum',
        flag: true,
        state: 1
      }).then((res) => {
        this.ChangeTypeEnumList = res.data.data.PriorityTypeEnum
      })
    },

    getDropDownTypeList() {
      this.$fetch.post(`/public/enumValue`, {
        classPackage: 'Entrust$ETypeEnum',
        flag: true,
        state: 1
      }).then((res) => {
        res.data.data.ETypeEnum && res.data.data.ETypeEnum.forEach((item) => {
          item.type = 1
        })
        this.ChangeTypeEnumList = res.data.data.ETypeEnum

      })
    },

    search() {
      this.total = 1 // hook listWrap组件的loading
      this.getData()
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
      width 140px
      height 25px
    }
    .search-box
      margin-bottom 0
      display flex
      flex-direction row
      align-items center
      .dropdown-wrap
        cursor pointer
        text-align center
        line-height 25px
        min-width: 140px;
        margin-right: 20px;
        background-color #fff
        border: 1px solid #DCDFE6;
        border-radius: 6px;
        padding: 0 10px;
        font-size 15px
        height 25px
    .btns
      margin-top 15px
      .btn
        line-height 25px
        height 25px
        width auto
        padding 0 20px
        cursor pointer
</style>

<style scoped>

  .el-date-editor.el-input {
    width: 180px !important;
    height: 25px !important;
  }

  >>> .el-date-editor.el-input input {
    padding: 0 10px;
    width: 160px;
    height: 25px;
  }
</style>
