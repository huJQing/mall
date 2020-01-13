<template>
  <div id="checkout">
    <top-bar></top-bar>
    <div class="checkout-box">
      <el-card class="box-card address" :body-style="{ padding: '0px' }">
        <div slot="header" class="clearfix">
          <span>收货地址</span>
        </div>
        <delivery-address :canSelect="true" @onSelect="addressSlectedHandel"></delivery-address>
      </el-card>

      <el-card class="box-card goods-list-card" :body-style="{ padding: '0px' }">
        <div slot="header" class="clearfix">
          <span>购物清单</span>
        </div>
        <el-row class="list-header">
          <el-col :span="15">商品信息</el-col>
          <el-col :span="3">单价</el-col>
          <el-col :span="2" :offset="1">数量</el-col>
          <el-col :span="3">应付金额</el-col>
        </el-row>
        <div class="goods-list">
          <el-row class="goods-item" v-for="item of goodsList" :key="item.id">
            <el-col :span="15">
              <img :src="item.versionImg[0]" class="goods-img" />
              <div class="goods-info">
                <p class="goods-name">{{ item.goodsName }}</p>
                <p class="goods-version">{{ item.versionName + " " + item.color }}</p>
              </div>
            </el-col>
            <el-col :span="3" class="price">{{ item.price }}元</el-col>
            <el-col :span="2" :offset="1" class="amount">{{ item.count }}</el-col>
            <el-col :span="3" class="all-price">{{ item.price * item.count }}元</el-col>
          </el-row>

          <el-row class="checkout-bar">
            <el-col :span="2" class="count">
              <p class="head">商品总数</p>
              <p class="num">{{totalGoods}}</p>
            </el-col>
            <el-col :span="2" :offset="1" class="count-price">
              <p class="head">商品总价</p>
              <p class="price">{{totalPrice}}元</p>
            </el-col>
            <el-col :span="4" :offset="12" class="pay-price">
              应付总额:
              <span class="price">{{totalPrice}}元</span>
            </el-col>
            <el-col :span="3" class="submit-order">
              <el-button type="primary" class="submit-btn" @click="submitOrder">提交订单</el-button>
            </el-col>
          </el-row>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script>
import { getCartSelected, createOrder } from "../request/api"
import TopBar from "../components/TopBar"
import DeliveryAddress from "../components/DeliveryAddress"
import router from "../router/index"
export default {
  name: "checkout",
  components: { TopBar, DeliveryAddress },
  data() {
    return {
      goodsList: [],//商品列表
      seletedAddress: {},//选中的地址详情
    }
  },

  computed: {
    //总计商品数
    totalGoods: function () {
      let totalGoods = 0
      this.goodsList.forEach((item) => {
        totalGoods += item.count
      })
      return totalGoods
    },
    //总计价格
    totalPrice: function () {
      let totalPrice = 0
      this.goodsList.forEach((item) => {
        totalPrice += item.count * item.price
      })
      return totalPrice
    },
  },
  methods: {
    //收货地址选中回调
    addressSlectedHandel(address) {
      this.seletedAddress = address
    },
    //获取购物车被选中的商品列表
    getCartSelected() {
      getCartSelected().then((res) => {
        window.console.log(res)
        if (res.code === 200) {
          this.goodsList = res.data
        } else {
          router.push('/cart')
        }
      })
    },
    //提交订单
    submitOrder() {
      let goodsList = []
      this.goodsList.forEach(item => {
        goodsList.push({
          goodsId: item.goodsId,
          goodsVersionId: item.goodsVersionId,
          amount: item.count,
          cartItemId: item.id
        })
      })
      createOrder({
        addressId: this.seletedAddress.id,
        amount: this.totalGoods,
        price: this.totalPrice,
        goodsList: goodsList
      }).then(res => {
        if (res.code === 200) {
          router.push('/payment/' + res.data.orderId)
        } else {
          this.$message.error('订单提交失败！')
        }
      })
    }
  },
  mounted() {
    this.getCartSelected()
  }
}
</script>

<style lang="scss" scoped>
#checkout {
  .checkout-box {
    width: 75em;
    margin: 0 auto;
    margin-top: 20px;
    .address {
      margin-bottom: 20px;
    }
    .goods-list-card {
      margin-bottom: 20px;
      .list-header {
        width: 100%;
        height: 2.5rem;
        font-size: 0.75em;
        padding: 0 1.25rem;
        line-height: 2.5rem;
        text-align: center;
        color: #838383;
        box-shadow: inset 0px 4px 4px -2px rgba($color: #000000, $alpha: 0.05);
        border-bottom: 1px solid #eee;
        .el-col {
          &:first-child {
            text-align: left;
          }
          &:last-child {
            text-align: right;
          }
        }
      }
      .goods-list {
        .goods-item {
          padding: 1em 1.25em;
          border-bottom: 1px solid #eee;
          &:last-child {
            border-bottom: none;
          }
          .goods-img {
            height: 5em;
            width: 5em;
            float: left;
            margin-right: 1.25em;
            border: 1px solid #eee;
          }
          .goods-info {
            height: 3em;
            padding: 1em 0;
            .goods-name {
              font-size: 0.875rem;
            }
            .goods-version {
              margin-top: 0.5em;
              color: #999;
              font-size: 0.75rem;
            }
          }
          .price,
          .amount,
          .all-price {
            height: 5em;
            line-height: 5em;
            font-size: 0.875rem;
            color: #666;
            font-weight: bolder;
          }
          .price,
          .amount {
            text-align: center;
          }
          .all-price {
            text-align: right;
          }
        }

        .checkout-bar {
          padding: 0.75em 1.25em;
          .count {
            border-right: 1px solid #ddd;
          }
          .count,
          .count-price {
            height: 3em;
            .head {
              color: #999;
              font-size: 0.75em;
              margin-top: 0.4em;
            }
            .num {
              font-size: 0.875em;
              margin-top: 0.4em;
            }
            .price {
              color: $emTetxColor;
              font-size: 0.875em;
              margin-top: 0.4em;
            }
          }
          .pay-price {
            height: 3rem;
            line-height: 3rem;
            font-size: 0.875em;
            .price {
              margin-left: 0.5em;
              color: $emTetxColor;
              font-size: 1.25em;
              font-weight: bold;
            }
          }
          .submit-order {
            position: relative;
            height: 3rem;
            .submit-btn {
              position: absolute;
              left: 50%;
              top: 50%;
              transform: translate(-50%, -50%);
              width: 100%;
              border-radius: 0;
            }
          }
        }
      }
    }
  }
}
</style>
