<template>
  <div class="c-page">
    <div class="crumb">
      <span>当前位置：</span>
      <router-link to="/">系统管理 ></router-link>
      <router-link to="">菜单管理</router-link>
    </div>
    <div class="search hCenter">
      <!--      <div class="vCenter">-->
      <!--        <div class="label">角色名称：</div>-->
      <!--        <div class="input-wrap"><input type="text"></div>-->
      <!--        <div class="btns">-->
      <!--          <div class="btn">查询</div>-->
      <!--          <div class="btn black">重置</div>-->
      <!--        </div>-->
      <!--      </div>-->
      <div class="right-wrap">
        <div class="btns">
          <div class="btn" @click="addMenu ">新增</div>
          <div class="btn" @click="modifyMenu">修改</div>
          <!--          <div class="btn red" @click="deleteMenu">删除</div>-->
        </div>
      </div>
    </div>
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
        prop="menuId"
        label="菜单ID">
      </el-table-column>
      <el-table-column
        prop="name"
        label="菜单名称">
      </el-table-column>
      <el-table-column
        prop="parentName"
        label="父级菜单">
      </el-table-column>
      <el-table-column
        prop="type"
        label="类型">
        <template slot-scope="status"><span class="type"
                                            :class="typeCls(status.row.type)">{{orderFn(status.row.type)}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="parentId"
        label="排序编号">
      </el-table-column>
      <el-table-column
        prop="url"
        label="菜单链接">
      </el-table-column>
      <el-table-column
        prop="perms"
        label="授权编码">
      </el-table-column>
    </el-table>
    <!--<list-wrap :list="list" :total="total" @change="getData">-->
    <!--<el-table-->
    <!--class="table-a"-->
    <!--ref="multipleTable"-->
    <!--:data="list"-->
    <!--tooltip-effect="dark"-->
    <!--style="width: 100%"-->
    <!--@selection-change="handleSelectionChange">-->
    <!--<el-table-column-->
    <!--type="selection"-->
    <!--width="55">-->
    <!--</el-table-column>-->
    <!--<el-table-column-->
    <!--prop="menuId"-->
    <!--label="菜单ID">-->
    <!--</el-table-column>-->
    <!--<el-table-column-->
    <!--prop="name"-->
    <!--label="菜单名称">-->
    <!--</el-table-column>-->
    <!--<el-table-column-->
    <!--prop="parentName"-->
    <!--label="父级菜单">-->
    <!--</el-table-column>-->
    <!--<el-table-column-->
    <!--prop="type"-->
    <!--label="类型">-->
    <!--<template slot-scope="status"><span class="type" :class="typeCls(status.row.type)">{{orderFn(status.row.type)}}</span></template>-->
    <!--</el-table-column>-->
    <!--<el-table-column-->
    <!--prop="parentId"-->
    <!--label="排序编号">-->
    <!--</el-table-column>-->
    <!--<el-table-column-->
    <!--prop="url"-->
    <!--label="菜单链接">-->
    <!--</el-table-column>-->
    <!--<el-table-column-->
    <!--prop="perms"-->
    <!--label="授权编码">-->
    <!--</el-table-column>-->
    <!--</el-table>-->
    <!--</list-wrap>-->
  </div>
</template>

<script>
/* eslint-disable */
import Dialog from '@/components/dialog/dialog'

export default {
  data() {
    return {
      list: [{}],
      total: -1,
      searchVal: '',
      multipleSelection: [],
      pageIndex: 1,
    }
  },
  mounted() {
    this.getData()
  },
  methods: {
    modifyMenu() {
      if (this.multipleSelection.length === 0) {
        this.$message.error('请选择一条记录')
      }
      if (this.multipleSelection.length === 1) {
        this.$router.push({
          path: '/system/menuManager',
          query: {
            ctrl: 'MODIFY',
            name: JSON.stringify(this.multipleSelection[0])
          }
        })
      }
    },
    deleteMenu() {
      if (this.multipleSelection.length === 0) {
        this.$message.error('请选择一条记录')
      }
      if (this.multipleSelection.length === 1) {
        console.log(this.multipleSelection[0].menuId)
        this.$fetch.post('/sys/menu/delete', {
          menuId: this.multipleSelection[0].menuId
        }).then(res => {
          Dialog({
            title: '操作成功'
          })
        }).catch(() => {
          Dialog({
            title: '操作失败'
          })
        })
      }
    },
    addMenu() {
      console.log(this.multipleSelection)
      let name
      if (this.multipleSelection.length === 1) {
        name = this.multipleSelection[0].parentName
      }
      this.$router.push({
        path: '/system/menuManager',
        query: {
          name: JSON.stringify(this.multipleSelection[0])
        }
      })
    },
    orderFn(type) {
      if (type === 0) return '目录'
      if (type === 1) return '菜单'
      if (type === 2) return '按钮'
    },
    typeCls(type) {
      if (type === 0) return 'list-a'
      if (type === 1) return 'menu-a'
      if (type === 2) return 'button-a'
    },
    getData() {
      this.$fetch.get('/sys/menu/list', {
        sysCode: 'system_center'
      }).then(res => {
        this.list = res

        this.list.forEach(item => {
          if (!item.parentName) {
            item.parentName = '-'
          }
          if (!item.url) {
            item.url = '-'
          }
          if (!item.perms) {
            item.perms = '-'
          }
        })
        this.total = res.length
      })
    },
    // 多选框
    handleSelectionChange(val) {
      this.multipleSelection = val
    }
  },

};
</script>
