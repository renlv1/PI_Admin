<template>
  <div class="c-page">
    <div class="crumb">
      <span>当前位置：</span>
      <router-link to="">用户交易管理 ></router-link>
      <router-link to="">查询委托合并列表</router-link>
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
        <div class="label">原委托记录ID：</div>
        <div class="input-wrap"><input v-model="originId" type="text"></div>
      </div>
      <div class="search-box">
        <div class="label">类型：</div>
        <div class="input-wrap dropdown-wrap">
          <el-dropdown @command="handleCommand">
            <span class="el-dropdown-link">
              {{changeText || '全部'}}<i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu class="menu" slot="dropdown">
              <el-dropdown-item :command="item" v-for="(item, index) in ChangeTypeEnumList" :key="index">{{item.text}}
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>
      <div class="search-box">
        <div class="label">创建时间：</div>
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
      <div class="btns" style="margin-right: 20px">
        <div class="btn" @click="search">查询</div>
        <div class="btn black" @click="resetFields()">清空</div>
      </div>
    </div>
    <list-wrap :list="list" :total="total" @change="getData">
      <div class="web-table">
        <table>
          <tr class="thead">
            <td style="width: 7%">ID</td>
            <td>用户名字</td>
            <td style="width: 18%">用户地址</td>
            <td style="width: 7%">类型</td>
            <td>委托价格</td>
            <td>委托数量</td>
            <td>原委托记录ID</td>
            <td>原委托金额</td>
            <td>原委托现金金额</td>
            <td style="width: 12%">创建时间</td>
          </tr>
          <tr v-for="(item, index) in list" :key="index">
            <td>{{item.id}}</td>
            <td>{{item.userName}}</td>
            <td>{{item.address}}</td>
            <td>{{matchType(ChangeTypeEnumList, item.etype)}}</td>
            <td>{{item.price}}</td>
            <td>{{item.amount}}</td>
            <td>{{item.oldId}}</td>
            <td>{{item.oldAmount}}</td>
            <td>{{item.oldCashAmount}}</td>
            <td>{{item.createAt | time}}</td>
          </tr>
          <div style="z-index: 9999" class="web-loading1" v-show="loadShow">
            <img src="~@img/loading.gif"/>
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
      originId: '',
      changeText: '',
      changeType: '',
      ChangeTypeEnumList: [],
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
      this.originId = ''
      this.changeText = '全部'
      this.changeType = -1
      this.startTime = ''
      this.endTime = ''
    },

    handleCommand(command) {
      this.changeText = command.text
      this.changeType = command.id
    },
    getData(pageIndex) {
      if (parseInt(this.total) !== 0) {
        this.loadShow = true
        let state = parseInt(this.changeType, 10) >= 0 ? parseInt(this.changeType, 10) : ''
        this.$fetch.post(`oldtrade/entrust/queryEntrustMergeList`, {
          id: this.id,
          userName: this.userName,
          oldId: this.originId,
          etype: state,
          startCreateAt: this.startTime,
          endCreateAt: this.endTime,
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
        classPackage: 'EntrustMerge$EntrustMergeETypeEnum',
        flag: true,
        state: 1
      }).then((res) => {
        this.ChangeTypeEnumList = res.data.data.EntrustMergeETypeEnum
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

  .el-date-editor.el-input  {
    width: 180px !important;
    height: 25px !important;
  }
  >>>.el-date-editor.el-input input {
    padding: 0 10px;
    width: 160px;
    height: 25px;
  }
</style>
