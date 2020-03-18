<template>
  <div class="c-page mar-right">
    <div class="crumb">
      <span>当前位置：</span>
      <router-link to="">用户交易管理 ></router-link>
      <router-link to="">用户管理</router-link>
    </div>
    <div class="search">
      <div class="search-box">
        <div class="label">用户名：</div>
        <div class="input-wrap"><input v-model="userName" type="text"></div>
      </div>
      <div class="search-box">
        <div class="label">账户地址：</div>
        <div class="input-wrap"><input v-model="accountAddress" type="text"></div>
      </div>
      <div class="search-box">
        <div class="label">上级地址：</div>
        <div class="input-wrap"><input v-model="upAddress" type="text"></div>
      </div>
      <div class="search-box">
        <div class="label">手机号：</div>
        <div class="input-wrap"><input v-model="phoneNum" type="text"></div>
      </div>
      <div class="search-box">
        <div class="label">邮箱：</div>
        <div class="input-wrap"><input v-model="email" type="text"></div>
      </div>
      <div class="search-box">
        <div class="label">昵称：</div>
        <div class="input-wrap"><input v-model="nickName" type="text"></div>
      </div>
      <div class="search-box">
        <div class="label">注册时间：</div>
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
      <div class="search-box">
        <div class="label">openId：</div>
        <div class="input-wrap"><input v-model="openId" type="text"></div>
      </div>
      <div class="search-box">
        <div class="label">账号状态：</div>
        <div class="input-wrap dropdown-wrap">
          <el-dropdown @command="handleCommand">
            <span class="el-dropdown-link">
              {{$userStatus2Text(parseInt(status, 10), 1) || '全部'}}<i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu class="menu" slot="dropdown">
              <el-dropdown-item command="">全部</el-dropdown-item>
              <el-dropdown-item command="0">注册冻结</el-dropdown-item>
              <el-dropdown-item command="1">正常</el-dropdown-item>
              <el-dropdown-item command="2">冻结中</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>
      <div class="f1"></div>
      <div class="btns">
        <div class="btn" @click="search">查询</div>
        <div @click="resetFields()" class="btn black">清空</div>
      </div>
    </div>
    <list-wrap :list="list" :total="total" @change="getData">
      <div class="web-table">
        <table class="center">
          <tr class="thead">
            <td width="6%">ID</td>
            <td>用户名</td>
            <td>昵称</td>
            <td width="15%">账户地址</td>
            <td>手机号</td>
            <td>邮箱</td>
            <td width="15%">上级地址</td>
            <td>来源</td>
            <td>状态</td>
            <td>注册时间</td>
            <td width="10%">操作</td>
          </tr>
          <tr v-for="(item, index) in list" :key="index">
            <td>{{item.id}}</td>
            <td>{{item.username}}</td>
            <td>{{item.nickname || '-'}}</td>
            <td>{{item.address}}</td>
            <td v-if="item.mobile">+{{item.phoheCode || '86'}} {{item.mobile}}</td>
            <td v-else>-</td>
            <td>{{item.email || '-'}}</td>
            <td>{{item.ref || '-'}}</td>
            <td>{{$userStatus2Text(item.userSource, 2)}}</td>
            <td @click="showFreezeDialog = true, pageIndex = 1, userAddress = item.address, dialogName = item.username"
                class="cblue pointer"
                v-if="item.status == 2">
              {{$userStatus2Text(item.status, 1)}}<span>(详情)</span>
            </td>
            <td v-else>{{$userStatus2Text(item.status, 1)}}</td>
            <td>{{item.createAt | time}}</td>
            <td>
              <span @click="$router.push({
                path: '/user/userDetail',
                query: {
                  userAddress: item.address
                }
              })" style="cursor: pointer; margin-right: 10px" class="cblue">查看详情</span>
              <span @click="operating(item)" class="cblue"
                    style="cursor: pointer;">{{parseInt(item.status, 10) === 1 ? '冻结' : '解冻'}}</span>
            </td>
          </tr>
          <div style="z-index: 9999" class="web-loading1" v-show="loadShow">
            <img src="~@img/loading.gif" />
          </div>
        </table>
      </div>
    </list-wrap>
    <el-dialog type="text" :visible.sync="showFreezeDialog">
      <list-wrap class="freezeListWrap" ref="freezeListWrap" :pageSize="5" :list="freezeList" :total="freezeTotal" @change="getFreezeData">
        <div style="font-weight: bold; font-size: 16px">{{dialogName}} 冻结记录</div>
        <table style="margin-top:30px; padding: 0; min-height: auto;" class="web-table">
          <tr class="thead">
            <td>记录ID</td>
            <td>操作人</td>
            <td>操作来源</td>
            <td>操作类型</td>
            <td>原因</td>
            <td>操作时间</td>
          </tr>
          <tr v-for="(item, index) in freezeList" :key="index">
            <td>{{item.id}}</td>
            <td>{{item.operateName}}</td>
            <td>{{item.operateSource == 1 ? '管理平台' : '客户端'}}</td>
            <td>{{item.operateType == 1 ? '冻结' : '解冻'}}</td>
            <td>{{item.reason}}</td>
            <td>{{item.createAt}}</td>
          </tr>
        </table>
      </list-wrap>
    </el-dialog>
    <el-dialog width="30%" :visible.sync="showDialog" center>
      <div style="text-align: center; font-size: 16px; margin-bottom: 40px">{{parseInt(freezeFlag, 10) === 1 ? '冻结' :
        '解冻'}}用户
      </div>
      <textarea style="width: 100%; height: 240px" v-model="reason" v-if="parseInt(freezeFlag, 10) === 1"
                placeholder='请输入冻结原因'></textarea>
      <textarea style="width: 100%; height: 240px" v-model="reason" v-else placeholder='请输入解冻原因'></textarea>
      <div class="btns" style="margin-top: 30px">
        <div class="btn" @click="sure">确定</div>
        <div class="btn black" @click="showDialog = false">关闭</div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Dialog from '@/components/dialog/dialog'
export default {
  data() {
    return {
      userName: '',
      accountAddress: '',
      upAddress: '',
      phoneNum: '',
      email: '',
      nickName: '',
      startTime: '',
      endTime: '',
      openId: '',
      accountStatus: '',
      status: '',
      list: [],
      total: 0,
      pageIndex: 1,
      loadShow: false,
      showDialog: false,
      showFreezeDialog: false,
      freezeFlag: 1,
      userId: '',
      reason: '',
      freezeList: [],
      freezeTotal: 0,
      userAddress: '',
      dialogName: ''

    }
  },
  methods: {
    resetFields() {
      this.userName = ''
      this.accountAddress = ''
      this.upAddress = ''
      this.phoneNum = ''
      this.email = ''
      this.nickName = ''
      this.startTime = ''
      this.endTime = ''
    },
    handleCommand(command) {
      this.status = command
    },

    getFreezeData(pageIndex) {
      this.loadShow = true
      this.$fetch.post('user/user/queryUserUnlockReasonList', {
        userAddress: this.userAddress,
        pageIndex: pageIndex || this.pageIndex,
        pageSize: 5,
      }).then((res) => {
        this.loadShow = false
        this.freezeList = res.data.page.list
        this.freezeTotal = res.data.page.totalCount
      })
    },

    operating(item) {
      if (item.status == 1) {
        // 冻结
        this.userId = item.id
        this.freezeFlag = item.status
        this.showDialog = true
      } else {
        // 解冻
        Dialog({
          title: `确定是否解冻${item.username}用户？`,
          okFn: () => {
            this.$fetch.post('/user/user/lockOrUnlockUser', {
              userId: item.id,
              status: 1,
            }).then((res) => {
              if (res.code == 0) {
                this.$message.success(res.msg)
              }
            })
          }
        })
      }
    },

    getData(pageIndex) {
      if (parseInt(this.total) !== 0) {
        this.loadShow = true
        this.$fetch.post('/user/user/queryUserList', {
          username: this.userName,
          address: this.accountAddress,
          ref: this.upAddress,
          mobile: this.phoneNum,
          email: this.email,
          nickname: this.nickname,
          startCreateAt: this.startTime,
          endCreateAt: this.endTime,
          status: this.status,
          openId: this.openId,
          pageIndex: pageIndex || this.pageIndex,
          pageSize: 10,
        }).then((res) => {
          this.loadShow = false
          this.list = res.data.page.list
          this.total = res.data.page.totalCount
        })
      }
    },
    sure() {
      if (this.reason !== '') {
        let status = parseInt(this.freezeFlag, 10) === 1 ? 2 : 1
        this.$fetch.post('/user/user/lockOrUnlockUser', {
          userId: this.userId,
          status: status,
          userUnlockReason: this.reason
        }).then((res) => {
          if (res.code == 0) {
            this.showDialog = false
            this.$message.success(res.msg)
          }
        })
      } else {
        this.$message.error('原因不能为空')
      }
    },

    search() {
      this.total = 1 // hook listWrap组件的loading
      this.getData()
    },
  },

}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  .search
    position relative
    display flex
    flex-direction row
    flex-wrap wrap
    .search-box
      margin-top 30px
      margin-bottom 0
      display flex
      flex-direction row
      align-items center
      .dropdown-wrap
        cursor pointer
        text-align center
        line-height 40px
        width: 180px;
        margin-right: 20px;
        background-color #fff
        border: 1px solid #DCDFE6;
        border-radius: 6px;
        padding: 0 10px;
        font-size 15px
        height: 40px;
    .btns
      margin-top 30px
      margin-right 50px
      .btn
        cursor pointer
</style>

<style scoped>
  >>>.freezeListWrap .empty {
    top: 20px;
  }

  /*>>>.el-date-editor.el-input, .el-date-editor.el-input__inner {*/
    /*padding: 0 10px !important;*/
    /*margin-right: 20px !important;*/
    /*width: 130px !important;*/
    /*height: 25px;*/
  /*}*/

  >>> .el-dialog {
    margin: 0 auto;
    width: 80%;
    box-shadow: none;
  }

  >>> .el-dialog .el-dialog__headerbtn {
    top: 20px;
    right: 15px;
  }

  >>> .el-dialog .el-dialog__headerbtn .el-icon-close:before {
    border: 2px solid #ccc;
    border-radius: 100%;
  }

  /*>>> .el-date-editor .el-input__inner {*/
    /*padding: 0 10px !important;*/
  /*}*/

  textarea {
    font-size: 14px;
    padding: 16px 0 0 18px;
    color: #000;
  }

  textarea::-webkit-input-placeholder {
    color: #b3b3b3;
  }

  .input:-moz-placeholder {
    color: #b3b3b3;
  }

  .input:-ms-input-placeholder {
    color: #b3b3b3;
  }
</style>
