<template>
  <div class="c-page">
    <div class="crumb">
      <span>当前位置：</span>
      <router-link to="/">系统管理 > </router-link>
      <router-link to="">菜单管理 > </router-link>
      <router-link to="">新增菜单</router-link>
    </div>
    <div class="form-wrap">
      <div class="tit">新增菜单</div>
      <div class="form">
        <div class="input-wrap">
          <div class="label">类型</div>
          <div>
            <el-radio v-model="radio" :label="item.label" @change="changeMenu" v-for="(item, index) in radioArr" :key="index">{{item.name}}</el-radio>
          </div>
        </div>
        <div class="input-wrap">
          <div class="label">菜单名称</div>
          <input type="text" v-model.trim="name">
        </div>
        <div class="input-wrap">
          <div class="label">父级菜单</div>
          <div class="input-n" :class="{'s-input': parentName !== ''}" @click="showTree = true">
            <span>{{parentName}}</span>
            <i class="el-icon-caret-bottom"></i>
          </div>
        </div>
        <div class="input-wrap" v-show="radio === '1'">
          <div class="label">菜单路径</div>
          <input type="text" v-model.trim="route">
        </div>
        <div class="input-wrap" v-show="radio === '1' || radio === '2'">
          <div class="label">授权编码</div>
          <input type="text" v-model.trim="perms">
        </div>
        <div class="input-wrap" v-show="radio === '1' || radio === '0'">
          <div class="label">排序编号</div>
          <input type="text" v-model.trim="orderNum">
        </div>
        <div class="input-wrap" v-show="radio === '1'">
          <div class="label">菜单路由</div>
          <input type="text" v-model.trim="url">
        </div>
        <div class="btns">
          <div class="btn" @click="submit">保存</div>
          <div class="btn black" @click="$router.push('/system/menuList')">返回</div>
        </div>
      </div>
    </div>

    <el-dialog class="tree-wrap" :visible.sync="showTree">
      <div class="tit">选择父级菜单</div>
      <div class="scroll-wrap">
        <el-tree
          :data="$store.state.navList"
          check-strictly
          ref="tree"
          show-checkbox
          check-on-click-node
          :expand-on-click-node="false"
          node-key="menuId"
          :props="{label: 'name', children: 'list'}"
          @check="checkChange"
          @node-click="checkChange">
        </el-tree>
      </div>
      <div class="btns">
        <div class="btn" @click="showTree = false">保存</div>
        <div class="btn black" @click="showTree = false">关闭</div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
	/*eslint-disable*/
	import Dialog from '@/components/dialog/dialog'
export default {
  data () {
    return {
	    radioArr: [
	    	{
	    	name: '目录',
        label: '0'
        },
		    {
			    name: '菜单',
			    label: '1'
        },
		    {
			    name: '按钮',
			    label: '2'
        },
      ],
      radio: '1',
      selected: {},
      showTree: false,
	    parentName: '',
	    parentId: '',
	    orderNum: '',
	    sysCode: '',
	    name: '',
	    url: '',
	    perms: '',
	    route: ''
    }
  },
  created () {
  	if (this.$route.query.name) {
  		let obj = JSON.parse(this.$route.query.name)
  		this.parentName = obj.name
      this.parentId = obj.parentId
	  }
  	if (this.$route.query.ctrl) {
		  let obj = JSON.parse(this.$route.query.name)
		  this.parentId = obj.parentId
		  this.parentName = obj.parentName
		  this.orderNum = obj.orderNum
		  this.sysCode = obj.sysCode
		  this.name = obj.name
		  this.url = obj.url
		  this.perms = obj.perms
		  this.route = obj.route
		  this.radio = String(obj.type)
    }
  },
  methods: {
  	// 清空input
	  changeMenu () {
	  	this.orderNum = ''
      this.sysCode = ''
      this.name = ''
      this.url = ''
      this.perms = ''
      this.route = ''
    },
    checkChange (data) {
      let selected = this.selected.menuId
      if (selected && data.menuId !== selected) {
        this.$refs.tree.setChecked(this.selected, false)
      }
      this.selected = data
	    this.parentId = this.selected.parentId
      this.parentName = this.selected.name
    },
	  verify () {
		  if (this.name === '') {
		  	this.$message.error('请输入菜单名称')
        return false
		  }
		  if (this.parentName === '') {
			  this.$message.error('请选择父级菜单')
			  return false
		  }
		  if (this.radio === '1') {
			  if (this.route === '') {
				  this.$message.error('请输入菜单路由')
				  return false
			  }
			  if (this.url === '') {
				  this.$message.error('请输入菜单跳转url')
				  return false
			  }
			  if (this.perms === '') {
				  this.$message.error('请输入授权编码')
				  return false
			  }
      }
		  if (this.orderNum === '' && (this.radio === '1' || this.radio === '0')) {
			  this.$message.error('请输入排序编号')
			  return false
		  }
		  return true
    },
    submit () {
    	if (this.verify()) {
		    this.$store.commit('SET_LOADING', true)
    		if (this.$route.query.ctrl) {
			    this.$fetch.postArr2('/sys/menu/update', {
				    menuId: JSON.parse(this.$route.query.name).menuId,
				    parentName: this.parentName,
				    parentId: this.parentId,
				    type: this.radio,
				    orderNum: this.orderNum,
				    sysCode: "system_center",
				    name: this.name,
				    url: this.url,
				    perms: this.perms,
				    route: this.route
			    }).then(res => {
				    this.$store.commit('SET_LOADING', false)
				    Dialog({
					    title: '修改成功',
              okFn: () => {
					    	this.$router.push('/system/menuList')
              }
				    })
			    }).catch(err => {
				    this.$store.commit('SET_LOADING', false)
			    })
        } else {
			    this.$fetch.postArr2('/sys/menu/save', {
				    parentName: this.parentName,
				    parentId: this.selected.parentId,
				    type: this.radio,
				    orderNum: this.orderNum,
				    sysCode: "system_center",
				    name: this.name,
				    url: this.url,
				    perms: this.perms,
				    route: this.route
			    }).then(res => {
				    this.$store.commit('SET_LOADING', false)
				    Dialog({
					    title: '新增成功'
				    })
			    }).catch(err => {
				    this.$store.commit('SET_LOADING', false)
			    })
        }
      }
    }
  }
};
</script>

<style lang="less" scoped>
.input-n{
  border-radius: 6px;
  padding: 0 10px;
  height: 36px;
  font-size: 15px;
  width: 240px;
  .vCenter;
  justify-content: space-between;
  background: #b3b3b3;
  position: relative;
  cursor: pointer;
  .el-icon-caret-bottom{
    position: absolute;
    right: 10px;
  }
  &.s-input{
    background-color: #ccc;
  }
}
.tree-wrap{
  /deep/ .el-dialog{
    width: 500px;
  }
  .tit{
    text-align: center;
    font-size: 18px;
    padding-bottom: 20px;
    margin-bottom: 10px;
  }
}
.scroll-wrap{
  height: 200px;
  overflow-y: auto;
  margin-bottom: 40px;
}
</style>
