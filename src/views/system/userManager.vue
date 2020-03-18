<template>
  <div class="c-page">
    <div class="crumb">
      <span>当前位置：</span>
      <router-link to="/">系统管理 > </router-link>
      <router-link to="">后台用户管理 > </router-link>
      <router-link to="">修改后台用户信息</router-link>
    </div>
    <div class="form-wrap">
      <div class="tit">新增后台用户</div>
      <div class="form">
        <div class="input-wrap">
          <div class="label">用户名</div>
          <input type="text" v-model.trim="username">
        </div>
        <div class="input-wrap">
          <div class="label">姓名</div>
          <input type="text" v-model.trim="name">
        </div>
        <div class="input-wrap">
          <div class="label">密码</div>
          <input type="text" v-model.trim="password">
        </div>
        <div class="input-wrap">
          <div class="label">绑定邮箱</div>
          <input type="text" v-model.trim="email">
        </div>
        <div class="input-wrap">
          <div class="label">手机号码</div>
          <input type="text" v-model.trim="mobile">
        </div>
        <div class="input-wrap">
          <div class="label">角色</div>
          <el-checkbox-group v-model="checkedCities" @change="changeCheck">
            <el-checkbox v-for="(item,index) in jobData" :key="index" :label="item.roleId">{{item.roleName}}</el-checkbox>
          </el-checkbox-group>
        </div>
        <div class="input-wrap">
          <div class="label">角色状态</div>
          <div>
            <el-radio v-model="status" label="0">禁用</el-radio>
            <el-radio v-model="status" label="1">启用</el-radio>
          </div>
        </div>
        <div class="btns">
          <div class="btn" @click="saveForm" :class="{'loading-btn': loadingShow}">
            <span>保存</span>
          </div>
          <div class="btn black" @click="$router.push('/system/userList')">返回</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  /*eslint-disable*/
  import Dialog from '@/components/dialog/dialog'
export default {
  data () {
    return {
      list: [{}],
      total: -1,
      searchVal: '',
      pageIndex: 1,
	    jobData: [],
	    status: '1',
	    roleIdList: [],
	    postIdList: [],
	    username: "",
	    name: "",
	    password: "",
	    email: "",
	    mobile: "",
	    loadingShow: false,
	    checkedCities: []
    }
  },
  created () {
  	this.getJob()
    this.getData()
  },
  methods: {
  	getData () {
  		if (this.$route.query.id) {
  			this.$fetch.get(`/sys/user/info/${this.$route.query.id}`).then(res => {
        	let userData = res.data.user
				  this.username = userData.username
				  this.name = userData.name
				  this.password = userData.password
				  this.email = userData.email
				  this.mobile = userData.mobile
          this.status = String(userData.status)
				  this.checkedCities = userData.roleIdList
          this.roleIdList = userData.roleIdList
        })
      }
    },
	  changeCheck (e) {
		  this.roleIdList = this.checkedCities
    },
    getJob () {
    	this.$fetch.post('/sys/role/select', {
    		_: new Date()
      }).then(res => {
      	this.jobData = res.data.list
      })
    },
	  verify () {
    	if (this.username === '') {
			  this.$message.error('请输入用户名')
			  return false
		  }
		  if (this.name === '') {
			  this.$message.error('请输入姓名')
			  return false
		  }
		  if (this.password === '') {
			  this.$message.error('请输入密码')
			  return false
		  }
		  if (this.email === '') {
			  this.$message.error('请输入邮箱')
			  return false
		  }
		  if (this.mobile === '') {
			  this.$message.error('请输入手机号码')
			  return false
		  }
		  return true
    },
	  saveForm () {
      if (this.verify()) {
      	this.loadingShow = true
        this.$store.commit('SET_LOADING', true)
        if (this.$route.query.id) {
	        this.$fetch.postArr('/sys/user/update', {
		        userId: this.$route.query.id,
		        status: this.status,
		        roleIdList: this.roleIdList,
		        username: this.username,
		        name: this.name,
		        password: this.password,
		        email: this.email,
		        mobile: this.mobile,
		        deptId: 2
	        }).then(res => {
		        this.$store.commit('SET_LOADING', false)
		        this.username = ''
		        this.name = ''
		        this.password = ''
		        this.email = ''
		        this.mobile = ''
		        Dialog({
			        title: '修改成功',
			        okFn: () => {
				        this.$router.push('/system/userList')
			        }
		        })
	        }).catch(() => {
		        this.$store.commit('SET_LOADING', false)
	        })
        } else {
	        this.$fetch.postArr('/sys/user/save', {
		        status: this.status,
		        roleIdList: this.roleIdList,
		        username: this.username,
		        name: this.name,
		        password: this.password,
		        email: this.email,
		        mobile: this.mobile,
		        deptId: 2
	        }).then(res => {
		        this.$store.commit('SET_LOADING', false)
		        this.username = ''
		        this.name = ''
		        this.password = ''
		        this.email = ''
		        this.mobile = ''
		        Dialog({
			        title: '新增成功',
			        okFn: () => {
				        this.$router.push('/system/userList')
			        }
		        })
	        }).catch(() => {
		        this.$store.commit('SET_LOADING', false)
	        })
        }
      }
    }
  }
};
</script>

<style lang="less" scoped>
</style>
