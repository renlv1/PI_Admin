<template>
  <div class="c-page">
    <div class="crumb">
      <span>当前位置：</span>
      <router-link to="/">系统管理 > </router-link>
      <router-link to="">角色管理 </router-link>
    </div>
    <div class="search hCenter">
      <div class="vCenter">
        <div class="label">角色名称：</div>
        <div class="input-wrap"><input type="text" v-model.trim="username"></div>
        <div class="btns">
          <div class="btn" @click="search">查询</div>
          <div class="btn black" @click="reset">重置</div>
        </div>
      </div>
      <div class="right-wrap">
        <div class="btns">
          <div class="btn" @click="$router.push('/system/roleDetail')">新增</div>
          <div class="btn" @click="modifyFn">修改</div>
        </div>
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
                prop="roleId"
                label="角色ID">
        </el-table-column>
        <el-table-column
                prop="roleName"
                label="角色名称">
        </el-table-column>
        <el-table-column
                prop="remark"
                label="备注">
        </el-table-column>
        <el-table-column
                prop="createTime"
                label="创建时间">
        </el-table-column>
      </el-table>
    </list-wrap>
  </div>
</template>

<script>
/*eslint-disable*/
export default {
  data () {
    return {
      list: [],
      total: -1,
      searchVal: '',
      pageIndex: 1,
	    username: '',
	    multipleSelection: []
    }
  },
  methods: {
	  modifyFn () {
	  	if (this.multipleSelection.length > 0) {
	  		this.$router.push({
          path: '/system/roleDetail',
          query: {
	          name: JSON.stringify(this.multipleSelection[0])
          }
        })
      } else {
			  this.$message.error('请选择一条记录')
      }
    },
	  search () {
	  	if (this.username === '') {
	  		this.getData()
        return
      }
		  this.$store.commit('SET_LOADING', true)
	  	this.$fetch.post('/sys/role/list', {
			  _search: false,
			  nd: 1578311384381,
			  limit: 10,
			  page: 1,
			  sidx: 'role_id',
			  order: 'asc',
			  search: this.username,
			  sysCode: 'system_center',
      }).then(res => {
			  this.$store.commit('SET_LOADING', false)
			  this.list = res.data.page.list
			  this.total = res.data.page.totalCount
      }).catch(err => {
			  this.$store.commit('SET_LOADING', false)
      })
    },
	  reset () {
	  	this.username = ''
		  this.getData()
    },
    getData (pageIndex, pageSize) {
	    this.$store.commit('SET_LOADING', true)
    	this.$fetch.post('/sys/role/list', {
		    _search: false,
		    page: pageIndex || this.pageIndex,
		    limit: pageSize || 10,
		    order: 'asc',
      }).then(res => {
		    this.$store.commit('SET_LOADING', false)
      	this.list = res.data.page.list
        this.total = res.data.page.totalCount
      }).catch(err => {
		    this.$store.commit('SET_LOADING', false)
      })
    },
	  // 多选框
	  handleSelectionChange(val) {
		  this.multipleSelection = val
	  }
  },

};
</script>
