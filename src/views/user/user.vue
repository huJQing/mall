<template>
  <div id="user">
    <top-bar></top-bar>
    <div class="user-wrap">
      <el-card class="vertical-nav" :body-style="{ padding: '0px' }">
        <div class="user-avatar-wrap">
          <el-image v-if="userInfo.avatar" class="user-avatar" :src="userInfo.avatar" fit="fill"></el-image>
        </div>
        <div
          class="user-nickname"
        >{{userInfo.nickname == null ? userInfo.account : userInfo.nickname}}</div>
        <div class="nav-list">
          <ul>
            <li
              v-for="(item,index) of navList"
              :key="item.name"
              @click="routerToPage(index)"
            >{{item.name}}</li>
          </ul>
        </div>
      </el-card>
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import topBar from './../../components/TopBar'
import { getUserInfo } from '../../request/api'
import router from '../../router/index'

export default {
  name: 'user',
  components: { topBar },
  data() {
    return {
      userInfo: {},//用户信息
      navList: [
        {
          name: "账户资料",
          routerLink: 'account'
        },
        {
          name: "我的订单",
          routerLink: 'order'
        },
        {
          name: "收货地址",
          routerLink: 'address'
        },
        {
          name: "目前不知道放什么",
          routerLink: 'address'
        },
      ]
    }
  },
  methods: {
    //导航到对应页面
    routerToPage(index) {
      if (this.$route.name !== this.navList[index].routerLink) {
        router.replace('/user/' + this.navList[index].routerLink)
      }
    },
    //获取用户信息，判断是否登录
    getUserInfo() {
      getUserInfo().then(res => {
        if (res.code == 200) {
          this.userInfo = res.data;
        }
        console.log(res)
      })
    }
  },
  mounted() {
    this.getUserInfo()
  }
}
</script>

<style lang="scss" scoped>
#user {
  .user-wrap {
    width: 75em;
    margin: 0 auto;
    margin-top: 20px;
    .vertical-nav {
      width: 13em;
      height: 26em;
      background: #ffffff;
      border-radius: 10px;
      padding-top: 1.25em;
      float: left;
      .user-avatar-wrap {
        width: 10em;
        height: 10em;
        margin: 0 auto;
        .user-avatar {
          width: 10em;
          height: 10em;
        }
      }
      .user-nickname {
        height: 2rem;
        line-height: 2rem;
        margin-top: 0.625em;
        font-size: 1.25em;
        text-align: center;
        font-weight: 500;
        overflow: hidden; /*超出隐藏*/
        white-space: nowrap; /*强制在同一行显示*/
        text-overflow: ellipsis; /*省略号*/
      }
      .nav-list {
        margin-top: 0.625em;
        ul {
          li {
            font-size: 0.875em;
            height: 3.6em;
            line-height: 3.6em;
            text-align: center;
            border-top: 1px solid #e8e8e8;
            cursor: pointer;
            &:hover {
              background: $emTetxColor;
            }
          }
        }
      }
    }
  }
}
</style>