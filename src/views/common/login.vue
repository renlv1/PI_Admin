<template>
  <div class="c-page full-page">
    <div class="wrap sign">
      <div class="tit">后台管理系统</div>
      <div class="form">
        <div class="input-wrap">
          <input type="text" placeholder="请输入用户名" v-model="userName">
        </div>
        <div class="input-wrap">
          <div style="position: relative">
            <input type="password" v-eye ref="password" @keyup.enter="submit" placeholder="请输入密码" autocomplete="new-password" v-model="password">
          </div>
        </div>
        <div class="input-wrap">
          <input type="text" placeholder="请输入谷歌验证码" v-model="googleCode">
        </div>
        <div class="error" :class="{shake: error}">{{error}}</div>
        <button class="btn full" @click="submit">登陆</button>
      </div>
    </div>
  </div>

</template>

<script>
export default {
  data() {
    return {
      userName: localStorage.getItem('userName') || '',
      password: '',
      error: '',
      googleCode: ''
    };
  },
  computed: {
    disabled () {
      return !this.userName || !this.password
    }
  },
  mounted () {
    this.$nextTick(() => {
      if (this.userName) {
        this.$refs.password && this.$refs.password.focus()
      }
    })
  },
  methods: {
    submit () {
      this.$fetch.post('/sys/login', {
        username: this.userName,
        password: this.password,
        googleCode: this.googleCode,
        loading: '正在登陆中...'
      }).then(() => {
        this.$store.commit('SET_NAV_ACTIVE', -1) // 重置Nav菜单栏
        localStorage.setItem('userName', this.userName)
        this.$store.dispatch('getUserInfo')
        this.$router.replace('/blank')
      })
    }
  }
}
</script>

<style lang="less" scoped>
.full-page{
  margin-left: 0;
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;
  .allCenter;
  background: #072847;
  z-index: 3;
}
.sign{
  width: 520px;
  padding: 60px;
  background: #fff;
  border-radius: 6px;
  box-shadow: 0 2px 8px rgba(0,0,0,.2);
  margin: 0 auto 80px;
  .label{
    margin-bottom: 0;
  }
  .tit{
    text-align: center;
    font-size: 24px;
    font-weight: bold;
    padding: 10px 0 40px;
  }
  .input-wrap{
    input{
      width: 100%;
      height: 50px;
      padding: 0 16px;
    }
  }
  .btn{
    height: 44px;
    line-height: 44px;
    font-size: 15px;
  }
}
</style>
