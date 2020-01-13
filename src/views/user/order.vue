<template>
  <div id="order">
    <el-card class="box-card order-card" :body-style="{ padding: '0px' }">
      <div slot="header" class="order-card-head">
        <span>我的订单</span>
      </div>
      <div class="order-list">
        <div class="order-item" v-for="item of orderList" :key="item.order_id">
          <div class="order-header">
            <el-col :span="3" class="order-time">{{item.create_time | dateFormat('Y-M-D')}}</el-col>
            <el-col :span="10" class="order-id">
              订单号:
              <span @click="gotoOrderDetail(item.order_id)">{{item.order_id}}</span>
            </el-col>
            <el-col :span="3">单价</el-col>
            <el-col :span="2">数量</el-col>
            <el-col :span="3">实付金额</el-col>
            <el-col :span="3" class="order-status">
              <span v-if="item.status === 0">已关闭</span>
              <span v-else-if="item.status === 1">待付款</span>
              <span v-else-if="item.status === 2">待发货</span>
              <span v-else-if="item.status === 3">待收货</span>
              <span v-else-if="item.status === 4">已完成</span>
            </el-col>
          </div>
          <div class="goods-list">
            <div class="goods-item" v-for="goods of item.goodsList" :key="goods.id">
              <el-col :span="3" class="goods-img">
                <img :src="goods.versionImg[0]" @click="gotoGoodsInfo(goods.goods_id)" />
              </el-col>
              <el-col :span="10" class="goods-name">
                <span
                  @click="gotoGoodsInfo(goods.goods_id)"
                >{{goods.goodsName +" "+ goods.versionName+" " + goods.color}}</span>
              </el-col>
              <el-col :span="3" class="goods-price">￥{{goods.price | moneyFormat}}</el-col>
              <el-col :span="2" class="goods-amount">{{goods.amount}}</el-col>
            </div>
            <div class="order-operation">
              <div class="order-price">￥{{item.price | moneyFormat}}</div>
              <div class="order-methods">
                <el-button
                  v-if="item.status === 1"
                  type="primary"
                  size="small"
                  class="btn"
                  @click="gotoPayment(item.order_id)"
                >立即支付</el-button>
                <el-button
                  v-else-if="item.status === 3"
                  type="primary"
                  size="small"
                  class="btn"
                >确认收货</el-button>
                <el-button
                  v-else
                  size="small"
                  class="btn"
                  @click="gotoOrderDetail(item.order_id)"
                >查看详情</el-button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
import { getAllOrder } from "../../request/api"
import router from "../../router/index"
export default {
  name: 'order',
  data() {
    return {
      orderList: []
    }
  },
  methods: {
    //跳转商品详情页面
    gotoOrderDetail(id) {
      router.push('order/detail/' + id)
    },
    //跳转商品信息页面
    gotoGoodsInfo(id) {
      router.push('/goodsInfo/' + id)
    },
    //跳转支付页面    
    gotoPayment(id) {
      router.push("/payment/" + id)
    },
    //获取所有订单信息
    getAllOrder() {
      getAllOrder().then(res => {
        if (res.code === 200) {
          this.orderList = res.data
        }
      })
    }
  },
  mounted() {
    this.getAllOrder()
  },
}
</script>

<style lang="scss" scoped>
#order {
  width: 61em;
  margin-left: 14em;
  .order-card {
    border-radius: 10px;
    .order-card-head {
      font-size: 1.125em;
    }
    .order-list {
      width: 100%;
      .order-item {
        .order-header {
          padding: 0 1.5rem;
          font-size: 0.75em;
          height: 2.5rem;
          line-height: 2.5rem;
          background: #f8f8f8;
          text-align: center;
          border-top: 1px solid #dbdbdb;
          border-bottom: 1px solid #dbdbdb;
          .order-time,
          .order-id {
            text-align: left;
            span {
              color: $emTetxColor;
              margin-left: 0.5em;
              cursor: pointer;
            }
          }
          .order-status {
            font-weight: 700;
          }
        }
        .goods-list {
          padding: 0 1.5rem;
          position: relative;
          .goods-item {
            height: calc(7rem + 1px);
            text-align: center;
            line-height: 7rem;
            font-size: 0.875em;
            color: #666;
            .goods-img {
              padding: 1rem 0;
              height: 7rem;
              text-align: left;
              img {
                height: 5rem;
                width: 5rem;
                border: 1px solid #eee;
                cursor: pointer;
              }
            }
            .goods-name {
              text-align: left;
              overflow: hidden; /*超出隐藏*/
              white-space: nowrap; /*强制在同一行显示*/
              text-overflow: ellipsis; /*省略号*/
              span {
                cursor: pointer;
              }
            }
            .goods-name,
            .goods-price,
            .goods-amount {
              border-bottom: 1px solid #eee;
            }
            .goods-amount {
              border-right: 1px solid #eee;
            }
            &:last-child {
              .goods-name,
              .goods-price,
              .goods-amount {
                border-bottom: 0;
              }
            }
          }
          .order-operation {
            padding: 1rem 0;
            height: 5rem;
            line-height: 5rem;
            width: 16em;
            position: absolute;
            right: 0;
            top: 0;
            .order-price {
              width: 50%;
              float: left;
              text-align: center;
              font-size: 0.875em;
              font-weight: 700;
            }
            .order-methods {
              height: 5rem;
              width: 40%;
              float: left;
              position: relative;
              .btn {
                position: absolute;
                left: 50%;
                top: 50%;
                transform: translate(-50%, -50%);
              }
            }
          }
        }
      }
    }
  }
}
</style>