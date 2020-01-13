<template>
  <div class="topBar" @mouseleave="mouseoutGoodslist($event)">
    <nav class="nav">
      <el-row type="flex" align="middle">
        <el-col :span="11">
          <div class="category-list">
            <ul @mouseenter="mouseenterGoodslist()">
              <li @click="gotoHome">首页</li>
              <li>手机</li>
              <li>电视</li>
              <li>笔记本</li>
              <li>家电</li>
              <li>路由器</li>
              <li>智能硬件</li>
            </ul>
          </div>
        </el-col>

        <el-col :span="5" :offset="6" class="select-input">
          <el-input
            placeholder="请输入内容"
            class="input-with-select"
            size="small"
            @focus="goodsListShow=false"
            ref="selectInput"
            v-model="selectKey"
            @keyup.enter.native="gotoSelectPage"
          >
            <el-button slot="append" icon="el-icon-search" @click="gotoSelectPage"></el-button>
          </el-input>
        </el-col>

        <el-col :span="2">
          <div class="cart-popover" v-if="showMiniCart">
            <el-popover
              popper-class="cart-wrap"
              placement="bottom-end"
              width="350"
              trigger="hover"
              style="float:right"
              :visible-arrow="false"
            >
              <mini-cart class="mini-cart-wrap"></mini-cart>
              <i
                class="iconcart_icon cart-icon"
                slot="reference"
                @mouseenter="goodsListShow = false"
                @click="gotoCart"
              ></i>
            </el-popover>
          </div>

          <div class="user-dropdown">
            <i
              class="iconmy_icon user-icon"
              style="float:right"
              v-show="!isLogin"
              @click="gotoLogin"
            ></i>
            <el-dropdown style="float:right" v-show="isLogin" @command="clickUserHandel">
              <span class="el-dropdown-link" @mouseenter="goodsListShow = false">
                <i class="iconmy_icon user-icon"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="account">个人中心</el-dropdown-item>
                <el-dropdown-item command="order">我的订单</el-dropdown-item>
                <el-dropdown-item command="address">收货地址</el-dropdown-item>
                <el-dropdown-item command="logout">退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </el-col>
      </el-row>
    </nav>

    <el-collapse-transition>
      <div class="top-goods-list-wrap" v-if="goodsListShow">
        <div class="top-goods-list">
          <ul>
            <li v-for="item of goodsList" :key="item.name">
              <img :src="item.img" />
              <div class="name">{{item.name}}</div>
              <div class="price">{{item.price}}</div>
            </li>
            <li></li>
          </ul>
        </div>
      </div>
    </el-collapse-transition>
  </div>
</template>

<script>
import { checkUserIsLogin, logout } from '../request/api'
import router from '../router';
import MiniCart from './MiniCart'

export default {
  name: 'TopBar',
  components: { MiniCart },
  data() {
    return {
      goodsListShow: false,
      goodsList: [
        {
          name: "小米CC9 Pro",
          price: '2799元起',
          img: require('../assets/image/xiaomi cc9 pro.png')
        },
        {
          name: "小米9 Pro 5G",
          price: '3699元起',
          img: require('../assets/image/xiaomi9 pro 5G.png')
        },
        {
          name: "小米MIX Alpha",
          price: '19999元起',
          img: require('../assets/image/xiaomi mixa.png')
        },
        {
          name: "小米CC9",
          price: '1499元起',
          img: require('../assets/image/xiaomi cc9.png')
        },
        {
          name: "小米CC9e",
          price: '1099元起',
          img: require('../assets/image/xiaomi cc9e.png')
        },
        {
          name: "小米CC9 美图定制版",
          price: '2199元起',
          img: require('../assets/image/xiaomi cc9 pro meitu.png')
        },
      ],
      selectKey: '',
      goodsListShowTimeout: {},
      isLogin: false, //是否登录
      cartList: [],//购物车列表
      showMiniCart: true,//是否显示购物车按钮
    }
  },
  methods: {
    /*鼠标移入商品列表时显示商品列表*/
    mouseenterGoodslist() {
      this.goodsListShowTimeout = setTimeout(() => {
        this.goodsListShow = true;
        this.$refs.selectInput.blur();
      }, 250)
    },
    /*鼠标移出商品列表时隐藏商品列表*/
    mouseoutGoodslist(e) {
      clearTimeout(this.goodsListShowTimeout)
      if (e.pageY > 320 || e.clientY <= 0) {
        this.goodsListShow = false;
      }
    },
    /*监听页面滚动事件，页面向下滚动后隐藏topBar商品列表*/
    pageScroll() {
      let scroll = document.documentElement.scrollTop || document.body.scrollTop;
      if (scroll > 300) {
        this.goodsListShow = false;
      }
    },
    //跳转至搜索页面
    gotoSelectPage() {
      if (this.selectKey == '') return
      window.open('#/search/' + this.selectKey, '_blank');
      this.selectKey = ''
    },
    //跳转至登录页面
    gotoLogin() {
      if (!this.isLogin) {
        router.push('/login')
      }
    },
    //跳转至购物车
    gotoCart() {
      if (this.isLogin) {
        router.push('/cart')
      }
    },
    //跳转至首页
    gotoHome() {
      router.push('/home')
    },
    //点击用户头像下拉菜单中item的回调
    clickUserHandel(value) {
      //退出登录
      if (value === "logout") {
        logout().then(res => {
          if (res.code === 200) {
            router.push('/home')
          }
        })
      }
      //跳转用户界面
      if (this.isLogin && (this.$route.path != '/user/' + value)) {
        router.push('/user/' + value)
      }
    },
    //获取用户信息，判断是否登录
    checkUserIsLogin() {
      checkUserIsLogin().then(res => {
        if (res.code == 200) {
          this.isLogin = true;
        }
        console.log(res)
      })
    },
  },
  mounted() {
    this.checkUserIsLogin()
    this.showMiniCart = this.$route.name !== 'cart'
    window.addEventListener('scroll', this.pageScroll)
  },
}
</script>

<style lang="scss" scope>
.topBar {
  height: 5em;
  background: #ffffff;
  .nav {
    width: 75em;
    height: 100%;
    margin: 0 auto;
    background: #ffffff;
    .category-list {
      ul {
        height: 5em;
        line-height: 5em;
        li {
          padding: 0 1em;
          float: left;
        }
        li:hover {
          cursor: pointer;
        }
        li:first-child {
          padding-left: 0;
        }
      }
    }

    .select-input {
      padding-right: 1em;
    }

    .user-dropdown {
      cursor: pointer;
      float: right;
      /deep/.el-dropdown {
        font-size: 22px;
      }
      .user-icon {
        color: #606266;
        font-weight: normal;
        font-size: 22px;
      }
    }
    .cart-popover {
      cursor: pointer;
      float: right;
      margin-left: 2em;
      .cart-icon {
        color: #606266;
        font-weight: normal;
        font-size: 22px;
      }
    }
  }

  .top-goods-list-wrap {
    height: 15em;
    width: 100%;
    background: #ffffff;
    border-top: 1px solid #ccc;
    z-index: 99999;
    position: relative;
    left: 0px;
    top: 0px;
    box-shadow: 0px 20px 15px -20px rgba(0, 0, 0, 0.2);
    text-align: center;
    .top-goods-list {
      height: 15em;
      width: 75em;
      margin: 0 auto;
      ul {
        height: 11em;
        width: 100%;
        padding: 2em 0;
        display: flex;
        justify-content: space-around;
        li {
          cursor: pointer;
          img {
            height: 7.5em;
            width: 11em;
            border-right: 1.5px solid #eeeeee;
          }
          .name {
            font-size: 12px;
            margin-top: 1.5em;
          }
          .price {
            margin-top: 0.25em;
            font-size: 12px;
            color: #409eff;
          }
        }

        li:nth-child(6) > img {
          border-right: none;
        }
      }
    }
  }
}
.el-popper {
  padding: 0;
}
//修改popover样式
.cart-wrap {
  padding: 0;
  font-size: 16px;
  box-shadow: 0 2px 15px 2px rgba(0, 0, 0, 0.15);
  /*修改滚动条样式*/
  div::-webkit-scrollbar {
    width: 10px;
    height: 10px;
  }
  div::-webkit-scrollbar-track {
    background: rgb(239, 239, 239);
    border-radius: 2px;
  }
  div::-webkit-scrollbar-thumb {
    background: #bfbfbf;
    border-radius: 10px;
  }
  div::-webkit-scrollbar-thumb:hover {
    background: #999;
  }
  div::-webkit-scrollbar-corner {
    background: #179a16;
  }
  .mini-cart-wrap {
    width: 21.875rem;
  }
}
</style>