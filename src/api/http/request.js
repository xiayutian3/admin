/**
 * Created by Hzz on 2020/4/30.
 * http配置
 */

import axios from 'axios'

// import store from './store/store'
// import * as types from './store/types'
import router from '../../router'
import { getLocalStorage } from '@/utils/localStorage'
import { baseURL } from '@/config'

// axios 配置
axios.defaults.timeout = 50 * 1000
axios.defaults.baseURL = baseURL

// http request 拦截器
axios.interceptors.request.use(
  config => {
    // 判断是否存在token，是否登录
    const token = getLocalStorage('token') || ''
    if (token) {
      config.headers.Authorization = `${token}`
    }
    // console.log('config', config)
    return config
  },
  err => {
    return Promise.reject(err)
  }
)

// http response 拦截器
axios.interceptors.response.use(
  response => {
    return response
  },
  error => {
    if (error.response) {
      switch (error.response.status) {
        case 401:
          // 401 清除token信息并跳转到登录页面

          // store.commit(types.LOGOUT)

          // 只有在当前路由不是登录页面才跳转
          router.currentRoute.path !== 'login' &&
            router.replace({
              path: 'login',
              query: { redirect: router.currentRoute.path }
            })
      }
    }
    // console.log(JSON.stringify(error));//console : Error: Request failed with status code 402
    return Promise.reject(error.response.data)
  }
)

export default axios
