import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/*eslint-disable*/
const routerPush = Router.prototype.push
Router.prototype.push = function push(location) {
	return routerPush.call(this, location).catch(error=> error)
}

const router = new Router({
  linkActiveClass: 'active',
  routes: [
	  {
		  path: '*',
		  redirect: '/login'
	  },
    {
      path: '/',
      redirect: '/login'
    },

    {
      path: '/blank',
      component: require('./views/common/blank').default
    },

    {
      // 登录
      path: '/login',
      component: require('./views/common/login').default
    },
    {
      // 系统管理
      path: '/system',
      redirect: '/system/userList',
      component: require('./views/system/index').default,
      children: [
        {
          // 管理员管理
          path: '/system/userList',
          component: require('./views/system/userList').default,
        },
        {
          // 管理员编辑
          path: '/system/userManager',
          component: require('./views/system/userManager').default,
        },
        {
          // 菜单管理
          path: '/system/menuList',
          component: require('./views/system/menuList').default,
        },
        {
          // 菜单编辑
          path: '/system/menuManager',
          component: require('./views/system/menuManager').default,
        },
        {
          // 角色管理
          path: '/system/role',
          component: require('./views/system/role').default,
        },// roleDetail
        {
          // 角色管理 -> 详情
          path: '/system/roleDetail',
          component: require('./views/system/roleDetail').default,
        },
        {
          // 部门管理
          path: '/system/dept',
          component: require('./views/system/dept').default,
        },
        {
          // 岗位管理
          path: '/system/post',
          component: require('./views/system/post').default,
        },
        {
          // 系统日志
          path: '/system/log',
          component: require('./views/system/log').default,
        }
      ]
    },
    {
      // 用户管理
      path: '/user',
      component: require('./views/user/index').default,
      children: [
        {
          path: '/user/userInfo',
          component: require('./views/user/userInfo').default
        },
        {
          path: '/user/userDetail',
          component: require('./views/user/userDetail').default
        },
        {
          path: '/user/accountChange',
          component: require('./views/user/accountChange').default
        },
        {
          path: '/user/log',
          component: require('./views/user/log').default
        },
        {
          path: '/user/transList',
          component: require('./views/user/transList').default
        },
        {
          path: '/user/intelList',
          component: require('./views/user/intelList').default
        },
        {
          path: '/user/mergerList',
          component: require('./views/user/mergerList').default
        },
        {
          path: '/user/commissionList',
          component: require('./views/user/commissionList').default
        },
        {
          path: '/user/optimizList',
          component: require('./views/user/optimizList').default
        },
      ]
    },
    {
      // 交易管理
      path: '/trade',
      redirect: '/trade/queryTransactionListPre',
      component: require('./views/trade/index').default,
      children: [
        {
          // 转账记录管理
          path: '/trade/queryTransactionListPre',
          component: require('./views/trade/queryTransactionListPre').default,
        },
        {
          // 派钱包转账记录
          path: '/trade/queryPaiToDiscoveryListPre',
          component: require('./views/trade/queryPaiToDiscoveryListPre').default,
        },
        {
          // 派付钱包管理
          path: '/trade/queryUserPaiPurseRecordPre',
          component: require('./views/trade/queryUserPaiPurseRecordPre').default,
        }
      ]
    },
	  {
		  // 投票管理
		  path: '/vote',
		  redirect: '/vote/queryVoteList',
		  component: require('./views/vote/index').default,
		  children: [
			  {
				  // 查询投票
				  path: '/vote/queryVoteList',
				  component: require('./views/vote/queryVoteList').default,
			  },
			  {
				  // 查询投票 -》 新增投票选项
				  path: '/vote/addVoteOption',
				  component: require('./views/vote/addVoteOption').default,
			  },
			  {
				  // 查询投票 -》 新增投票
				  path: '/vote/queryVoteList/addVote',
				  component: require('./views/vote/addVote').default,
			  },
			  {
				  // 查询投票选项
				  path: '/vote/queryOptionList',
				  component: require('./views/vote/queryOptionList').default,
			  },
			  {
				  // 查询用户投票记录
				  path: '/vote/queryUserVoteList',
				  component: require('./views/vote/queryUserVoteList').default,
			  },
			  {
				  // 查询区块投票
				  path: '/vote/queryBlockList',
				  component: require('./views/vote/queryBlockList').default,
			  },
			  {
				  // 查询区块投票选项
				  path: '/vote/queryBlockOption',
				  component: require('./views/vote/queryBlockOption').default,
			  },
			  {
				  // 查询区块用户投票记录
				  path: '/vote/blockUserVote',
				  component: require('./views/vote/blockUserVote').default,
			  }
		  ]
	  },
    {
      // 配置管理
      path: '/deploy',
      redirect: '/deploy/function',
      component: require('./views/deploy/index').default,
      children: [
        {
          // 功能管理
          path: '/deploy/function',
          component: require('./views/deploy/function').default,
        },
        {
          // 新增管理
          path: '/deploy/function/addFunction',
          component: require('./views/deploy/function/addFunction').default,
        },
        {
          // 压缩包管理
          path: '/deploy/function/packManage',
          component: require('./views/deploy/function/packManage').default,
        },
        {
          // ui管理
          path: '/deploy/uiGanage',
          component: require('./views/deploy/uiGanage').default,
        },
        {
          // 新增Ui配置管理
          path: '/deploy/uiManage/addUiDeploy',
          component: require('./views/deploy/uiManage/addUiDeploy').default,
        },
        {
          // 验证码管理
          path: '/deploy/verifiCode',
          component: require('./views/deploy/verifiCode').default,
        },
        {
          // 反馈信息管理
          path: '/deploy/feedBack',
          component: require('./views/deploy/feedBack').default,
        },
        {
          // 反馈信息详情
          path: '/deploy/feedBack/feedBackDetail',
          component: require('./views/deploy/feedBack/feedBackDetail').default,
        }
      ]
    },
    {
      // 新币种管理
      path: '/coinCurrency',
      redirect: '/coinCurrency/queryList',
      component: require('./views/coinCurrency/index').default,
      children: [
        {
          // 查询货币对
          path: '/coinCurrency/queryList',
          component: require('./views/coinCurrency/queryList').default,
        },
        {
          // 新币种委托记录
          path: '/coinCurrency/entrustRecordList',
          component: require('./views/coinCurrency/entrustRecordList').default,
        },
        {
          // 新币种成交记录
          path: '/coinCurrency/tradeRecordList',
          component: require('./views/coinCurrency/tradeRecordList').default,
        }
      ]
    },
    {
      // 基金管理
      path: '/fund',
      component: require('./views/fund/index').default,
      children: [
        {
          path: '/fund/transList',
          component: require('./views/fund/transList').default
        },
        {
          path: '/fund/searchDetailList',
          component: require('./views/fund/searchDetailList').default
        },
        {
          path: '/fund/factionList',
          component: require('./views/fund/factionList').default
        },
        {
          path: '/fund/commissionList',
          component: require('./views/fund/commissionList').default
        },
        {
          path: '/fund/giveList',
          component: require('./views/fund/giveList').default
        },
        {
          path: '/fund/creditList',
          component: require('./views/fund/creditList').default
        },
        {
          path: '/fund/sumsList',
          component: require('./views/fund/sumsList').default
        },
        {
          path: '/fund/incrementList',
          component: require('./views/fund/incrementList').default
        },
      ]
    },
    {
      // 餐券交易记录
      path: '/voucher',
      component: require('./views/voucher/index').default,
      children: [
        {
          path: '/voucher/transList',
          component: require('./views/voucher/transList').default
        },
        {
          path: '/voucher/commissionList',
          component: require('./views/voucher/commissionList').default
        },
        {
          path: '/voucher/buyList',
          component: require('./views/voucher/buyList').default
        },
      ]
    },
    {
      // 广告位管理
      path: '/adManage',
      component: require('./views/adManage/index').default,
      children: [
        {
          // 预约记录
          path: '/adManage/userAppointment',
          component: require('./views/adManage/userAppointment').default
        },
        {
          // 出价记录
          path: '/adManage/auctionBidRecord',
          component: require('./views/adManage/auctionBidRecord').default
        },
        {
          // 成交记录
          path: '/adManage/auctionDealRecord',
          component: require('./views/adManage/auctionDealRecord').default
        },
        {
          // 消息查询
          path: '/adManage/information',
          component: require('./views/adManage/information').default
        },
        {
          // 广告位查询
          path: '/adManage/adSearch',
          component: require('./views/adManage/adSearch').default
        },
        {
          // 广告位模板查询
          path: '/adManage/templateSearch',
          component: require('./views/adManage/templateSearch').default
        },
        {
          // 编辑广告位
          path: '/adManage/editAd',
          component: require('./views/adManage/editAd').default
        },
        {
          // 编辑广告位模板
          path: '/adManage/editTemplate',
          component: require('./views/adManage/editTemplate').default
        }
      ]
    },
  ]
})

router.afterEach(() => {
  window.scrollTo(0, 0)
})

export default router
