import Vue from 'vue'
import VueRouter from 'vue-router'
import routes from './router'
import store from '../store/index'
import { getLocalStorage } from '@/utils/localStorage'

Vue.use(VueRouter)

const router = new VueRouter({
  routes
})

// 权限控制

// {
//   path: 'bar',
//   component: Bar,
//   // a meta field
//   meta: { requiresAuth: true }
// }

router.beforeEach((to, from, next) => {
  // 清除 公共搜索框的内容
  store.dispatch('setsearchInp', '')
  const token = store.state.module1.token || getLocalStorage('token')

  if ((!token) && (to.name !== 'login')) {
    next({
      path: '/home/login',
      query: { redirect: to.fullPath }
    })
  } else {
    // 登录成功后不然后退到登录页
    if (token && (to.name === 'login')) {
      next({
        path: '/home/index'
      })
    } else {
      next()
    }
  }

  // if (to.matched.some(record => record.meta.requiresAuth)) {
  //   // console.log(to.matched.some(record => record.meta.requiresAuth))
  //   // this route requires auth, check if logged in
  //   // if not, redirect to login page.
  //   const token = getLocalStorage('token')
  //   // console.log('token', token)
  //   // console.log(to)
  //   if ((!token) && (to.name !== 'login')) {
  //     next({
  //       path: '/home/login',
  //       query: { redirect: to.fullPath }
  //     })
  //   } else {
  //     next()
  //   }

// } else {
//   next()
// }
})
export default router
