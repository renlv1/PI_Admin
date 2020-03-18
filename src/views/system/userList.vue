<template>
  <div class="c-page">
    <div class="crumb">
      <span>当前位置：</span>
      <router-link to="/">权限管理 > </router-link>
      <router-link to="">后台用户管理 </router-link>
    </div>
    <div class="search">
      <div class="label">用户/姓名：</div>
      <div class="input-wrap"><input type="text" v-model.trim="inputUsername"></div>
      <div class="btns">
        <div class="btn" @click="searchInput">查询</div>
        <div class="btn black" @click="clearInput">清空</div>
      </div>
      <div class="f1"></div>
      <div class="btns">
        <div class="btn" @click="$router.push('/system/userManager')">新增</div>
        <div class="btn" @click="modifyUser">修改</div>
<!--        <div class="btn red" @click="deleteUser">删除</div>-->
        <div class="btn" @click="resetUser">重置密码</div>
      </div>
    </div>
    <list-wrap :list="list" :total="total" @change="getData">
      <el-table
              class="table-a"
              ref="multipleTable"
              :data="list"
              tooltip-effect="dark"
              style="width: 100%"
              @selection-change="handleSelectionChange">
        <el-table-column
                type="selection"
                width="55">
        </el-table-column>
        <el-table-column
                label="ID">
          <template slot-scope="scope">{{ scope.row.userId }}</template>
        </el-table-column>
        <el-table-column
                prop="username"
                label="用户名">
        </el-table-column>
        <el-table-column
                prop="name"
                label="姓名">
        </el-table-column>
        <el-table-column
                prop="email"
                label="邮箱">
        </el-table-column>
        <el-table-column
                prop="mobile"
                label="手机号">
        </el-table-column>
        <el-table-column
                prop="status"
                label="状态">
          <template slot-scope="status">{{statusFn(status.row.status)}}</template>
        </el-table-column>
        <el-table-column
                prop="createTime"
                label="创建时间">
          <template slot-scope="createTime">
            <span v-html="$changeDate(createTime.row.createTime, '-', 10)" class="time-a"></span>
          </template>
        </el-table-column>
      </el-table>
    </list-wrap>
  </div>
</template>

<script>
/*eslint-disable*/
import Dialog from '@/components/dialog/dialog'
export default {
  data () {
    return {
      list: [],
      total: -1,
      searchVal: '',
      pageIndex: 1,
	    multipleSelection: [],
	    inputUsername: ''
    }
  },
  methods: {
  	// 修改
	  modifyUser () {
	  	if (this.multipleSelection.length === 0) {
	  		this.$message.error('请选择一条记录')
        return
      }
		  if (this.multipleSelection.length > 1) {
			  this.$message.error('只能选择一条记录')
			  return
		  }
		  this.$router.push({
        path: '/system/userManager',
        query: {
	        id: this.multipleSelection[0].userId
        }
      })
    },
    // 删除
	  deleteUser () {
		  if (this.multipleSelection.length === 0) {
			  this.$message.error('请选择一条记录')
			  return
		  }
		  Dialog({
        title: '确定要删除选中的记录？',
        okFn: () => {
        	this.$fetch.postArr2('/sys/user/delete', this.idArrFn()).then(res => {
		        Dialog({
			        title: '操作成功'
		        })
          })
        }
      })
    },
    idArrFn () {
	    let idArr = []
	    this.multipleSelection.forEach(item => {
		    idArr.push(item.userId)
	    })
      return idArr
    },
    // 重置
	  resetUser () {
		  if (this.multipleSelection.length === 0) {
			  this.$message.error('请选择一条记录')
			  return
		  }
		  this.$fetch.postArr2('/sys/user/psd/reset', this.idArrFn()).then(res => {
			  Dialog({
          title: '操作成功'
        })
		  })
    },
    // 搜索
	  searchInput () {
	  	if (this.inputUsername === '') {
			  this.getData()
			  return
      }
		  this.$store.commit('SET_LOADING', true)
	  	this.$fetch.post('/sys/user/list', {
			  username: this.inputUsername
      }).then(res => {
			  this.$store.commit('SET_LOADING', false)
			  this.list = res.data.page.list
			  this.total = res.data.page.totalCount
      }).catch(err => {
			  this.$store.commit('SET_LOADING', false)
      })
    },
	  clearInput () {
	  	this.inputUsername = ''
      if (this.list.length < 1) {
	      this.getData(1)
      }
    },
   	// 多选框
	  handleSelectionChange(val) {
		  this.multipleSelection = val;
		  console.log(this.multipleSelection)
	  },
    // 用户状态
	  statusFn (type) {
	  	if (type === 1) return '正常'
      return '禁用'
    },
    // 列表数据
    getData (pageIndex, pageSize) {
	    this.$store.commit('SET_LOADING', true)
      this.$fetch.post('/sys/user/list', {
        user: this.searchVal,
	      page: pageIndex || this.pageIndex,
        limit: pageSize || 10
      }).then(res => {
	      this.$store.commit('SET_LOADING', false)
	      this.list = res.data.page.list
	      this.total = res.data.page.totalCount
      }).catch(err => {
	      this.$store.commit('SET_LOADING', false)
      })
    }
  },

};
</script>

