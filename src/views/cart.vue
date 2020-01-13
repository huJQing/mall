<template>
  <div id="cart">
    <top-bar></top-bar>
    <div class="cart-box" v-if="!showNoDataBox">
      <el-row class="cart-list-header">
        <el-col :span="4" class="header-col">
          <el-checkbox v-model="allSelected" @change="allSelectedChange"></el-checkbox>
          <span class="checkAll">全选</span>
        </el-col>
        <el-col :span="9" class="header-col">商品信息</el-col>
        <el-col :span="3" class="header-col">单价</el-col>
        <el-col :span="3" class="header-col">数量</el-col>
        <el-col :span="3" class="header-col">小计</el-col>
        <el-col :span="2" class="header-col">操作</el-col>
      </el-row>
      <div class="cart-list-content" v-loading="cartList.length > 0 ? false : true">
        <div class="goods-item" v-for="item of cartList" :key="item.id">
          <el-col :span="4" class="item-col">
            <el-checkbox class="checkbox" v-model="item.selected"></el-checkbox>
            <img :src="item.versionImg[0]" class="cart-item-img" @click="gotoGoodsInfo(item)" />
          </el-col>
          <el-col :span="9" class="item-col">
            <div class="goods-info">
              <h4 class="goods-name" @click="gotoGoodsInfo(item)">{{ item.goodsName }}</h4>
              <p class="goods-version">{{ item.versionName + " " + item.color }}</p>
            </div>
          </el-col>
          <el-col :span="3" class="item-col">{{ item.price }}元</el-col>
          <el-col :span="3" class="item-col">
            <el-input-number
              size="small"
              v-model="item.count"
              :min="1"
              @change="addGoodsCountInCart(item)"
            ></el-input-number>
          </el-col>
          <el-col :span="3" class="item-col item-total-price">{{ item.count * item.price }}元</el-col>
          <el-col :span="2" class="item-col">
            <i class="el-icon-circle-close delete-goods-icon" @click="deleteGoodsInCart(item.id)"></i>
          </el-col>
        </div>
      </div>

      <el-row
        class="cart-list-footer"
        :class="{ 'cart-list-footer-fiexd': listFooterFiexd }"
        ref="cartListFooter"
      >
        <el-col :span="2" class="footer-col">
          <p class="back-shooping" @click="gotoHome">继续购物</p>
        </el-col>
        <el-col :span="14" class="footer-col goods-total">
          共
          <span class="total-num-strong">{{ totalGoods }}</span> 件商品， 已选择
          <span class="total-num-strong">{{ totalSelectGoods }}</span> 件
        </el-col>
        <el-col :span="4" class="footer-col">
          <h3 class="total-price">
            应付总额：
            <span class="price">{{ totalPrice }}</span> 元
          </h3>
        </el-col>
        <el-col :span="3" :offset="1" class="footer-col">
          <el-button
            type="primary"
            class="goto-buy"
            :disabled="totalSelectGoods > 0 ? false : true"
            @click="gotoCheckOut"
          >现在结算</el-button>
        </el-col>
      </el-row>
    </div>

    <div class="no-data" v-if="showNoDataBox">
      <div class="no-data-tips">
        <p>您的购物车中还没有商品</p>
        <el-button type="primary" class="back-shooping" @click="gotoHome">马上去购物</el-button>
      </div>
    </div>

    <div class="test"></div>
  </div>
</template>

<script>
import TopBar from "../components/TopBar"
import {
  deleteGoodsInCart,
  getCartInfo,
  checkUserIsLogin,
  addGoodsCountInCart,
  updateCartSelected
} from "../request/api"
import router from "../router"
//import storage from '../utils/storage'

export default {
  name: "cart",
  components: { TopBar },
  data() {
    return {
      cartList: [], //购物车列表
      listFooterFiexd: false,
      showNoDataBox: false //是否显示没有数据的提示
    }
  },
  computed: {
    //总计商品数
    totalGoods: function () {
      let totalGoods = 0
      this.cartList.forEach((item) => {
        totalGoods += item.count
      })
      return totalGoods
    },
    //当前选中
    totalSelectGoods: function () {
      let totalSelectGoods = 0
      this.cartList.forEach((item) => {
        if (item.selected) {
          totalSelectGoods += item.count
        }
      })
      return totalSelectGoods
    },
    //总计价格
    totalPrice: function () {
      let totalPrice = 0
      this.cartList.forEach((item) => {
        if (item.selected) {
          totalPrice += item.count * item.price
        }
      })
      return totalPrice
    },
    //是否全选
    allSelected: function () {
      return this.cartList.every((item) => item.selected)
    }
  },
  methods: {
    //全选按钮改变时的回调
    allSelectedChange(value) {
      window.console.log(value)
      this.cartList.forEach((item) => {
        item.selected = value
      })
    },
    //跳转商品页面
    gotoGoodsInfo(item) {
      window.open("#/goodsInfo/" + item.goodsId, "_blank")
    },
    //从购物车中删除商品
    deleteGoodsInCart(id) {
      this.$confirm("您确定删除该商品吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          return deleteGoodsInCart({
            cartItemId: id
          })
        })
        .then((res) => {
          if (res.code === 200) {
            this.getCartInfo()
            this.$message.success("删除商品成功！")
          } else {
            this.$message.success("删除收货失败！")
          }
        })
    },
    //修改商品数量
    addGoodsCountInCart(item) {
      window.console.log(item)
      addGoodsCountInCart({
        cartItemId: item.id,
        count: item.count
      }).then((res) => {
        window.console.log(res)
      })
    },
    //跳转至首页
    gotoHome() {
      router.push("/home")
    },
    //跳转至收银台
    gotoCheckOut() {
      //获取购物车中选中的商品
      let checkOutList = []
      this.cartList.forEach((item) => {
        if (item.selected) {
          checkOutList.push(item.id)
        }
      })
      //更新购物车中选中的商品
      updateCartSelected({
        selectedList: checkOutList
      }).then((res) => {
        if (res.code === 200) {
          router.push("/checkout")
        }
      })
    },
    //获取购物车中商品信息
    getCartInfo() {
      checkUserIsLogin()
        .then((res) => {
          if (res.code === 200) {
            return getCartInfo()
          } else if (res.code === 401) {
            router.push("/login")
          }
        })
        .then((res) => {
          if (res.code === 200) {
            res.data.forEach((item) => {
              item.selected = !!item.selected
            })
            this.cartList = res.data
            this.showNoDataBox = false
            this.$nextTick(() => {
              this.computedFlexd()
            })
          } else {
            this.cartList = []
            this.showNoDataBox = true
          }
        })
    },
    /*计算cart-list-footer是否为flexd布局*/
    computedFlexd() {
      //获取页面滚动高度
      let scroll = document.documentElement.scrollTop || document.body.scrollTop

      //获取当前body隐藏部分的总高度
      //document.documentElement.scrollHeight 文档总高度
      //document.documentElement.clientHeight 视口高度
      //相减即为当前被隐藏的总高度
      let height = document.documentElement.scrollHeight - document.documentElement.clientHeight

      // 160是cart-list-footer底部剩下所有元素的高度
      // 88是cart-list-footer底部剩下所有元素的高度减去cart-list-footer本身的72px的高度
      // 当cart-list-footer不为flexd时，他的高度会算到body的高度中去，
      // 所以这里需要判断当前cart-list-footer是否为flexd状态，减去不同的高度数值，否则会造成页面元素闪烁
      height = this.listFooterFiexd ? height - 88 : height - 160

      if (scroll >= height) {
        this.listFooterFiexd = false
      } else {
        this.listFooterFiexd = true
      }
    }
  },
  mounted() {
    this.getCartInfo()
    window.addEventListener("scroll", this.computedFlexd)
    window.addEventListener("resize", this.computedFlexd)
  },
  beforeDestroy() {
    document.removeEventListener("scroll", this.computedFlexd)
  }
}
</script>

<style lang="scss" scoped>
#cart {
  .cart-box {
    width: 75em;
    margin: 0 auto;
    background: #ffffff;
    margin-top: 1em;
    border: 1px solid rgba($color: #000000, $alpha: 0.12);
    box-shadow: 0 3px 8px -6px rgba($color: #000000, $alpha: 0.1);
    .cart-list-header {
      height: 4.5em;
      padding: 0 1em;
      border-bottom: 1px solid rgba($color: #000000, $alpha: 0.12);
      .header-col {
        height: 4.5em;
        line-height: 4.5em;
        text-align: center;
        &:nth-child(-n + 2) {
          text-align: left;
        }
        .checkAll {
          margin-left: 1em;
        }
      }
    }
    .cart-list-content {
      min-height: 7em;
      .goods-item {
        height: 7em;
        padding: 0 1em;
        border-bottom: 1px solid rgba($color: #000000, $alpha: 0.05);
        &:last-child {
          border-bottom: none;
        }
        .item-col {
          height: 7em;
          line-height: 7em;
          position: relative;
          text-align: center;
          &:nth-child(-n + 2) {
            text-align: left;
          }
          .checkbox {
            float: left;
          }
          .cart-item-img {
            height: 5em;
            width: 5em;
            margin: 1em 0 0 4em;
            cursor: pointer;
          }
          .goods-info {
            width: 13.5em;
            height: 3em;
            line-height: 1em;
            margin-top: 2.25em;
            .goods-name {
              margin-bottom: 0.8em;
              cursor: pointer;
            }
            .goods-version {
              font-size: 0.875em;
              color: #999;
              overflow: hidden; /*超出隐藏*/
              white-space: nowrap; /*强制在同一行显示*/
              text-overflow: ellipsis; /*省略号*/
            }
          }
        }

        .item-total-price {
          color: $emTetxColor;
          font-weight: bold;
        }
        .delete-goods-icon {
          font-size: 1.25em;
          cursor: pointer;
          &:hover {
            color: $emTetxColor;
          }
        }
      }
    }

    .cart-list-footer-fiexd {
      position: fixed;
      bottom: 0;
      z-index: 999;
    }
    .cart-list-footer {
      width: 75em;
      height: 4.5em;
      padding: 0 1em;
      border-top: 1px solid rgba($color: #000000, $alpha: 0.12);
      color: #888;
      background: #ffffff;
      .footer-col {
        font-size: 0.875em;
        height: 4.5rem;
        line-height: 4.5rem;
      }
      .back-shooping {
        width: 60%;
        cursor: pointer;
        &:hover {
          color: $emTetxColor;
        }
      }
      .goods-total {
        position: relative;
        .total-num-strong {
          color: $emTetxColor;
        }
        &::before {
          content: "";
          position: absolute;
          left: -1.35rem;
          top: 1.7rem;
          height: 1rem;
          width: 1px;
          background: #dddddd;
        }
      }
      .total-price {
        color: #323232;
        text-align: right;
        .price {
          font-size: 1.5rem;
          color: $emTetxColor;
        }
      }
      .goto-buy {
        width: 100%;
        border-radius: 0;
      }
    }
  }

  .no-data {
    width: 75em;
    height: 35em;
    margin: 0 auto;
    background: url("../../public/images/cart-empty.png") no-repeat;
    background-position: 16em 6em;
    .no-data-tips {
      padding: 13em 0 0 37em;
      p {
        color: #b0b0b0;
        font-size: 2.25em;
        font-weight: 800;
      }
      .back-shooping {
        margin-top: 2em;
        border-radius: 0;
        width: 12rem;
        height: 3rem;
      }
    }
  }

  .test {
    margin-top: 10em;
  }
}
</style>
