// reque.js是vue-admin封装的axios文件
import request from '@/utils/request'

export function login(data) {
  return request({
    // 等同于我们之前封装好的axios对象
    url: '/user/login',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: '/user/findInfoByToken',
    method: 'get',
    headers: {
      Authorization: token
    }
  })
}

export function logout() {
  return request({
    url: '/user/logout',
    method: 'post'
  })
}
