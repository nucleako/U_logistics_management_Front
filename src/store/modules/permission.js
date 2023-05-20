
import { asyncRoutes, constantRoutes } from '@/router'

/**
 * Use meta.role to determine if the current user has permission
 * @param roles
 * @param route
 */
function hasPermission(roles, route) {
  if (route.meta && route.meta.roles) {
    return roles.some(role => route.meta.roles.includes(role))
  } else {
    return true
  }
}

/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param roles
 */
export function filterAsyncRoutes(routes, roles) {
  const res = []

  routes.forEach(route => {
    const tmp = { ...route }
    if (hasPermission(roles, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, roles)
      }
      res.push(tmp)
    }
  })

  return res
}

const state = {
  routes: [],
  addRoutes: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  }
}

const actions = {
  generateRoutes({ commit }, roles) { //角色的过滤
    return new Promise(resolve => {
      let accessedRoutes
      if (roles.includes('admin')) {
        accessedRoutes = asyncRoutes || []
      }
      // 可删除
      else if(roles.includes('viewer')){
        accessedRoutes = filterAsyncRoutes(asyncRoutes, roles)
      }
      else {
        accessedRoutes = filterAsyncRoutes(asyncRoutes, roles)
      }
      commit('SET_ROUTES', accessedRoutes)
      resolve(accessedRoutes)
    })
  },
  generateRoutes({ commit }, roles) {//角色的过滤
    // console.log(roles)//用户的权限
    return new Promise(resolve => {
      let accessedRoutes
      var arr = []
      //进行异步数组的过滤
      for(var k in roles){//将用户所有的角色遍历
        console.log(roles[k])//角色名称
        asyncRoutes.forEach((item)=>{//依次和异步路由中的roles对比
          if( item.meta && item.meta.roles ){
            if(item.meta.roles.includes(roles[k])){
              arr.push(item)//将符合要求的路由放入新数组
            }
          }
        })
      }
    //   console.log(arr)
      accessedRoutes = arr || []
      commit('SET_ROUTES', accessedRoutes)
      resolve(accessedRoutes)
    })
  }

}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
