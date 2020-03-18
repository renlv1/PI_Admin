<template>
  <div class="c-page">
    <div class="crumb">
      <span>当前位置：</span>
      <router-link to="">广告位管理 ></router-link>
      <router-link to="/adManage/adSearch">广告位查询 ></router-link>
      <router-link to="">编辑广告位</router-link>
    </div>
    <div class="search">
      <h3 style="width: 180px; text-align: center; margin-bottom: 40px; font-weight: bold">编辑广告</h3>
      <div class="search-box" v-if="$route.query.obj">
        <div class="label">投票id</div>
        <div class="input-wrap">{{id}}</div>
      </div>
      <div class="search-box">
        <div class="label">起拍价格（π）</div>
        <div class="input-wrap"><input v-model="amount" type="text"></div>
      </div>
      <div class="search-box">
        <div class="label">每次加价金额</div>
        <div class="input-wrap" v-if="$route.query.obj">{{everyRise}}</div>
        <div class="input-wrap" v-else><input v-model="everyRise" type="text"></div>
      </div>
      <div class="search-box">
        <div class="label">广告位置：</div>
        <div class="input-wrap dropdown-wrap">
          <el-dropdown @command="handleCommand">
            <span class="el-dropdown-link">
              {{positionTypeText || '启动页'}}<i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu class="menu" slot="dropdown">
              <el-dropdown-item :command="item" v-for="(item, index) in positionTypeEnumList" :key="index">{{item.text}}
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>
      <div class="search-box">
        <div class="label">竞价开始时间</div>
        <el-date-picker
          prefix-icon="none"
          clear-icon="none"
          v-model="bidStartAt"
          type="datetime"
          value-format="yyyy-MM-dd HH:mm:ss"
        >
        </el-date-picker>
      </div>
      <div class="search-box">
        <div class="label">竞价结束时间</div>
        <el-date-picker
          prefix-icon="none"
          clear-icon="none"
          v-model="bidEndAt"
          type="datetime"
          value-format="yyyy-MM-dd HH:mm:ss"
        >
        </el-date-picker>
      </div>
      <div class="search-box">
        <div class="label">投放开始时间</div>
        <el-date-picker
          prefix-icon="none"
          clear-icon="none"
          v-model="putStartAt"
          type="datetime"
          value-format="yyyy-MM-dd HH:mm:ss"
        >
        </el-date-picker>
      </div>
      <div class="search-box">
        <div class="label">投放结束时间</div>
        <el-date-picker
          prefix-icon="none"
          clear-icon="none"
          v-model="putEndAt"
          type="datetime"
          value-format="yyyy-MM-dd HH:mm:ss"
        >
        </el-date-picker>
      </div>
      <div class="search-box">
        <div class="label"></div>
        <div class="btns">
          <div class="btn" @click="save">保存</div>
          <div class="btn black" @click="$router.push('/adManage/adSearch')">返回</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      id: '',
      amount: '',
      everyRise: '',

      positionTypeText: '',
      positionType: 1,
      positionTypeEnumList: [],

      bidStartAt: '',
      bidEndAt: '',
      putStartAt: '',
      putEndAt: '',
      period: ''
    }
  },
  mounted() {
    this.getDropDownList()

    if (this.$route.query && this.$route.query.obj) {
      let obj = JSON.parse(this.$route.query.obj)
      this.positionType = obj.station
      this.id = obj.id
      this.amount = obj.amount
      this.everyRise = obj.everyRise
      this.bidStartAt = obj.bidStartAt
      this.bidEndAt = obj.bidEndAt
      this.putStartAt = obj.putStartAt
      this.putEndAt = obj.putEndAt
      this.period = obj.period
    }
  },
  methods: {
    save() {
      this.$fetch.post(`advertise/advertiseRecord/edit`, {
        id: this.id,
        amount: this.amount,
        everyRise: this.everyRise,
        station: this.positionType,
        bidStartAt: this.bidStartAt,
        bidEndAt: this.bidEndAt,
        putStartAt: this.putStartAt,
        putEndAt: this.putEndAt,
        period: this.period || ''
      }).then((res) => {
        if (res.code == 0) {
          this.$message.success(res.msg)
        }
      })
    },
    handleCommand(command) {
      this.positionTypeText = command.text
      this.positionType = command.id
    },
    getDropDownList() {
      this.$fetch.post(`/public/enumValue`, {
        classPackage: 'AdvertiseRecord$StationEnum',
        flag: false,
        state: 1
      }).then((res) => {
        this.positionTypeEnumList = res.data.data.StationEnum
        this.positionTypeText = this.matchType(this.positionTypeEnumList, this.station)
      })
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  .search
    width 65%
    margin-top 40px
    border 1px solid #e6e6e6
    padding-top 40px
    border-radius 4px
    box-shadow 0 0 2px rgba(0, 0, 0, .16)
    position relative
    display flex
    flex-direction column
    align-items flex-start
    flex-wrap wrap
    @media screen and (max-width 1400px) {
      flex-wrap nowrap
    }
    input {
      width 240px
      height 30px
    }
    .search-box
      margin-top 0
      margin-bottom 40px
      display flex
      flex-direction row
      align-items center
      .label
        text-align center
        width 200px
      .input-wrap
        text-align center
        width 240px
        height 30px
        line-height 30px
        input
          text-align center
      .dropdown-wrap
        cursor pointer
        text-align center
        line-height 30px
        width: 240px;
        margin-right: 20px;
        background-color #fff
        border: 1px solid #DCDFE6;
        border-radius: 6px;
        padding: 0 10px;
        font-size 15px
        height 30px
    .btns
      .btn
        line-height 30px
        height 30px
        width auto
        padding 0 30px
        cursor pointer
</style>

<style scoped>

  .el-date-editor.el-input {
    width: 240px !important;
    height: 30px !important;
  }

  >>> .el-date-editor .el-input__inner {
    padding: 0 10px !important;
    width: 240px !important;
    height: 25px !important;
    text-align: center;
  }
</style>
