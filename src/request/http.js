/**
 * axios封装
 * 请求拦截、响应拦截、错误统一处理
 */

import axios from 'axios'
import router from '../router/index'
import { Message } from 'element-ui'

//请求超时时间
axios.defaults.timeout = 10000

//post请求头
axios.defaults.headers.post['Content-Type'] = 'application/json;charset=UTF-8'

//允许携带cookie
axios.defaults.withCredentials = true

// 响应拦截器
axios.interceptors.response.use(
  response => {
    if (response.status === 200) {
      return Promise.resolve(response)
    } else {
      return Promise.reject(response)
    }
  },
  // 服务器状态码不是200的情况
  error => {
    if (error.response.status) {
      switch (error.response.status) {
        // 401: 未登录
        // 未登录则跳转登录页面，并携带当前页面的路径
        case 401:
          router.push({ path: '/login' })
          break
        // 登录过期对用户进行提示
        // 跳转登录页面
        case 403:
          Message.error('登录过期，请重新登录')
          router.push({ path: '/login' })
          break
        // 404请求不存在
        case 404:
          Message.error('网络请求不存在')
          router.push({ path: '/login' })
          break
        // 其他错误，直接抛出错误提示
        default:
          Message.error('其他错误')
      }
      return Promise.reject(error.response)
    }
  }
)


/**
 * get方法
 * @param{String} url [请求的url]
 * @param{Object} params [请求时携带的参数]
 */

export function get(url, params) {
  return new Promise((resolve, reject) => {
    axios.get(url, {
      params: params
    }).then(res => {
      resolve(res.data)
    }).catch(err => {
      reject(err.data)
    })
  })
}

/**
 * get方法
 * @param{String} url [请求的url]
 * @param{Object} params [请求时携带的参数]
 */

export function post(url, params) {
  return new Promise((resolve, reject) => {
    axios.post(url, params)
      .then(res => {
        resolve(res.data)
      }).catch(err => {
        reject(err.data)
      })
  })
}