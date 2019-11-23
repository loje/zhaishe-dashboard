import Vue from 'vue'
import VueRouter from 'vue-router'
import leftRoutes from './leftnav'

Vue.use(VueRouter)

const routes = [
  {
    name: 'layout',
    component: () => import('@/components/Layout'),
    path: '',
    children: [
      {
        path: '/',
        name: '首页',
        meta: { menu: false, keepAlive: true },
        component: () => import('@/views/index')
      },
      {
        path: '/login',
        name: '登录',
        meta: { menu: false, keepAlive: true },
        component: () => import('@/views/Login/index')
      },
      {
        path: '',
        children: leftRoutes,
      },
    ],
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
