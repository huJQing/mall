<template>
  <div id="mini-cart">
    <div class="cart-list" v-if="cartList.length > 0 ? true:false">
      <div class="cart-item" v-for="item of cartList" :key="item.id">
        <img :src="item.versionImg[0]" class="cart-item-img" @click="gotoGoodsInfo(item)" />
        <div class="goods-info">
          <h4 class="goods-name" @click="gotoGoodsInfo(item)">{{item.goodsName}}</h4>
          <p class="goods-version">{{item.versionName+' '+item.color}}</p>
          <p class="goods-price">
            {{'￥'+item.price}}
            <span>{{' x '+ item.count}}</span>
          </p>
        </div>
        <i class="el-icon-circle-close delete-goods-icon" @click="deleteGoodsInCart(item.id)"></i>
      </div>
    </div>
    <div class="money-pannel" v-if="cartList.length > 0 ? true : false">
      <div class="total-content">
        <p class="total-goods">
          共
          <span class="count-strong">{{totalGoods}}</span>件商品
        </p>
        <h5 class="total-price">
          合计：
          <span class="price-icon">￥</span>
          <span class="price-num">{{totalPrice}}</span>
        </h5>
      </div>
      <div class="go-cart-wrap">
        <el-button type="primary" class="go-cart" @click="gotoCart">去购物车结算</el-button>
      </div>
    </div>

    <!--无数据时显示-->
    <div class="no-data-box" v-if="cartList.length == 0 ? true:false">
      <p>您还没有选购任何商品，现在前往商城选购吧！</p>
    </div>
  </div>
</template>

<script>
import { deleteGoodsInCart, getCartInfo } from '../request/api'
import router from '../router';

export default {
  name: "MiniCart",
  data() {
    return {
      cartList: [],
      totalGoods: 0,
      totalPrice: 0
    }
  },
  watch: {
    cartList: function (value) {
      let totalGoods = 0
      let totalPrice = 0
      value.forEach(item => {
        totalGoods += item.count
        totalPrice += item.count * item.price
      });
      this.totalGoods = totalGoods
      this.totalPrice = totalPrice
    }
  },
  methods: {
    //从购物车中删除商品
    deleteGoodsInCart(id) {
      deleteGoodsInCart({
        cartItemId: id
      }).then(res => {
        if (res.code === 200) {
          this.getCartInfo()
        }
        window.console.log(res)
      })
    },
    //获取购物车中商品信息
    getCartInfo() {
      getCartInfo().then(res => {
        if (res.code === 200) {
          this.cartList = res.data
          window.console.log(res)
        } else {
          this.cartList = []
        }
      })
    },
    //跳转至购物车
    gotoCart() {
      router.push('/cart')
    },
    //跳转商品页面
    gotoGoodsInfo(item) {
      window.open('#/goodsInfo/' + item.goodsId, '_blank');
    },
  },
  mounted() {
    this.getCartInfo()
  },
}
</script>

<style lang="scss" scoped>
#mini-cart {
  position: relative;
  .cart-list {
    min-height: 5em;
    max-height: 25em;
    overflow-y: auto;
    padding: 0;
    .cart-item {
      height: 5em;
      padding: 1.5em 1em;
      border-bottom: 1px solid rgba(0, 0, 0, 0.1);
      position: relative;
      .cart-item-img {
        height: 5em;
        width: 5em;
        border: 1px solid rgba(0, 0, 0, 0.08);
        float: left;
        cursor: pointer;
      }
      .goods-info {
        float: left;
        font-size: 0.875em;
        width: 13.5em;
        height: 5rem;
        margin-left: 0.75em;
        .goods-name {
          margin-bottom: 0.8em;
          cursor: pointer;
        }
        .goods-version {
          color: #999;
          overflow: hidden; /*超出隐藏*/
          white-space: nowrap; /*强制在同一行显示*/
          text-overflow: ellipsis; /*省略号*/
        }
        .goods-price {
          font-size: 1em;
          color: $emTetxColor;
          margin-top: 0.8em;
          font-weight: 700;
          span {
            font-size: 12px;
            color: #cccccc;
            margin-left: 0.75em;
            font-weight: normal;
          }
        }
      }
      .delete-goods-icon {
        display: none;
        position: absolute;
        top: 50%;
        right: 0;
        transform: translate(-50%, -50%);
        font-size: 1.375em;
        color: #cccccc;
        cursor: pointer;
        &:hover {
          color: $emTetxColor;
        }
      }
      &:hover {
        .delete-goods-icon {
          display: block;
        }
      }
      &:last-child {
        border-bottom: none;
      }
    }
  }
  .money-pannel {
    height: 4.6em;
    background: rgba(0, 0, 0, 0.02);
    box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.15);
    padding: 0 1em;
    .total-content {
      width: 50%;
      float: left;
      padding-top: 1em;
      .total-goods {
        font-size: 0.75rem;
        color: #bbbbbb;
        .count-strong {
          font-size: 0.875rem;
          font-weight: 600;
          margin-right: 3px;
        }
      }
      .total-price {
        .price-icon {
          color: $emTetxColor;
          font-size: 0.75rem;
        }
        .price-num {
          color: $emTetxColor;
          font-size: 1.25rem;
        }
      }
    }
    .go-cart-wrap {
      height: 100%;
      width: 40%;
      float: right;
      .go-cart {
        display: block;
        width: 100%;
        height: 3em;
        border-radius: 0;
        margin-top: 1.1em;
      }
    }
    &::after {
      content: "";
      display: block;
      height: 0;
      clear: both;
      visibility: hidden;
    }
  }

  .no-data-box {
    height: 5em;
    p {
      color: #bbbbbb;
      font-size: 0.875em;
      text-align: center;
      padding-top: 2rem;
    }
  }
}
</style>