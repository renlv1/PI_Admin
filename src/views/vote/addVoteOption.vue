<template>
  <div class="c-page">
    <div class="crumb">
      <span>当前位置：</span>
      <router-link to="/">投票管理 > </router-link>
      <router-link to="" v-if="$route.query.voteId">投票选项 > </router-link>
      <router-link to="" v-else>查询投票 > </router-link>
      <router-link to="" v-if="$route.query.voteId">修改投票选项</router-link>
      <router-link to="" v-else>新增投票选项</router-link>
    </div>
    <div class="form-wrap">
      <div class="tit" v-if="$route.query.voteId">修改投票选项</div>
      <div class="tit" v-else>新建投票选项</div>
      <div class="form">
        <div class="input-wrap">
          <div class="label">投票ID</div>
          <input type="text" v-model.trim="voteId" :disabled="isDisable" :class="{'disable-input': isDisable}">
        </div>
        <div class="input-wrap">
          <div class="label">投票选项</div>
          <input type="text" v-model.trim="description">
        </div>
        <div class="input-wrap">
          <div class="label">排序(越小越前)</div>
          <input type="text" v-model.trim="voteSort">
        </div>
        <div class="input-wrap">
          <div class="label">被选次数</div>
          <input type="text" v-model.trim="voteTotal">
        </div>
        <div class="btns">
          <div class="btn" @click="saveForm" :class="{'loading-btn': loadingShow}">
            <span>保存</span>
          </div>
          <div class="btn black" @click="$router.go(-1)">返回</div>
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
	    voteId: '',
	    description: '',
	    voteSort: '',
	    voteTotal: '',
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
	    checkedCities: [],
      isDisable: false,
      ids: ''
    }
  },
  created () {
	  if (this.$route.query.id) {
		  this.voteId = this.$route.query.id
      this.isDisable = true
      this.getInput()
	  } else {
		  this.isDisable = false
    }
  },
  methods: {
  	getInput () {
		  if (this.$route.query.voteId) {
			  this.ids = this.$route.query.voteId
			  this.description = this.$route.query.description
			  this.voteSort = this.$route.query.sort
			  this.voteTotal = this.$route.query.voteTotal
		  }
    },
	  changeCheck (e) {
		  this.roleIdList = this.checkedCities
    },
	  verify () {
    	if (this.voteId === '') {
			  this.$message.error('请输入投票ID')
			  return false
		  }
		  if (this.description === '') {
			  this.$message.error('请输入投票选项')
			  return false
		  }
		  if (this.voteSort === '') {
			  this.$message.error('请输入排序')
			  return false
		  }
		  if (this.voteTotal === '') {
			  this.$message.error('请输入被选次数')
			  return false
		  }
		  return true
    },
	  saveForm () {
      if (this.verify()) {
      	this.loadingShow = true
        this.$store.commit('SET_LOADING', true)
        let dataObj = {
	        voteId: this.voteId,
	        description: this.description,
	        sort: this.voteSort,
	        voteTotal: this.voteTotal
        }
        if (this.$route.query.voteId) {
	        dataObj.id = this.ids
        }
	      this.$fetch.post('/vote/vote/addVoteOption', dataObj).then(res => {
		      this.$store.commit('SET_LOADING', false)
          if (this.$route.query.voteId) {
	          Dialog({
		          title: '操作成功',
		          okFn: () => {
			          this.$router.go(-1)
		          }
	          })
          } else {
	          this.voteId = ''
	          this.description = ''
	          this.voteSort = ''
	          this.voteTotal = ''
	          Dialog({
		          title: '操作成功'
	          })
          }
	      }).catch(() => {
		      this.$store.commit('SET_LOADING', false)
	      })
      }
    }
  }
}
</script>
