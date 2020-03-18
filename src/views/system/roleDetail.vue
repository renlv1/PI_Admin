<template>
  <div class="c-page">
    <div class="crumb">
      <span>当前位置：</span>
      <router-link to="">系统管理 ></router-link>
      <router-link to="/system/role">角色管理 ></router-link>
      <router-link to="">新增角色</router-link>
    </div>
    <div class="form-wrap">
      <div class="tit">新增角色</div>
      <div class="input-wrap">
        <div class="label">角色名称</div>
        <input type="text" v-model.trim="name">
      </div>
      <div class="input-wrap">
        <div class="label">备注</div>
        <input type="text" v-model.trim="remark">
      </div>
      <div class="tree-wrap">
        <div class="label">权限设置</div>
        <div class="scroll-wrap">
          <el-tree
            :data="$store.state.treeList"
            show-checkbox
            highlight-current
            ref="tree"
            :check-strictly="true"
            :default-expanded-keys="menuIdList"
            node-key="menuId"
            :props="{children: 'children',label: 'label'}"
          >
          </el-tree>
        </div>
        <div class="btns">
          <div class="btn" @click="saveFn">保存</div>
          <div class="btn black" @click="$router.push('/system/role')">返回</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
/*eslint-disable*/
import Dialog from '@/components/dialog/dialog'

export default {
  data() {
    return {
      treeList: [],
      remark: '',
      selected: {},
      showTree: false,
      parentName: '',
      parentId: '',
      orderNum: '',
      sysCode: '',
      name: '',
      url: '',
      perms: '',
      route: '',
      menuIdList: [],
      roleId: '',
      targetArr: [],
      allTreeList: []
    }
  },
  created() {
    if (this.$route.query.name) {
      let obj = JSON.parse(this.$route.query.name)
      this.roleId = obj.roleId
      this.name = obj.roleName
      this.remark = obj.remark
      this.parentId = obj.parentId
      setTimeout(() => {
        this.getMenuList()
      }, 50)
    }
    this.getTreeList()
  },
  methods: {

    // getMenuList() {
    //   this.$fetch.get(`/sys/role/info/${this.roleId}`, {}).then((res) => {
    //     this.menuIdList = res.data.role.menuIdList
    //     this.allTreeList.forEach(item => {
    //       if (item.parentId === 0) {
    //         this.targetArr.push(item.menuId)
    //       }
    //     })
    //
    //     for (let i = 0; i < this.targetArr.length; i++) {
    //       for (let j = 0; j < this.menuIdList.length; j++) {
    //         if (this.targetArr[i] == this.menuIdList[j]) {
    //           this.menuIdList.splice(j, 1)
    //         }
    //       }
    //     }
    //
    //     console.log(this.menuIdList)
    //
    //     this.$refs.tree.setCheckedKeys(this.menuIdList);
    //
    //     // for (let i = 0; i < this.allTreeList.length; i++) {
    //     //   for (let j = 0; j < this.menuIdList.length; j++) {
    //     //     if (this.allTreeList[i] == this.menuIdList[j]) {
    //     //       this.menuIdList.splice(j, 1)
    //     //     }
    //     //   }
    //     // }
    //
    //     //  console.log(this.menuIdList)
    //
    //     // this.$refs.tree.setCheckedKeys(this.menuIdList);
    //   })
    // },

    getMenuList() {
      this.$fetch.get(`/sys/role/info/${this.roleId}`, {}).then((res) => {
        this.menuIdList = res.data.role.menuIdList
        this.$refs.tree.setCheckedKeys(this.menuIdList);
      })
    },

    getTreeList() {
      this.$fetch.get(`/sys/menu/list`, {
        sysCode: 'system_center'
      }).then((res) => {
        this.allTreeList = res
        // 将treeList存本地减少内存的消耗
        if (this.$store.state.treeList && this.$store.state.treeList.length == 0) {
          let arr = [] // Tree数组
          res.forEach((item) => {
            if (item.parentId == 0) {
              arr.push({menuId: item.menuId, label: item.name, children: []})
            }
          })
          for (let i = 0; i < arr.length; i++) {
            for (let j = 0; j < res.length; j++) {
              if (arr[i].menuId == res[j].parentId) {
                arr[i].children.push({menuId: res[j].menuId, label: res[j].name, children: []})
              }
            }
          }
          for (let l = 0; l < arr.length; l++) {
            for (let k = 0; k < arr[l].children.length; k++) {
              for (let m = 0; m < res.length; m++) {
                if (arr[l].children[k].menuId == res[m].parentId) {
                  arr[l].children[k].children.push({menuId: res[m].menuId, label: res[m].name})
                }
              }
            }
          }
          this.treeList = arr
          this.$store.commit('SET_TREE_LIST', arr)
        }
      })
    },

    saveFn() {
      if (this.verify()) {
        // 合并目前半选中的节点的key和全选的key
        let menuIdList = (this.$refs.tree.getCheckedKeys()).concat(this.$refs.tree.getHalfCheckedKeys())
        this.$store.commit('SET_LOADING', true)
        if (this.$route.query.name) { // 修改
          this.$fetch.postArr2('/sys/role/update', {
            roleId: this.roleId,
            roleName: this.name,
            remark: this.remark,
            createTime: this.$changeDate(new Date(), '-', 8),
            sysCode: "system_center",
            menuIdList: menuIdList,
            sysName: "企业应用中台(默认)"
          }).then(res => {
            this.$store.commit('SET_LOADING', false)
            Dialog({
              title: '操作成功',
              okFn: () => {
                this.$router.push('/system/role')
              }
            })
          }).catch(err => {
            this.$store.commit('SET_LOADING', false)
          })
        } else { // 新增
          this.$fetch.postArr2('/sys/role/save', {
            roleName: this.name,
            remark: this.remark,
            menuIdList: menuIdList,
            sysCode: "system_center"
          }).then(res => {
            this.$store.commit('SET_LOADING', false)
            Dialog({
              title: '操作成功',
              okFn: () => {
                this.$router.push('/system/role')
              }
            })
          }).catch(err => {
            this.$store.commit('SET_LOADING', false)
            Dialog({
              title: '404'
            })
          })
        }
      }
    },

    // 清空input
    changeMenu() {
      this.orderNum = ''
      this.sysCode = ''
      this.name = ''
      this.url = ''
      this.perms = ''
      this.route = ''
    },
    // checkChange(data, flag) {
    //   let selected = this.selected.menuId
    //   if (selected && data.menuId !== selected) {
    //     this.$refs.tree.setChecked(this.selected, false)
    //   }
    //   if (flag.checkedKeys.length > 0) {
    //     this.selected = data
    //     this.menuIdList = [this.selected.menuId]
    //   }
    // },
    verify() {
      if (this.name === '') {
        this.$message.error('请输入角色名称')
        return false
      }
      if (this.remark === '') {
        this.$message.error('请输入备注')
        return false
      }
      // if (this.$route.query.name) { // 修改
      //   console.log(this.menuIdList)
      //   if (this.menuIdList && this.menuIdList.length === 0) {
      //     this.$message.error('请选择权限设置')
      //     return false
      //   }
      // }
      return true
    }
  }
};
</script>

<style lang="less" scoped>
  .input-n {
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
    .el-icon-caret-bottom {
      position: absolute;
      right: 10px;
    }
    &.s-input {
      background-color: #ccc;
    }
  }

  .tree-wrap {
    /deep/ .el-dialog {
      width: 500px;
    }
    .tit {
      text-align: center;
      font-size: 18px;
      padding-bottom: 20px;
      margin-bottom: 10px;
    }
    .label {
      margin-bottom: 20px;
    }
  }

  .scroll-wrap {
    margin-bottom: 40px;
  }
</style>
