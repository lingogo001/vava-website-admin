import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'

console.log('当前环境', process.env.NODE_ENV)
console.log('请求base_url', process.env.VUE_APP_BASE_API)
// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // api 的 base_url
  withCredentials: true, // 跨域请求时发送 cookies
  timeout: 5000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    // Do something before request is sent
    if (store.getters.token) {
      config.headers['token'] = getToken() // 让每个请求携带token--
    }
    return config
  },
  error => {
    // Do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get information such as headers or status
   * Please return  response => response
  */
  /**
   * 下面的注释为通过在response里，自定义code来标示请求状态
   * 当code返回如下情况则说明权限有问题，登出并返回到登录页
   * 如想通过 XMLHttpRequest 来状态码标识 逻辑可写在下面error中
   * 以下代码均为样例，请结合自生需求加以修改，若不需要，则可删除
   */
  response => {
    return response.data
  },
  error => {
    if (error.response && error.response.status && error.response.data) Message({ message: error.response.data.message, type: 'error', duration: 5 * 1000 })
    return Promise.reject(error)
  }
)

export default service