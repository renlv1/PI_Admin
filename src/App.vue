<template>
  <div id="app">
    <div class="ajax-loading" v-show="$store.state.showLoading">
      <div class="loading-content">
        <img src="@img/loading2.gif" alt="">
        <p>{{$store.state.showLoading !== true ? $store.state.showLoading : '正在加载中...'}}</p>
      </div>
    </div>
    <web-nav v-if="$store.state.user.userId"/>
    <web-header/>
    <transition name="zoom">
      <keep-alive>
        <router-view class="main-container" v-if="$route.meta.keepAlive" />
      </keep-alive>
    </transition>
    <transition name="zoom">
      <router-view class="main-container" v-if="!$route.meta.keepAlive" />
    </transition>

  </div>
</template>
<script>
export default {
  created () {
      // 注释
    this.$store.dispatch('getUserInfo')

    // 解决vuex刷新数据丢失
    //在页面加载时读取sessionStorage里的状态信息
    if (sessionStorage.getItem("store")) {
      this.$store.replaceState(Object.assign({}, this.$store.state, JSON.parse(sessionStorage.getItem("store"))))
    }
    //在页面刷新时将vuex里的信息保存到sessionStorage里
    window.addEventListener("beforeunload", () => {
      sessionStorage.setItem("store", JSON.stringify(this.$store.state))
    })
  },
  components: {
    webNav: require('@/components/nav').default,
    webHeader: require('@/components/header').default,
  },
}
</script>

<style lang="less">
@import "assets/css/reset.less";
@import "assets/css/common.less";
@import "assets/css/trade.less";
@import "assets/css/deploy.less";
#app {
  font-size: 14px;
  color: #474747;
  word-break: break-all;
  font-family: "Helvetica Neue",Helvetica,"Microsoft YaHei","微软雅黑",Arial,sans-serif;
  padding-left: 200px;
  padding-top: 100px;
}

.ajax-loading{
  position: fixed;
  z-index: 999999;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  .loading-content{
    position: absolute;
    width: 150px;
    height: 150px;
    background: rgba(0,0,0,.8);
    text-align: center;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    .vCenter;
    flex-direction: column;
    justify-content: center;
    color: #fff;
    border-radius: 10px;
  }
  img{
    width: 80px;
    text-align: left;
    margin-bottom: 16px;
  }
}
.zoom-leave{
  display: none;
}
.zoom-enter-to{
  transition: .35s;
}
.zoom-enter{
  transform: translateY(5px);
  opacity: .2;
}
.main-container{
  padding: 20px 30px 50px;
}
</style>


