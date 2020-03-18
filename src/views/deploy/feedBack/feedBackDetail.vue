<template>
  <div class="c-detail">
    <div class="crumb">
      <span>当前位置：</span>
      <span>配置管理 > </span>
      <span>反馈信息管理 > </span>
      <span>反馈信息详情</span>
    </div>
      <div class="web-table">
        <table>
          <tr class="thead">
            <td>ID</td>
            <td>用户名</td>
            <td >消息内容</td>
            <td>消息图片</td>
            <td>创建时间</td>
          </tr>
          <tr v-for="(item,index) in list" :key="index">
            <td>{{item.id}}</td>
            <td >{{item.userName}}</td>
            <td>{{item.content}}</td>
            <td class="td-img">
              <ul class="ul-img">
                <li v-for="(img,index) in item.imageUrlArray" :key="index" class="li-img">
                  <img :src="img" class="image">
                </li>
              </ul>
            </td>
            <td>{{$changeDate(item.createAt, '-')}}</td>
          </tr>
        </table>
      </div>
    <div class="content-box">
      <textarea class="textarea tradingCenter-input"  placeholder="请输入回复内容"  v-model="problemContent" @input="textareaVal"></textarea>
      <div class="num-text"><span class="count">{{numb}}</span>/<span>200</span></div>
    </div>
    <div class="search-r">
      <p class="err-tip">{{error1}}</p>
      <div class="btn" @click="replyBtn()">回复</div>
      <div class="btn black" @click="$router.push('/deploy/feedBack')">关闭</div>
      <div class="btn" @click="finishBtn()">完成处理</div>
    </div>
  </div>
</template>

<script>
  import Dialog from '@/components/dialog/dialog'
  export default {
    data() {
      return{
        list: [{}],
        total: -1,
        pageIndex: 1,
        loadShow: false,
        numb: 0,
        problemContent: '',
        error1: ''
      }
    },
    created() {
      this.getData()
    },
    methods: {
      textareaVal() {
        this.numb = this.problemContent.length
        if (this.problemContent.length > 200) {
          this.numb = 200
          this.problemContent = this.problemContent.substring(0,200)
        }
      },
      // 回复
      replyBtn() {
        if (this.problemContent === '') {
          this.error1 = '请输入回复内容'
          return
        }
        this.$store.commit('SET_LOADING', true)
        this.$fetch.post(`/system/feedBack/replyFeedBack`,{
          id: this.$route.query.id,
          replyContent: this.problemContent
        }).then(res => {
          if (res.code === 0) {
            this.$store.commit('SET_LOADING', false)
            Dialog({
              title: res.msg,
              okFn: () => {
                this.$router.push('/deploy/feedBack')
              }
            })
          }
        })
      },
      // 完成处理
      finishBtn () {
        this.$fetch.post(`/system/feedBack/finishFeedBack`,{
          ids: this.$route.query.id
        }).then(res => {
          if (res.code === 0) {
            Dialog({
              title: res.msg,
              okFn: () => {
                this.$router.push('/deploy/feedBack')
              }
            })
          }
        })
      },
      getData (pageIndex,pageSize) {
        let formData = {}
        if (pageIndex) {
          formData.pageIndex = pageIndex
        } else {
          formData.pageIndex = this.pageIndex
        }
        if (pageSize) {
          formData.pageSize = pageSize
        } else {
          formData.pageSize = 10
        }
        this.$fetch.post(`/system/feedBack/getFeedBackDetail`, {
          id: this.$route.query.id
        }).then(res => {
          if (res.msg === '成功') {
            this.list =  res.data.feedbackList
            // this.total = res.data.page.totalCount
            this.loadShow = false
          }
        })
      }
    }
  }
</script>

<style lang="stylus" scoped>
.content-box{
  position: relative;
  width: 680px
  .textarea{
    width: 680px
    line-height: 1.3
    height 240px
    border-radius 8px
    font-size: 14px
    color #000b2a
    font-family "Microsoft YaHei UI"
    padding: 20px 40px
    box-sizing border-box
    background-color: #fff;
    border: 1px solid #edeff1
  }
  .num-text{
    font-size: 16px
    color #181818
    position: absolute
    z-index: 30
    right: 20px
    bottom: 19px
  }
}
.td-img{
  .ul-img{
    display flex
    align-items center
    justify-content center
    .li-img{
      width 33px
      height 36px
      margin-right 10px
      &:last-child{
        margin-right 0
      }
      .image{
        max-width 33px
        max-height 36px
      }
    }
  }
}
.search-r{
  position relative
  display: flex;
  margin-top 50px
  .err-tip{
    position absolute
    top -40px
    color #ff2769
  }
  .btn{
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
    &:last-child{
      margin-right: 0;
    }
    &.black{
      background: #474747;
    }
  }
}
</style>
