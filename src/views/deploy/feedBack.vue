<template>
  <div class="feed-back c-page">
    <div class="crumb">
      <span>当前位置：</span>
      <span>配置管理 > </span>
      <span>反馈信息管理</span>
    </div>
    <div class="search">
      <div class="search-box">
        <div class="label">用户名：</div>
        <div class="input-wrap"><input type="text" v-model="userName"></div>
      </div>
      <div class="search-box">
        <div class="label">处理人：</div>
        <div class="input-wrap"><input type="text" v-model="systemName"></div>
      </div>
      <div class="search-box">
        <div class="label">内容：</div>
        <div class="input-wrap"><input type="text" v-model="content"></div>
      </div>
      <div class="search-box">
        <div class="label">状态：</div>
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
        <div class="label">创建时间：</div>
        <el-date-picker
          v-model="startDate"
          :picker-options="pickerBeginDateBefore"
          format="yyyy-MM-dd"
          prefix-icon="none"
          clear-icon="none"
          type="date">
        </el-date-picker>
        <span style="margin-right: 20px">到</span>
        <el-date-picker
          :picker-options="pickerBeginDateAfter"
          format="yyyy-MM-dd"
          prefix-icon="none"
          clear-icon="none"
          v-model="endDate"
          type="date">
        </el-date-picker>
      </div>
      <div class="btns">
        <div class="btn" @click="searchBtn()">查询</div>
        <div class="btn black" @click="clearBtn()">清空</div>
        <div class="btn" @click="finishBtn()">完成处理</div>
      </div>
    </div>
    <list-wrap :list="list" :total="total" @change="getData" :pageSize="pageSize">
      <div class="web-table">
        <table>
          <tr class="thead">
            <td style="width: 5%">
              <div class="checkone-check" :class="{'isChecked': checkAllFlag === true}" @click="checkAllList"></div>
            </td>
            <td>ID</td>
            <td style="width: 8%">用户名</td>
            <td style="width: 8%">反馈内容</td>
            <td>创建时间</td>
            <td>更新时间</td>
            <td>状态</td>
            <td>处理人</td>
            <td style="width: 7%">操作</td>
          </tr>
          <tr v-for="(item,index) in list" :key="index" :loadShow="loadShow">
            <td>
              <div class="checkone-check" :class="{'isChecked': item.checkFlag === true}" @click="checkOne(item)"></div>
            </td>
            <td>{{item.id}}</td>
            <td class="img-b">{{item.userName}}</td>
            <td class="cont">{{item.content}}</td>
            <td class="url">{{$changeDate(item.createAt, '-')}}</td>
            <td>{{$changeDate(item.updateAt, '-')}}</td>
            <td>{{item.statusStr}}</td>
            <td>{{item.sysName ? item.sysName : '-'}}</td>
            <td class="det" @click="$router.push({path: '/deploy/feedBack/feedBackDetail',query: {id: item.id}})">详情
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
import Dialog from '@/components/dialog/dialog'

export default {
  data() {
    return {
      pageSize: 10,
      isCheckArr: [],
      checkAllFlag: false,
      statusText: '全部',
      statusArr: [],
      userName: '',
      systemName: '',
      content: '',
      startDate: '',
      endDate: '',
      list: [],
      total: -1,
      pageIndex: 1,
      loadShow: false,
      status: '',
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
    }
  },
  created() {
    this.getType()
  },
  methods: {
    // 全部
    checkAllList() {
      this.checkAllFlag = !this.checkAllFlag
      this.list.forEach(item => {
        if (this.checkAllFlag === true) {
          item.checkFlag = true
          this.isCheckArr.push(item.id)
        } else {
          item.checkFlag = false
          this.isCheckArr = []
        }
      })
    },
    // 单选
    checkOne(item) {
      if (item.status === 1) {
        item.checkFlag = !item.checkFlag
        let idIndex = this.isCheckArr.indexOf(item.id)
        if (idIndex >= 0) { // 如果已经包含就去除
          this.isCheckArr.splice(idIndex, 1)
        } else { // 如果没有包含就添加
          this.isCheckArr.push(item.id)
        }
        // let leng = 0
        if (this.isCheckArr.length === this.list.length) {
          this.checkAllFlag = true
        } else {
          this.checkAllFlag = false
        }
      }
    },
    dropFN1(obj) {
      this.statusText = obj.text
      this.status = Number(obj.id)
    },
    clearBtn() {
      this.userName = ''
      this.systemName = ''
      this.content = ''
      this.startDate = ''
      this.endDate = ''
      this.status = ''
      this.statusText = '全部'
      this.getData(1)
    },
    searchBtn() {
      this.getData(1)
    },
    // 完成处理
    finishBtn() {
      if (this.isCheckArr.length === 0) {
        this.$message.error('请选择一条记录')
        return
      }
      this.$store.commit('SET_LOADING', true)
      let ids = this.isCheckArr.join(',')
      this.$fetch.post(`/system/feedBack/finishFeedBack`, {
        ids: ids
      }).then(res => {
        if (res.code === 0) {
          this.$store.commit('SET_LOADING', false)
          Dialog({
            title: res.msg,
            okFn: () => {
              this.getData(this.pageIndex)
            }
          })
        }
      })
    },
    getData(pageIndex, pageSize) {
      let formData = {}
      if (pageIndex) {
        formData.pageIndex = pageIndex
        this.pageIndex = pageIndex
      } else {
        formData.pageIndex = this.pageIndex
      }
      if (pageSize) {
        formData.pageSize = pageSize
      } else {
        formData.pageSize = 10
      }
      if (this.userName) {
        formData.userName = this.userName
      }
      if (this.systemName) {
        formData.sysName = this.systemName
      }
      if (this.content) {
        formData.content = this.content
      }
      if (this.status) {
        formData.status = this.status
      }
      if (this.startDate) {
        formData.startCreateAt = this.$changeDate(this.startDate, '-', 2)
      }
      if (this.endDate) {
        formData.endCreateAt = this.$changeDate(this.endDate, '-', 3)
      }
      this.loadShow = true
      this.$fetch.post(`/system/feedBack/queryFeedBackList`, formData).then(res => {
        if (res.msg === '成功') {
          let list = res.data.page.list
          list.forEach(item => {
            item.checkFlag = false
          })
          this.checkAllFlag = false
          this.list = list
          this.total = res.data.page.totalCount
          this.loadShow = false
        } else {
          this.loadShow = false
        }
      })
    },
    getType() {
      this.$fetch.get(`/public/enumValue?classPackage=Feedback$StateEnum&flag=true&state=1`).then(res => {
        if (res.code === 0) {
          this.statusArr = res.data.data.StateEnum
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
  .search-c {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    @media screen and (max-width: 1700px) {
      margin-bottom: 30px;
    }
    @media screen and (max-width: 1600px) {
      margin-bottom: 0;
    }
  }

  .search-l {
    width: 100%;
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    .search-box {
      margin-top: 30px;
      margin-right: 20px;
      display: flex;
      flex-direction: row;
      align-items: center;
    }
  }

  .search-r {
    display: flex;
    justify-content: flex-end;
    margin-right: 180px;
    .btn {
      cursor: pointer;
      font-size: 12px;
      color: #fff;
      width: 80px;
      height: 24px;
      border-radius: 4px;
      background: #1571cc;
      line-height: 24px;
      text-align: center;
      margin-right: 10px;
      &:last-child {
        margin-right: 0;
      }
      &.black {
        background: #474747;
      }
    }
  }

  .input-item {
    margin-left: 130px;
    float: left;
    display: flex;
    align-items: center;
    @media screen and (max-width: 1600px) {
      margin-top: 30px;
      margin-left: 0;
    }
    &.btn-ctrl-w {
      float: right;
    }
    .margin {
      margin: 0 10px;
    }
    .input-wrap {
      display: flex;
      flex-direction: row;
      align-items: center;
      /deep/ .el-date-editor {
        width: 140px;
        input {
          width: 130px;
          height: 25px;
          border-radius: 4px;
          padding: 0 30px;
        }
        .el-input__icon {
          line-height: 27px;
        }
      }
      input {
        width: 130px;
        height: 24px;
        padding: 0 10px;
        font-size: 14px;
        color: #474747;
        border-radius: 4px;
      }
    }
    .dropdown-input {
      min-width: 130px;
      padding: 0 10px;
      height: 25px;
      text-align: center;
      border: 1px solid #aaa;
      border-radius: 6px;
      cursor: pointer;
      .el-dropdown {
        width: 100%;
        /deep/ .el-dropdown-link {
          width: 100%;
          height: 25px;
          line-height: 25px;
          display: block;
        }
      }
    }
    .btn-ctrl {
      width: 80px;
      height: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 4px;
      background-color: #1571cc;
      color: #fff;
      font-size: 14px;
      cursor: pointer;
      &.btn-empty {
        background-color: #474747;
        margin: 0 10px;
      }
      &.transfer-btn {
        width: 100px;
        &:last-child {
          margin-left: 10px;
        }
      }
    }
  }

  .det {
    cursor: pointer;
    color: #1571cc;
  }

  .checkone-check {
    margin: 0 auto;
    width: 14px;
    height: 14px;
    background-color: #fff;
    border: 1px solid #dcdfe6;
    border-radius: 2px;
    cursor: pointer;
    position: relative;
    &::before {
      -webkit-box-sizing: content-box;
      box-sizing: content-box;
      content: "";
      border: 1px solid #fff;
      border-left: 0;
      border-top: 0;
      height: 7px;
      left: 5px;
      position: absolute;
      top: 1px;
      transform: rotate(45deg) scaleY(0);
      width: 3px;
      -webkit-transition: -webkit-transform .15s ease-in .05s;
      transition: -webkit-transform .15s ease-in .05s;
      transition: transform .15s ease-in .05s, -webkit-transform .15s ease-in .05s;
      -webkit-transform-origin: center;
      transform-origin: center;
    }
    &.isChecked {
      background-color: #409EFF;
      border-color: #409EFF;
      &::before {
        transform: rotate(45deg) scaleY(1);
      }
    }
    &.no-CheckBox {
      background-color: #edf2fc;
      cursor: not-allowed;
    }
  }

  .cont {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
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
      display flex
      flex-direction row
      align-items center
      margin-right 20px
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
