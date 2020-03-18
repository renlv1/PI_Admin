<template>
  <nav class="nav c-page">
    <div class="dl" v-for="(item, index) in $store.state.navList" :key="index">
      <div class="dt" @click="handle(item, index)" :class="{active: activeIndex === index}">
        <span class="f1">{{item.name}}</span>
        <i v-if="item.list" class="el-icon-arrow-down"></i>
      </div>
      <el-collapse-transition>
        <div class="child-wrap" v-if="item.list" v-show="activeIndex === index">
          <div class="child-gap">
            <router-link :to="childItem.route || ''" class="dd" v-for="(childItem, j) in item.list" :key="j">
              {{childItem.name}}
            </router-link>
          </div>
        </div>
      </el-collapse-transition>
    </div>
  </nav>
</template>

<script>
export default {
  data() {
    return {
    }
  },
  mounted() {
    this.$store.dispatch('getNavList')
  },
  computed: {
    // 解决Vuex不能响应式
    activeIndex() {
      return this.$store.state.navActiveIndex // 当前展开的菜单
    }
  },
  methods: {
    // commit 为了防止刷新nav状态会变化
    handle(item, index) {
      if (this.activeIndex === index) {
        this.$store.commit('SET_NAV_ACTIVE', -1)
      } else {
        this.$store.commit('SET_NAV_ACTIVE', index)
      }
    }
  }
};
</script>

<style lang="less" scoped>
  .nav {
    position: fixed;
    left: 0;
    top: 0;
    width: 200px;
    height: 100%;
    z-index: 3;
    background: #002d57;
    color: #fff;
    padding: 40px 0;
    font-size: 16px;
    overflow-y: auto;
    &::-webkit-scrollbar-thumb {
      background-color: #376794;
    }
    &::-webkit-scrollbar-track {
      background-color: transparent;
    }
    .dl {
      .dt {
        .vCenter;
        font-size: 15px;
        padding: 0 48px 0 30px;
        height: 45px;
        cursor: pointer;
        border-bottom: 1px solid #072847;
        &.active {
          i {
            transform: rotate(180deg);
          }
        }
      }
      .child-wrap {
        background: #072847;
      }
      .child-gap {
        padding: 8px 0;
      }
      .dd {
        padding-left: 40px;
        line-height: 35px;
        display: block;
        font-size: 13px;
        opacity: .5;
        &.active {
          opacity: 1;
        }
      }
    }
  }
</style>

