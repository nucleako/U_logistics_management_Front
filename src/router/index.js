import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/* Router Modules */
// import nestedRouter from './modules/nested'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    noCache: true                if set true, the page will no be cached(default is false)
    affix: true                  if set true, the tag will affix in the tags-view
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

// 固定路由
/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
	{ path: '*', redirect: '/404' },
	{
		path: '/redirect',
		component: Layout,
		hidden: true,
		children: [
			{
				path: '/redirect/:path(.*)',
				component: () => import('@/views/redirect/index')
			}
		]
	},
	{
		path: '/login',
		component: () => import('@/views/login/index'),
		hidden: true
	},
	{
		path: '/auth-redirect',
		component: () => import('@/views/login/auth-redirect'),
		hidden: true
	},
	{
		path: '/404',
		component: () => import('@/views/error-page/404'),
		hidden: true
	},
	{
		path: '/401',
		component: () => import('@/views/error-page/401'),
		hidden: true
	},
	{
		path: '/',
		component: Layout,
		redirect: '/dashboard',
		children: [
			{
				path: 'dashboard',
				component: () => import('@/views/dashboard/index'),
				name: 'Dashboard',
				meta: { title: '系统首页', icon: 'dashboard', affix: true }
			}
		]
	},
	{
		path: '/list',
		component: Layout,
		meta: {
			title: '订单管理',
			icon: 'el-icon-s-help'
		},
		children: [
			{
				roles: ['admin', 'editor'],
				path: 'index',
				component: () => import('@/views/list/index'),
				name: 'list',
				meta: { title: '订单管理', icon: 'list', affix: true }
			},
			{
				path: 'details',
				component: () => import('@/views/list/details'),
				name: 'listDetails',
				meta: { title: '订单详情', icon: 'edit' }
			}
		]
	},
	{
		path: '/trans',
		component: Layout,
		meta: {
			title: '运单管理',
			icon: 'el-icon-s-help'
		},
		children: [
			{
				roles: ['admin', 'editor'],
				path: 'index',
				component: () => import('@/views/trans/index'),
				name: 'Trans',
				meta: { title: '运单管理', icon: 'list', affix: true }
			},
			{
				path: 'details',
				component: () => import('@/views/trans/details'),
				name: 'transDetails',
				meta: { title: '运单详情', icon: 'edit' }
			}
		]
	},

	{
		path: '/carriers',
		component: Layout,
		children: [
			{
				roles: ['admin', 'editor'],
				path: 'index',
				component: () => import('@/views/carriers/index'),
				name: 'Carriers',
				meta: { title: '承运商管理', icon: 'form', affix: true }
			}
		]
	},
	{
		path: '/customer',
		component: Layout,
		name: 'customer',
		meta: {
			title: '客户管理',
			icon: 'el-icon-s-help'
		},
		children: [
			{
				path: 'index',
				component: () => import('@/views/customer/index'),
				name: 'Customer',
				meta: { title: '客户管理', icon: 'edit', affix: true }
			}
		]
	},
	{
		path: '/person',
		component: Layout,
		children: [
			{
				roles: ['admin', 'editor'],
				path: 'index',
				component: () => import('@/views/person/index.vue'),
				name: 'Person',
				meta: { title: '个人信息', icon: 'user', affix: true }
			}
		]
	},
	{
		path: '/aboutsystem',
		component: Layout,
		children: [
			{
				roles: ['admin', 'editor'],
				path: 'index',
				component: () => import('@/views/aboutsystem/index'),
				name: 'Aboutsystem',
				meta: { title: '地图导航', icon: 'guide', affix: true }
			}
		]
	}
]
// 异步路由-权限路由
// 虽然vue-admin帮我们分出来2部分的路由，但是核心的判断逻辑他没有写
/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export const asyncRoutes = [
	{
		path: '/bill',
		component: Layout,
		name: 'Bill',
		meta: {
			title: '财务管理',
			icon: 'el-icon-s-help',
			roles: ['admin']
		},
		children: [
			{
				path: 'index',
				component: () => import('@/views/bill/index'),
				name: 'Bill1',
				meta: {
					title: '对账单管理',
					icon: 'edit',
					affix: true
				}
			}
		]
	},
	{
		path: '/user',
		component: Layout,
		name: 'User',
		meta: {
			title: '角色权限',
			icon: 'exit-fullscreen',
			roles: ['admin']
		},
		children: [
			{
				path: 'index',
				component: () => import('@/views/user/index'),
				name: 'userIndex',
				meta: { title: '用户管理', icon: 'edit' }
			}
		]
	},
	{
		path: '/permission',
		component: Layout,
		redirect: '/permission/page',
		alwaysShow: true, // will always show the root menu
		name: 'Permission',
		hidden: true,
		meta: {
			title: 'Permission',
			icon: 'lock',
			roles: ['admin'] // you can set roles in root nav
		},
		children: [
			{
				path: 'page',
				component: () => import('@/views/permission/page'),
				name: 'PagePermission',
				meta: {
					title: 'Page Permission',
					roles: ['admin'] // or you can only set roles in sub nav
				}
			},

			{
				path: 'directive',
				component: () => import('@/views/permission/directive'),
				name: 'DirectivePermission',
				meta: {
					title: 'Directive Permission'
					// if do not set roles, means: this page does not require permission
				}
			},
			{
				path: 'role',
				component: () => import('@/views/permission/role'),
				name: 'RolePermission',
				meta: {
					title: 'Role Permission',
					roles: ['admin']
				}
			}
		]
	},

	// /** when your routing map is too long, you can split it into small modules **/
	// componentsRouter,
	// chartsRouter,
	// nestedRouter,
	// tableRouter,

	{
		path: '/error',
		component: Layout,
		redirect: 'noRedirect',
		name: 'ErrorPages',
		meta: {
			title: 'Error Pages',
			icon: '404'
		},
		children: [
			{
				path: '401',
				component: () => import('@/views/error-page/401'),
				name: 'Page401',
				meta: { title: '401', noCache: true }
			},
			{
				path: '404',
				component: () => import('@/views/error-page/404'),
				name: 'Page404',
				meta: { title: '404', noCache: true }
			}
		]
	}

	// {
	//   path: '/error-log',
	//   component: Layout,
	//   children: [
	//     {
	//       path: 'log',
	//       component: () => import('@/views/error-log/index'),
	//       name: 'ErrorLog',
	//       meta: { title: 'Error Log', icon: 'bug' }
	//     }
	//   ]
	// },

	// 404 page must be placed at the end !!!
]

const createRouter = () => new Router({
	// mode: 'history', // require service support
	scrollBehavior: () => ({ y: 0 }),
	routes: constantRoutes
})

const router = createRouter()

export function resetRouter() {
	const newRouter = createRouter()
	router.matcher = newRouter.matcher // reset router
}

export default router
