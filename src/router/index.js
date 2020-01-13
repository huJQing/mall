import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const home = () => import(/* webpackChunkName: "about" */ '../views/home.vue')
const goodsInfo = () => import(/* webpackChunkName: "about" */ '../views/goodsInfo.vue')
const search = () => import(/* webpackChunkName: "about" */ '../views/search.vue')
const login = () => import(/* webpackChunkName: "about" */ '../views/login.vue')
const user = () => import(/* webpackChunkName: "about" */ '../views/user/user.vue')
const account = () => import(/* webpackChunkName: "about" */ '../views/user/account.vue')
const cart = () => import(/* webpackChunkName: "about" */ '../views/cart.vue')
const checkout = () => import(/* webpackChunkName: "about" */ '../views/checkout.vue')
const address = () => import(/* webpackChunkName: "about" */ '../views/user/address.vue')
const payment = () => import(/* webpackChunkName: "about" */ '../views/payment.vue')
const order = () => import(/* webpackChunkName: "about" */ '../views/user/order.vue')
const orderDetail = () => import(/* webpackChunkName: "about" */ '../views/user/orderDetail.vue')

const routes = [
  { path: '/', redirect: '/home' },
  {
    path: '/home',
    name: 'home',
    component: home
  },
  {
    path: '/goodsInfo/:goodsId',
    name: 'goodsInfo',
    component: goodsInfo,
    props: true
  },
  {
    path: '/search/:selectKey',
    name: 'search',
    component: search,
    props: true
  },
  {
    path: '/login',
    name: 'login',
    component: login,
  },
  {
    path: '/cart',
    name: 'cart',
    component: cart,
  },
  {
    path: '/checkout',
    name: 'checkout',
    component: checkout,
  },
  {
    path: '/payment/:orderId',
    name: 'payment',
    component: payment,
    props: true
  },
  {
    path: '/user',
    name: 'user',
    component: user,
    children: [
      {
        path: 'account',
        name: 'account',
        component: account,
      },
      {
        path: 'address',
        name: 'address',
        component: address,
      },
      {
        path: 'order',
        name: 'order',
        component: order,
      },
      {
        path: 'order/detail/:orderId',
        name: 'orderDetail',
        component: orderDetail,
        props: true
      }
    ]
  }
]

const router = new VueRouter({
  base: process.env.BASE_URL,
  routes,
  scrollBehavior() {
    return { x: 0, y: 0 }
  }
})

export default router
