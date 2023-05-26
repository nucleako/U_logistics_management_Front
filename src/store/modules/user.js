// 从api中获取登录，退出，获取用户身份三个方法
import { login, logout, getInfo } from '@/api/user'
// 从auth文件中获取设置token，获取token，删除token三个方法
import { getToken, setToken, removeToken } from '@/utils/auth'
// 获取路由对象
import router, { resetRouter } from '@/router'

const state = {
	token: getToken(),
	name: '',
	avatar: '',
	introduction: '',
	roles: [],
	// 拿到token的时候把整个对象给user_data
	user_data: null
}

const mutations = {
	SET_TOKEN(state, token) {
		state.token = token
		state.isLogin = true
		state.expiredAt = new Date().getTime() + 3600 * 1000 // 过期时间为1小时
		window.localStorage.setItem('token', token) // 将Token信息存储在localStorage中
	},
	REMOVE_TOKEN(state) {
		state.token = null
		state.isLogin = false
		state.expiredAt = 0
		window.localStorage.removeItem('token') // 将Token信息从localStorage中删除
	},

	SET_INTRODUCTION: (state, introduction) => {
		state.introduction = introduction
	},
	SET_NAME: (state, name) => {
		state.name = name
	},
	// 设置user_Data的方法
	SET_USER_INFO: (state, data) => {
		state.user_data = data
	},
	SET_AVATAR: (state, avatar) => {
		state.avatar = avatar
	},
	SET_ROLES: (state, roles) => {
		state.roles = roles
	}
}

const actions = {
	// user login  this.$store.dispatch('user/login', this.loginForm)
	login({ commit }, userInfo) {
		const { username, password } = userInfo // 解构用户名和密码
		return new Promise((resolve, reject) => {
			// api中的login方法
			login({ username: username.trim(), password: password }).then(response => {
				commit('SET_TOKEN', response.token)
				setToken(response.token)
				resolve()
			}).catch(error => {
				reject(error)
			})
		})
	},

	logout({ commit }) {
		commit('REMOVE_TOKEN')
	},

	// 获取用户身份信息（头像的设置，token设置）
	// get user info
	getInfo({ commit, state }) {
		return new Promise((resolve, reject) => {
			getInfo(state.token).then(response => {
				const { data } = response
				if (!data) {
					reject('Verification failed, please Login again.')
				}
				console.log(data)
				// 将返回的用户的身份数据，设置到项目的各个地方
				const { roles, username, avatar } = data
				console.log('store user,roles=', roles)
				// roles must be a non-empty array
				if (!roles || roles.length <= 0) {
					reject('getInfo: roles must be a non-null array!')
				}
				commit('SET_USER_INFO', data)// user_data
				commit('SET_ROLES', roles)// 权限
				commit('SET_NAME', username)// 用户名
				commit('SET_AVATAR', avatar)// 头像
				resolve(data)
			}).catch(error => {
				reject(error)
			})
		})
	},

	// user logout
	logout({ commit, state, dispatch }) {
		return new Promise((resolve, reject) => {
			logout(state.token).then(() => {
				commit('SET_TOKEN', '')
				commit('SET_ROLES', [])
				removeToken()
				resetRouter()

				// reset visited views and cached views
				// to fixed https://github.com/PanJiaChen/vue-element-admin/issues/2485
				dispatch('tagsView/delAllViews', null, { root: true })

				resolve()
			}).catch(error => {
				reject(error)
			})
		})
	},

	// remove token
	resetToken({ commit }) {
		return new Promise(resolve => {
			commit('SET_TOKEN', '')
			commit('SET_ROLES', [])
			removeToken()
			resolve()
		})
	},

	// dynamically modify permissions
	async changeRoles({ commit, dispatch }, role) {
		const token = role + '-token'

		commit('SET_TOKEN', token)
		setToken(token)

		const { roles } = await dispatch('getInfo')

		resetRouter()

		// generate accessible routes map based on roles
		const accessRoutes = await dispatch('permission/generateRoutes', roles, { root: true })
		// dynamically add accessible routes
		router.addRoutes(accessRoutes)

		// reset visited views and cached views
		dispatch('tagsView/delAllViews', null, { root: true })
	}
}

export default {
	namespaced: true,
	state,
	mutations,
	actions
}
