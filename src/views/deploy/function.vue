<template>
  <div class="c-page">
    <div class="crumb">
      <span>当前位置：</span>
      <span>配置管理 > </span>
      <span>功能配置管理</span>
    </div>
    <div class="search">
      <div class="search-box">
        <div class="label">功能名称：</div>
        <div class="input-wrap"><input type="text" v-model="nameText"></div>
      </div>
      <div class="search-box">
        <div class="label labelCom">功能状态：</div>
        <div class="record-type" @click="changeState(1)">
          <div class="type-box">
            <div class="fixed-type">{{stateText}}</div>
            <div class="sel-img"><i class="arrowDown" :class="{'active-Img': activeChange}"></i></div>
            <ul class="selectMenu" :class="{'selectMenuActive': activeChange}" @click.stop>
              <li v-for="(item, index) in recordArr" :key="index" @click="chooseState(item.text,1,index)">
                {{item.text}}
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div class="search-box" style="margin-right: 60px">
        <div class="label labelCom">功能类型：</div>
        <div class="record-type" @click="changeState(2)">
          <div class="type-box">
            <div class="fixed-type">{{typeText}}</div>
            <div class="sel-img"><i class="arrowDown" :class="{'active-Img': activeChange2}"></i></div>
            <ul class="selectMenu" :class="{'selectMenuActive': activeChange2}" @click.stop>
              <li v-for="(item, index) in typeArr" :key="index" @click="chooseState(item.text,2,index)">{{item.text}}
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div class="btns">
        <div class="btn" @click="searchBtn()">查询</div>
        <div class="btn black" @click="clearBtn()">清空</div>
        <div class="btn " @click="$router.push({path: '/deploy/function/addFunction',query: {flag : 1}})">新增功能</div>
        <div class="btn " @click="$router.push('/deploy/function/packManage')">压缩包管理</div>
      </div>
    </div>
    <list-wrap :list="list" :total="total" @change="getData" :pageSize="pageSize">
      <div class="web-table">
        <table>
          <tr class="thead">
            <td style="width: 5%">ID</td>
            <td>功能图片</td>
            <td>功能名称</td>
            <td style="width: 200px">功能访问url</td>
            <td>功能状态</td>
            <td>创建时间</td>
            <td>功能类型</td>
            <td>所在页面</td>
            <td>页面位置</td>
            <td>语种</td>
            <td>屏蔽用户</td>
            <td>操作</td>
          </tr>
          <tr v-for="(item,index) in list" :key="index">
            <td>{{item.id}}</td>
            <td class="img-b">
              <div class="img-f"><img :src="item.functionImage" @error="errorImg(index)" ref="image"></div>
            </td>
            <td>{{funName(item.functionName)}}</td>
            <td class="url" style="width: 200px">{{funUrl(item.functionUrl)}}</td>
            <td>{{item.status === 1 ? '正常' : '隐藏'}}</td>
            <td>{{item.createAt | time}}</td>
            <td>{{functionTy(item.functionType)}}</td>
            <td>{{location(item.location)}}</td>
            <td>{{pageLocation(item.pageLocation) }}</td>
            <td>{{item.languages ? item.languages : '-'}}</td>
            <td>{{item.hideUserId ? item.hideUserId : '-'}}</td>
            <td>
              <div class="btn-c">
                <span style="margin-right: 10px"
                      @click="$router.push({path: '/deploy/function/addFunction',query: {flag : 2,id: item.id}})">修改</span>
                <span @click="btnStatus(item)">{{item.status === 1 ? '不启用' : '启用'}}</span>
              </div>
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
      nameText: '',
      stateText: '全部',
      typeText: '全部',
      activeChange: false,
      activeChange2: false,
      recordArr: [],
      typeArr: [],
      list: [],
      status: '',
      functionType: '',
      pageIndex: 1,
      pageSize: 10,
      total: -1,
      searchFlag: false,
      loadShow: false
    }
  },
  created() {
    this.getType()
    // this.getData(1)
  },
  methods: {
    funUrl(url) {
      if (url) {
        if (url.trim() == '') return '-'
        return url
      }
      return '-'
    },
    funName(m) {
      if (m) {
        if (m.trim() == '') return '-'
        return m
      }
      return '-'
    },
    btnStatus(item) {
      let status = ''
      if (item.status === 1) {
        status = 2
      } else if (item.status === 2) {
        status = 1
      }
      this.$fetch.post(`/system/function/updateStatus`, {
        id: item.id,
        status: status
      }).then(res => {
        if (res.msg === '成功') {
          Dialog({
            title: '操作成功',
            okFn: () => {
              this.getData(1)
            }
          })
        }
      })
    },
    functionTy(t) {
      if (t === 1) return '客户'
      if (t === 2) return '商户'
      return '-'
    },
    pageLocation(p) {
      if (p === 1) return '头部'
      if (p === 2) return '中部'
      return '-'
    },
    location(l) {
      if (l === 1) return '工具'
      if (l === 2) return '我的'
      return '-'
    },
    getType() {
      this.$fetch.get(`/public/enumValue?classPackage=FunctionAllocation$FunctionAllocationStatusEnum;FunctionAllocation$FunctionAllocationTypeEnum&flag=true&state=1`).then(res => {
        if (res.msg === '成功') {
          this.recordArr = res.data.data.FunctionAllocationStatusEnum
          this.typeArr = res.data.data.FunctionAllocationTypeEnum
        }
      })
    },
    errorImg(i) {
      console.log(i)
      this.$refs.image[i].src = require('../../assets/img/empty.png')
    },
    changeState(i) {
      if (i === 1) {
        this.activeChange = !this.activeChange
        this.activeChange2 = false
      } else if (i === 2) {
        this.activeChange2 = !this.activeChange2
        this.activeChange = false
      }
    },
    chooseState(item, num, index) {
      if (num === 1) {
        this.stateText = item
        this.activeChange = false
        this.status = index
      } else if (num === 2) {
        this.typeText = item
        this.activeChange2 = false
        this.functionType = index
      }
    },
    // 清空
    clearBtn() {
      this.list = []
      this.nameText = ''
      this.functionType = ''
      this.status = ''
      this.stateText = '全部'
      this.typeText = '全部'
      this.getData(1)
    },
    // 查询
    searchBtn() {
      this.list = []
      this.getData(1)
    },
    getData(pageIndex, pageSize) {
      let formData = {}
      if (pageIndex) {
        formData.pageIndex = pageIndex
      } else {
        formData.pageIndex = this.pageIndex
      }
      if (pageSize) {
        formData.pageSize = pageSize
      } else {
        formData.pageSize = this.pageSize
      }
      if (this.nameText) {
        formData.functionName = this.nameText
      }
      if (this.status) {
        formData.status = this.status
      }
      if (this.functionType) {
        formData.functionType = this.functionType
      }
      this.loadShow = true
      this.$fetch.post(`/system/function/queryFunctionList`, formData).then(res => {
        if (res.msg === '成功') {
          this.loadShow = false
          this.list = res.data.page.list
          this.total = res.data.page.totalCount
        }
      })
    },
  }
}
</script>

<style lang="less" scoped>
  .record-type {
    cursor: pointer;
    user-select: none;
    width: 140px;
    height: 25px;
    border: 1px solid #d9d9d9;
    border-radius: 4px;
    line-height: 25px;
    font-size: 18px;
    color: #010101;
    background: #fff;
    position: relative;
    .type-box {
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      .fixed-type {
        font-size: 12px;
        height: 100%;
        margin-right: 5px;
        /*padding-left: 20px;*/
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
      .sel-img {
        /*top: 50%;*/
        /*left: 60%;*/
        /*transform: translate(-50%,-50%);*/
        /*right: 0;*/
        /*position: absolute;*/
        display: flex;
        justify-content: center;
        align-items: center;
        transition: all .5s;
        .arrowDown {
          display: inline-block;
          width: 8px;
          height: 5px;
          background: url("../../assets/img/pull.png") no-repeat;
          background-position: center;
          background-size: cover !important;
          &.active-Img {
            transform: rotate(180deg);
          }
        }
      }
      .selectMenu {
        border: 1px solid #d9d9d9;
        border-radius: 4px;
        display: none;
        transition: all .3s linear;
        background: #fff;
        padding-left: 20px;
        position: absolute;
        top: 39px;
        width: 100%;
        height: 0;
        verflow-y: hidden;
        z-index: 99;
        box-shadow: 0 2px 2px rgba(153, 153, 153, .2);
        &.selectMenuActive {
          display: block;
          height: auto;
        }
        li {
          height: 30px;
          line-height: 30px;
          font-size: 12px;
          color: #999;
          &:hover {
            color: #1a1a1a;
          }
        }
      }
    }
  }

  .btn-c {
    span {
      cursor: pointer;
      color: #1571cc;
    }
  }

  .web-table {
    table {
      tr {
        .img-b {
          display: flex;
          justify-content: center;
          align-items: center;
          .img-f {
            display: flex;
            justify-content: center;
            align-items: center;
            width: 33px;
            height: 36px;
            img {
              max-width: 33px;
              max-height: 36px;
            }
          }
        }
      }
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
        cursor pointer
</style>

<style scoped>
  input {
    width: 130px !important;
    height: 25px !important;
  }

  .menu {
    display: flex;
    flex-direction: column;
    height: 300px !important;
    overflow-y: auto;
  }

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
