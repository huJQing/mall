/**
 * API统一接口
 */

import { post } from './http'

const url = '/api'

/*获取首页配置*/
export const getHomeConfig = p => post(url + 'home/homeConfig', p)

/*通过商品ID获取商品详细信息*/
export const getGoodsInfoById = (p) => post(url + 'goods/getGoodsInfoById', p)

/*通过商品关键词查询商品信息*/
export const selectGoods = (p) => post(url + 'goods/selectGoods', p)

/*用户登录*/
export const login = (p) => post(url + 'users/login', p)

/*退出登录*/
export const logout = (p) => post(url + 'users/logout', p)

/*用户注册*/
export const register = (p) => post(url + 'users/register', p)

/*检查用户是否登录*/
export const checkUserIsLogin = (p) => post(url + 'users/checkUserIsLogin', p)

/*获取用户信息*/
export const getUserInfo = (p) => post(url + 'users/getUserInfo', p)

/*修改用户昵称*/
export const editNickname = (p) => post(url + 'users/editNickname', p)

/*修改用户手机号*/
export const editPhone = (p) => post(url + 'users/editPhone', p)

/*修改用户登录密码*/
export const editPassword = (p) => post(url + 'users/editPassword', p)

/*修改用户绑定邮箱*/
export const editEmail = (p) => post(url + 'users/editEmail', p)

/*添加商品至购物车*/
export const addGoodsInCart = (p) => post(url + 'cart/addGoodsInCart', p)

/*获取购物车中商品信息*/
export const getCartInfo = (p) => post(url + 'cart/getCartInfo', p)

/*获取购物车中已被选中的商品信息*/
export const getCartSelected = (p) => post(url + 'cart/getCartSelected', p)

/*删除购物车中的商品*/
export const deleteGoodsInCart = (p) => post(url + 'cart/deleteGoodsInCart', p)

/*通过购物车id增加购物车中商品数量*/
export const addGoodsCountInCart = (p) => post(url + 'cart/addGoodsCountInCart', p)

/*更新购物车商品选中状态*/
export const updateCartSelected = (p) => post(url + 'cart/updateCartSelected', p)

/*获取所有收货地址*/
export const getAllAddress = (p) => post(url + 'address/getAllAddress', p)

/*获取所有省、市、区数据*/
export const getAreaData = (p) => post(url + 'address/getAreaData', p)

/*添加收货地址*/
export const addAddress = (p) => post(url + 'address/addAddress', p)

/*删除收货地址*/
export const deleteAddress = (p) => post(url + 'address/deleteAddress', p)

/*更新收货地址*/
export const updateAddress = (p) => post(url + 'address/updateAddress', p)

/*创建订单*/
export const createOrder = (p) => post(url + 'order/createOrder', p)

/*获取订单状态*/
export const getOrderStatus = (p) => post(url + 'order/getOrderStatus', p)

/*订单支付*/
export const payment = (p) => post(url + 'order/payment', p)

/*获取所有订单信息*/
export const getAllOrder = (p) => post(url + 'order/getAllOrder', p)

/*获取单个订单的详细信息*/
export const getOrderInfo = (p) => post(url + 'order/getOrderInfo', p)

/*取消订单*/
export const cancelOrder = (p) => post(url + 'order/cancelOrder', p)
