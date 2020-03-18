<template>
  <div class="c-page ui-manage">
    <div class="crumb">
      <span>当前位置：</span>
      <span>配置管理 > </span>
      <span>ui配置管理</span>
    </div>
    <div class="search">
      <div class="search-box">
        <div class="label">图片code：</div>
        <div class="input-wrap"><input type="text" v-model="pictureCode"></div>
      </div>
      <div class="search-box">
        <div class="label labelCom">父级code：</div>
        <div class="input-wrap"><input type="text" v-model="parentCode"></div>
      </div>
      <div class="search-box">
        <div class="label labelCom">版本号：</div>
        <div class="input-wrap"><input type="text" v-model="versionNumber"></div>
      </div>
      <div class="search-box">
        <div class="label">UI所属：</div>
        <div class="input-wrap dropdown-input">
          <el-dropdown trigger="click" @command="dropFN1">
            <span class="el-dropdown-link">
              {{uiBelongsText}}<i class="el-icon-caret-bottom"></i>
            </span>
            <el-dropdown-menu class="dropdown-menu" slot="dropdown">
              <el-dropdown-item :command="item" v-for="(item, index) in uiType" :key="index">{{item.text}}
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>
      <div class="search-box" style="margin-right: 40px">
        <div class="label">状态：</div>
        <div class="input-wrap dropdown-input">
          <el-dropdown trigger="click" @command="dropFN2">
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
      <div class="btns">
        <div class="btn" @click="searchBtn()">查询</div>
        <div class="btn black" @click="clearBtn()">清空</div>
        <div class="btn" @click= "addUi()">新增ui配置</div>
      </div>
    </div>
    <list-wrap :list="list" :total="total" @change="getData">
      <div class="web-table">
        <table>
          <tr class="thead">
            <td style="width: 5%">ID</td>
            <td>图片</td>
            <td>图片code</td>
            <td >父级code</td>
            <td>UI所属</td>
            <td>字体颜色编码</td>
            <td>版本号</td>
            <td style="width: 7%">状态</td>
            <td>图片位置说明文字</td>
            <td>备注</td>
            <td>操作</td>
          </tr>
          <tr v-for="(item,index) in list" :key="index" :loadShow="loadShow">
            <td>{{item.id}}</td>
            <td class="img-b">
              <div class="img-f"><img :src="item.imgUrl"  @error="errorImg(index)" ref="limgc"></div>
            </td>
            <td>{{item.imgCode}}</td>
            <td class="url">{{item.parentCode ? item.parentCode : '-'}}</td>
            <td>{{item.clientType === 1 ? '客户端 ' : '商户端'}}</td>
            <td>{{item.wordColor ? item.wordColor : '-'}}</td>
            <td>{{item.version}}</td>
            <td>{{item.status === 1 ? '启用' : '停用'}}</td>
            <td>{{item.locationRemark ? item.locationRemark : '-'}}</td>
            <td>{{item.remark ? item.remark : '-'}}</td>
            <td>
              <div class="btn-c">
<!--                <span style="margin-right: 10px" @click = "$router.push({path: '/deploy/uiManage/addUiDeploy',query: {flag: 2,id: item.id}})">详情</span>-->
                <span style="margin-right: 10px" @click = "toDetail(item)">详情</span>
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
      return{
        pictureCode: '',
        parentCode: '',
        versionNumber: '',
        uiBelongsText: '全部',
        statusText: '全部',
        uiType: [],
        statusArr: [],
        pageIndex: 1,
        pageSize: 10,
        list: [],
        total: -1,
        loadShow:false,
        clientType: Number,
        status: Number
      }
    },
    created() {
      // this.getType()
      this.getStatus()
    },
    methods: {
      addUi() {
        this.$store.commit('SET_EDIT_FLAG', 1)
        this.$router.push({
          path: '/deploy/uiManage/addUiDeploy',
          query: {
            flag: 1,
          }
        })
      },
      toDetail(item) {
        this.$store.commit('SET_EDIT_FLAG', 2)
        this.$store.commit('SET_EDITID', item.id)
        this.$router.push({
          path: '/deploy/uiManage/addUiDeploy',
          query: {
            flag: 2,
            id: item.id
          }
        })
      },
      errorImg(i) {
        this.$refs.limgc[i].src = require('../../assets/img/empty.png')
      },
      dropFN1(obj) {
        this.uiBelongsText = obj.text
        this.clientType = Number(obj.id)
      },
      dropFN2(obj) {
        this.statusText = obj.text
        this.status = Number(obj.id)
      },
      // 查询
      searchBtn() {
        this.getData(1)
      },
      // 清空
      clearBtn() {
        this.pictureCode = ''
        this.parentCode = ''
        this.versionNumber = ''
        this.uiBelongsText = '全部'
        this.statusText = '全部'
        this.clientType = ''
        this.status = ''
        this.getData(1,10)
      },
      getData(pageIndex,pageSize) {
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
        if (this.pictureCode) {
          formData.imgCode = this.pictureCode
        }
        if (this.parentCode) {
          formData.parentCode = this.parentCode
        }
        if (this.versionNumber) {
          formData.version = this.versionNumber
        }
        if (this.clientType) {
          formData.clientType = this.clientType
        }
        if (this.status) {
          formData.status = this.status
        }
        this.loadShow = true
        this.$fetch.post(`/system/uidynamic/queryUIDynamicList`,formData).then(res => {
          if (res.msg === '成功') {
            this.list =  res.data.page.list
            this.total = res.data.page.totalCount
            this.loadShow = false
          } else {
            this.loadShow = false
          }
        })
      },
      btnStatus (item) {
        let status = ''
        if (item.status === 1) {
          status = 2
        } else if (item.status === 2) {
          status = 1
        }
        this.$fetch.post(`/system/uidynamic/updateStatus`,{
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
      getStatus() {
        this.$fetch.get(`/public/enumValue?classPackage=UIDynamicConfig$ClientTypeEnum;UIDynamicConfig$StatusEnum&flag=true&state=1`).then(res => {
          if (res.msg === '成功') {
            // this.uiType= res.data.data.FunctionAllocationStatusEnum
            this.statusArr = res.data.data.StatusEnum
            this.uiType = res.data.data.ClientTypeEnum
          }
        })
      },
    }
  }
</script>

<style lang="less" scoped>
.search-r{
  margin-right: 50px;
}
.btn-c{
  span{
    cursor: pointer;
    color: #1571cc;
  }
}
@media  (max-width: 1700px){
  .search-box{
    flex-wrap: wrap;
    .search-r{
      margin-top: 30px;
    }
  }
}
.web-table{
  table{
    tr{
      .img-b{
        display: flex;
        justify-content: center;
        align-items: center;
        .img-f{
          display: flex;
          justify-content: center;
          align-items: center;
          width: 33px;
          height: 36px;
          img{
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
