import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'
import qs from 'qs'

// create an axios instance
const service = axios.create({
  // 框架中使用了静态变量
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 5000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent

    if (store.getters.token) {
      // let each request carry token
      // ['X-Token'] is a custom headers key
      // please modify it according to the actual situation
      config.headers['Authorization'] = getToken()
    }
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
  */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  // 响应拦截器
  response => {
    const res = response.data
    // if the custom code is not 20000, it is judged as an error.
    return res
  },
  error => {
    console.log('err' + error) // for debug
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

/**
  get方式请求
*/
export function get(url, params) {
  return service({
    method: 'get',
    url,
    params, // get 请求时带的参数
    timeout: 10000,
    headers: {
      'X-Requested-With': 'XMLHttpRequest'
      // 'Authorization': $store.getters.token
    }
  })
}

/**
 * 提交post请求 发送的数据为查询字符串，key=val&key=val
*/
export function post(url, data) {
  return service({
    method: 'post',
    url,
    data: qs.stringify(data),
    timeout: 10000,
    headers: {
      'X-Requested-With': 'XMLHttpRequest',
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    }
  })
}

/**
 * 提交post请求 ,查询字符串，对象中嵌套数组的格式
 * {user_id:'1',
 * order_info:[{id:'1',name:'111'},{id:'2',name:'222'}]}
 * user_id=1&order_info[0].id=1&order_info[0].name=111&order_info[1].id=2&order_info[1].name=222
*/
export function post_obj_array(url, data) {
  return service({
    method: 'post',
    url,
    data: qs.stringify(data, { allowDots: true }),
    timeout: 10000,
    headers: {
      'X-Requested-With': 'XMLHttpRequest',
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    }
  })
}

/**
 * 提交post请求 发送的数据为查询字符串，当参数为数组的时候适用该方法
 * qs.stringify({ a: ['b', 'c'] }, { arrayFormat: 'repeat' })
 'a=b&a=c'
*/
export function post_array(url, data) {
  return service({
    method: 'post',
    url,
    data: qs.stringify(data, { arrayFormat: 'repeat' }),
    timeout: 10000,
    headers: {
      'X-Requested-With': 'XMLHttpRequest',
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    }
  })
}
/**
 * 提交post请求 发送的数据为json字符串
*/
export function post_json(url, data) {
  return service({
    method: 'post',
    url,
    data,
    timeout: 10000
  })
}
export default service
