<template>
  <div class="header">
    <div class="tit">后台管理系统</div>
    <div class="user-info">
      <span class="name">{{$store.state.user.username}}</span>
      <span class="cred pointer" @click="logout">退出账号</span>
    </div>
  </div>
</template>

<script>
/*eslint-disable*/
export default {
  methods: {
    logout () {
      this.$confirm('确定退出登陆吗？').then(() => {
        this.$fetch.get('/sys/logout').then(() => {
          this.$store.commit('CLEAR_ACCOUNT')
          this.$router.push('/login')
        }).catch(err => {
	        this.$store.commit('CLEAR_ACCOUNT')
	        this.$router.push('/login')
        })
      })
    }
  }
};
</script>

<style lang="less" scoped>
.header{
  .allCenter;
  position: fixed;
  left: 200px;
  top: 0;
  right: 0;
  z-index: 3;
  height: 100px;
  padding: 0 40px;
  border-bottom: 1px solid #e6e6e6;
  background: #fff;
  font-size: 16px;
  .tit{
    font-size: 20px;
    font-weight: bold;
  }
  .name{
    border-right: 1px solid #777;
    padding-right: 20px;
    margin-right: 20px;
  }
}
</style>

