import { getToken } from '@/utils/auth'
import Axios from 'axios';
import qs from 'qs'//QS是一个字符串处理的插件，比如我们可以将一个字符串序列化
//比如我们可以将{id:1,name:'zhangsan'} 转化 id=1&name=zhangsan


// 全局配置
const myAxios = Axios.create({
  baseURL: 'http://43.143.93.202:8001/:8001',//网络请求的IP地址
  //http://101.132.249.54:8001/swagger-ui.html
  timeout: 2000,//请求超时
});

myAxios.interceptors.request.use((config)=>{
  if(getToken()){
    config.headers.Authorization = getToken()
  }
  return config
});

//响应接收前的拦截
myAxios.interceptors.response.use(function (response) {
  // 将后台的参数结果设置到response(数据封装)
  let {data} = response;
  response.data = data.data;
  response.status = data.status;
  response.statusText = data.message;
  // 统一异常处理(设置的更加复杂)
  if(data.status !== 200){
    // Toast(data.message);
    return Promise.reject(data.message);
  }
  return response;
}, function (error) {
//   Toast("网络异常")
  return Promise.reject(error);
});


/**
  get方式请求
*/
export function get (url, params) {
  return myAxios({
    method: 'get',
    url,
    params, // get 请求时带的参数
    timeout: 10000,
    headers: {
      'X-Requested-With': 'XMLHttpRequest'
    }
  })
}


/**
 * 提交post请求 发送的数据为查询字符串，key=val&key=val
*/
export function post(url,data){
  return myAxios({
    method:"post",
    url,
    data:qs.stringify(data),
    timeout:10000,
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
export function post_obj_array(url,data){
  return myAxios({
    method:"post",
    url,
    data:qs.stringify(data,{allowDots:true}),
    timeout:10000,
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
export function post_array(url,data){
  return myAxios({
    method:"post",
    url,
    data:qs.stringify(data,{arrayFormat:"repeat"}),
    timeout:10000,
    headers: {
      'X-Requested-With': 'XMLHttpRequest',
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    }
  })
}
/**
 * 提交post请求 发送的数据为json字符串
*/
export function post_json(url,data){
  return myAxios({
    method:"post",
    url,
    data,
    timeout:10000
  })
}
