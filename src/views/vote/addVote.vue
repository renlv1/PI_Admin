<template>
  <div class="c-page">
    <div class="crumb">
      <span>当前位置：</span>
      <router-link to="/">投票管理 > </router-link>
      <router-link to="">查询投票 > </router-link>
      <router-link to="">新增投票</router-link>
    </div>
    <div class="form-wrap">
      <div class="tit">新建投票</div>
      <div class="form">
        <div class="input-wrap">
          <div class="label">标题</div>
          <input type="text" v-model.trim="title" >
        </div>
        <div class="input-wrap textarea-w">
          <div class="label">内容</div>
          <textarea v-model.trim="content" class="textarea"></textarea>
        </div>
        <div class="input-wrap">
          <div class="label">开始时间</div>
          <el-date-picker
                  class="center-input"
                  v-model="startDate"
                  :picker-options="pickerBeginDateBefore"
                  format="yyyy-MM-dd"
                  type="date">
          </el-date-picker>
        </div>
        <div class="input-wrap">
          <div class="label">截止时间</div>
          <el-date-picker
                  class="center-input"
                  v-model="endDate"
                  :picker-options="pickerBeginDateAfter"
                  format="yyyy-MM-dd"
                  type="date">
          </el-date-picker>
        </div>
        <div class="input-wrap">
          <div class="label">允许投票的用户</div>
          <div class="dropdown-input2">
            <el-dropdown trigger="click" @command="dropFN1">
            <span class="el-dropdown-link">
              {{voteUserSource}}<i class="el-icon-caret-bottom"></i>
            </span>
              <el-dropdown-menu class="dropdown-menu" slot="dropdown">
                <el-dropdown-item :command="item" v-for="(item, index) in voteUserSourceArr" :key="index">{{item.text}}</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </div>
        <div class="input-wrap">
          <div class="label">投票平台</div>
          <div class="dropdown-input2">
            <el-dropdown trigger="click" @command="dropFN2">
            <span class="el-dropdown-link">
              {{voteUseRange}}<i class="el-icon-caret-bottom"></i>
            </span>
              <el-dropdown-menu class="dropdown-menu" slot="dropdown">
                <el-dropdown-item :command="item" v-for="(item, index) in voteUseRangeArr" :key="index">{{item.text}}</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </div>
        <div class="btns">
          <div class="btn" @click="saveForm" :class="{'loading-btn': loadingShow}">
            <span>保存</span>
          </div>
          <div class="btn black" @click="$router.push('/vote/queryVoteList')">返回</div>
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
	    //        日期控件
	    pickerBeginDateBefore: {
		    disabledDate: (time) => {
			    let beginDateVal = this.endDate
			    if (beginDateVal) {
				    return time.getTime() > beginDateVal
			    }
		    }
	    },
	    pickerBeginDateAfter: {
		    disabledDate: (time) => {
			    let beginDateVal = this.startDate
			    if (beginDateVal) {
				    return time.getTime() < beginDateVal
			    }
		    }
	    },
	    title: '',
	    content: '',
	    voteUserSource: '所有',
	    voteUserSourceId: '1',
	    voteUserSourceArr: [
		    {id: "1", text: "所有"},
	      {id: "2", text: "有餐券"}
      ],
	    voteUseRange: 'discovey',
	    voteUseRangeId: '1',
	    voteUseRangeArr: [
		    {id: "1", text: "discovey"},
        {id: "2", text: "赏金猎人"}
      ],
	    startDate: '',
	    endDate: '',
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
	    checkedCities: []
    }
  },
  created () {
    if (this.$route.query.id) {
    	this.voteId = this.$route.query.id
      this.getInput()
    }
  },
  methods: {
  	getInput () {
  		this.$fetch.post('/vote/vote/preEditVote', {
  			id: this.voteId
      }).then(res => {
      	let ret = res.data.voteRecord
      	this.title = ret.title
        this.content = ret.content
			  this.startDate = ret.startDate
			  this.endDate = ret.deadline
			  this.voteUserSource = this.voteUserSourceFn(ret.voteUserSource)
			  this.voteUseRange = this.voteUseRangeFn(ret.voteUseRange)
      })
    },
	  voteUserSourceFn (type) {
		  if (type === 1) return '所有'
		  if (type === 2) return '有餐券'
    },
	  voteUseRangeFn (type) {
		  if (type === 1) return 'discovey'
		  if (type === 2) return '赏金猎人'
	  },
	  dropFN1 (obj) {
		  this.voteUserSource = obj.text
		  this.voteUserSourceId = obj.id
    },
	  dropFN2 (obj) {
		  this.voteUseRange = obj.text
		  this.voteUseRangeId = obj.id
	  },
	  verify () {
    	if (this.title === '') {
			  this.$message.error('请输入标题')
			  return false
		  }
		  if (this.content === '') {
			  this.$message.error('请输入内容')
			  return false
		  }
		  if (this.startDate === '') {
			  this.$message.error('请输入开始时间')
			  return false
		  }
		  if (this.endDate === '') {
			  this.$message.error('请输入截止时间')
			  return false
		  }
		  return true
    },
	  saveForm () {
      if (this.verify()) {
      	this.loadingShow = true
        this.$store.commit('SET_LOADING', true)
        let dataObj = {
	        title: this.title, // 标题
	        content: this.content, //  内容
	        startDate: this.$changeDate(this.startDate, '-', 2), //  开始时间
	        deadline: this.$changeDate(this.endDate, '-', 3), //   截止时间
	        voteUserSource: this.voteUserSourceId, //  允许投票的用户
	        voteUseRange: this.voteUseRangeId //  投票平台
        }
        if (this.voteId) dataObj.id = this.voteId
	      this.$fetch.post('/vote/vote/addVote', dataObj).then(res => {
		      this.$store.commit('SET_LOADING', false)
		      this.loadingShow = false
		      Dialog({
			      title: '操作成功',
			      okFn: () => {
				      this.$router.push('/vote/queryVoteList')
			      }
		      })
	      }).catch(() => {
		      this.$store.commit('SET_LOADING', false)
	      })
      }
    }
  }
}
</script>
