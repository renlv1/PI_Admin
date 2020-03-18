<template>
  <div class="transaction-list">
    <!--转账记录管理-->
    <div class="crumb">
      <span>当前位置：</span>
      <span>广告位管理 > </span>
      <span>广告位模板查询</span>
    </div>
    <div class="search clearfix">
      <div class="input-item">
        <div class="label">ID：</div>
        <div class="input-wrap"><input type="text" v-model.trim="userId"></div>
      </div>
      <div class="input-item">
        <div class="label">广告位置：</div>
        <div class="input-wrap dropdown-input">
          <el-dropdown trigger="click" @command="dropFN1">
            <span class="el-dropdown-link">
              {{StationEnumText}}<i class="el-icon-caret-bottom"></i>
            </span>
            <el-dropdown-menu class="dropdown-menu" slot="dropdown">
              <el-dropdown-item :command="item" v-for="(item, index) in StationEnum" :key="index">{{item.text}}
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>
      <div class="input-item">
        <div class="label">状态：</div>
        <div class="input-wrap dropdown-input">
          <el-dropdown trigger="click" @command="dropFN2">
            <span class="el-dropdown-link">
              {{StatusEnumText}}<i class="el-icon-caret-bottom"></i>
            </span>
            <el-dropdown-menu class="dropdown-menu" slot="dropdown">
              <el-dropdown-item :command="item" v-for="(item, index) in StatusEnum" :key="index">{{item.text}}
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>
      <div class="input-item">
        <div class="btn-ctrl" @click="getData(1)">查询</div>
        <div class="btn-ctrl btn-empty" @click="emptyFn">清空</div>
      </div>
    </div>
    <list-wrap :list="listData" :total="totalData" @change="getData" :pageSize="pageSize">
      <div class="web-table">
        <table>
          <tr class="thead">
            <td style="width: 5%">ID</td>
            <td>广告位置</td>
            <td>模板图片</td>
            <td>无文字模板图片</td>
            <td style="width: 8%">字体颜色编码</td>
            <td style="width: 6%">上边距</td>
            <td style="width: 6%">左边距</td>
            <td style="width: 6%">状态</td>
            <td>创建时间</td>
            <td>更新时间</td>
            <td style="width: 8%">操作</td>
          </tr>
          <tr v-for="(item, index) in listData" :key="index" class="img-tr">
            <td>{{item.id}}</td>
            <td>{{matchType(StationEnum, item.station)}}</td>
            <td><img :src="item.imgUrl" alt=""></td>
            <td><img :src="item.wordUrl" alt=""></td>
            <td>{{item.fontColor}}</td>
            <td>{{marginFn(item.margin)}}</td>
            <td>{{marginFn(item.leftMargin)}}</td>
            <td>{{matchType(StatusEnum, item.status)}}</td>
            <td>{{item.createAt}}</td>
            <td>{{item.updateAt}}</td>
            <td class="btn-ctrl" @click="$router.push('/adManage/editTemplate?id=' + item.id)">编辑</td>
          </tr>
        </table>
      </div>
    </list-wrap>
  </div>
</template>

<script type="text/ecmascript-6">
/*eslint-disable*/
export default {
  data() {
    return {
      StatusEnumText: '全部',
      StatusEnum: [],
      StatusEnumID: '',
      StationEnumText: '全部',
      StationEnum: [],
      StationEnumID: '',
      userId: '',
      voteId: '',
      optionId: '',
      userName: '',
      pageSize: 20,
      totalData: 0,
      listData: [],
      pageIndex: 1,
    }
  },
  created() {
    this.getStatus()
  },
  methods: {
    getStatus() {
      this.$fetch.post('/public/enumValue?classPackage=AdvertiseTemplet$StationEnum;AdvertiseTemplet$StatusEnum;&flag=true&state=1').then(res => {
        this.StationEnum = res.data.data.StationEnum
        this.StatusEnum = res.data.data.StatusEnum
      })
    },
    marginFn(type) {
      if (type) return type
      return 0
    },
    dropFN1(obj) {
      this.StationEnumText = obj.text
      this.StationEnumID = Number(obj.id)
    },
    dropFN2(obj) {
      this.StatusEnumText = obj.text
      this.StatusEnumID = Number(obj.id)
    },
    emptyFn() {
      this.userId = ''
      this.StatusEnumID = ''
      this.StationEnumID = ''
      this.StatusEnumText = '全部'
      this.StationEnumText = '全部'
    },
    // 获取列表数据
    getData(index, pageSize) {
      if (pageSize) {
        this.pageSize = pageSize
      }
      let dataObj = {
        pageIndex: index,
        pageSize: this.pageSize
      }
      if (this.userId) dataObj.id = this.userId
      if (this.StationEnumID) dataObj.station = this.StationEnumID
      if (this.StatusEnumID) dataObj.status = this.StatusEnumID
      this.$store.commit('SET_LOADING', true)
      this.$fetch.post(`/advertise/advertiseTemplet/queryAdvertiseTempletList`, dataObj).then(res => {
        this.listData = res.data.page.list
        this.totalData = res.data.page.totalCount
        this.$store.commit('SET_LOADING', false)
      }).catch(err => {
        this.$store.commit('SET_LOADING', false)
      })
    }
  }
}
</script>
