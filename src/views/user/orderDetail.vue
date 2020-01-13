<template>
  <div id="order-detail">
    <el-card class="box-card detail-card" :body-style="{ padding: '0' }">
      <div slot="header" class="detail-card-head">
        <span>订单号：{{orderId}}</span>
      </div>
      <div class="order-status">
        <!--订单进度条开始-->
        <div class="order-process">
          <el-steps
            :active="orderInfo.cancel_status === 0 ? orderInfo.status : 2"
            finish-status="finish"
            process-status="wait "
            v-if="orderInfo.order_id"
          >
            <el-step title="下 单" icon="el-icon-s-order">
              <div
                slot="description"
                class="time"
              >{{orderInfo.create_time | dateFormat('Y-M-D H:M')}}</div>
            </el-step>
            <template v-if="orderInfo.status > 0">
              <el-step title="付 款" icon="el-icon-bank-card">
                <div
                  slot="description"
                  class="time"
                  v-if="orderInfo.status>1"
                >{{orderInfo.pay_time | dateFormat('Y-M-D H:M')}}</div>
              </el-step>
              <el-step title="发 货" icon="el-icon-truck">
                <div
                  slot="description"
                  class="time"
                  v-if="orderInfo.status>2"
                >{{orderInfo.distribution_time | dateFormat('Y-M-D H:M')}}</div>
              </el-step>
              <el-step title="完 成" icon="el-icon-circle-check">
                <div
                  slot="description"
                  class="time"
                  v-if="orderInfo.status>3"
                >{{orderInfo.end_time | dateFormat('Y-M-D H:M')}}</div>
              </el-step>
            </template>
            <template v-if="orderInfo.status === 0">
              <el-step title="关 闭" icon="el-icon-circle-check">
                <div
                  slot="description"
                  class="time"
                >{{orderInfo.end_time | dateFormat('Y-M-D H:M')}}</div>
              </el-step>
            </template>
          </el-steps>
        </div>
        <!--订单进度条结束-->

        <!--订单状态提示开始-->
        <el-card
          class="box-card order-type"
          shadow="never"
          v-if="orderInfo.status > 0"
          :body-style="{ padding: '1.5em' }"
        >
          <div class="order-type-tips">
            订单状态：
            <span v-if="orderInfo.status === 0">已关闭</span>
            <span v-else-if="orderInfo.status === 1">待付款</span>
            <span v-else-if="orderInfo.status === 2">待发货</span>
            <span v-else-if="orderInfo.status === 3">待收货</span>
            <span v-else-if="orderInfo.status === 4">已完成</span>
          </div>
          <div class="order-methods">
            <el-button
              v-if="orderInfo.status === 1"
              type="primary"
              size="small"
              class="btn"
              @click="gotoPayment(orderInfo.order_id)"
            >立即支付</el-button>
            <el-button
              v-else-if="orderInfo.status === 3"
              type="primary"
              size="small"
              class="btn"
            >确认收货</el-button>
            <el-button
              v-if="orderInfo.status < 4"
              size="small"
              class="btn"
              @click="cancelOrder()"
            >取消订单</el-button>
          </div>
          <el-divider v-if="orderInfo.status < 4"></el-divider>
          <div class="order-tip" v-if="orderInfo.status === 1">
            您的付款时间还有
            <span>{{engdingTime}}</span>，超时后订单将自动取消。
          </div>
          <div class="order-tip" v-else-if="orderInfo.status === 2">
            您的订单已成功付款，我们将在
            <span>72 小时</span>内陆续发货，请您耐心等待。
          </div>
          <div class="order-tip" v-else-if="orderInfo.status === 3">您的商品已发货！收货时，请您当场验货确认商品无误后再签收哦。</div>
        </el-card>
        <!--订单状态提示结束-->
      </div>

      <!--商品信息开始-->
      <div class="goods-list">
        <div class="list-header">
          <el-col :span="15" class="goods-info">商品信息</el-col>
          <el-col :span="3">单价</el-col>
          <el-col :span="3">数量</el-col>
          <el-col :span="3">小计</el-col>
        </div>
        <div class="goods-item" v-for="item of orderInfo.goodsList" :key="item.id">
          <el-col :span="3" class="goods-img">
            <img :src="item.versionImg[0]" @click="gotoGoodsInfo(item.goods_id)" />
          </el-col>
          <el-col :span="12" class="goods-name">
            <span
              @click="gotoGoodsInfo(item.goods_id)"
            >{{item.goodsName +" "+ item.versionName+" " + item.color}}</span>
          </el-col>
          <el-col :span="3" class="goods-price">￥{{item.price | moneyFormat}}</el-col>
          <el-col :span="3" class="goods-amount">{{item.amount}}</el-col>
          <el-col :span="3" class="goods-total">￥{{item.price * item.amount | moneyFormat}}</el-col>
        </div>
        <div class="list-total">
          商品总计：
          <span>￥{{orderInfo.price | moneyFormat}}</span>
        </div>
      </div>
      <!--商品信息结束-->

      <!--收货地址开始-->

      <div class="address">
        <div class="address-header">收货信息</div>
        <div class="address-detail" v-if="orderInfo.address">
          <p>姓名：{{orderInfo.address.name}}</p>
          <p>联系电话：{{orderInfo.address.phone}}</p>
          <p>
            详细地址：{{`${orderInfo.address.province} ${orderInfo.address.city}
            ${orderInfo.address.area} ${orderInfo.address.detailedAddress}`}}
          </p>
        </div>
      </div>
      <!--收货地址结束-->
    </el-card>
  </div>
</template>

<script>
import { getOrderInfo, cancelOrder } from "../../request/api"
import router from "../../router/index"
export default {
  name: 'orderDetail',
  props: ['orderId'],
  inject: ["reload"],
  data() {
    return {
      orderInfo: {},
      timer: {},//订单结束时间计时器
      engdingTime: ' 0 时 0 分 0 秒',//订单结束时间
    }
  },
  methods: {
    //重载页面
    reloadPage() {
      setTimeout(() => {
        this.reload()
      }, 1000)
    },
    //跳转商品信息页面
    gotoGoodsInfo(id) {
      router.push('/goodsInfo/' + id)
    },
    //跳转支付页面    
    gotoPayment(id) {
      router.push("/payment/" + id)
    },
    //创建付款倒计时计时器
    createTimeOut() {
      this.timer = setInterval(() => {
        let nowTime = Date.now()
        let endTime = 7200 - Math.floor((nowTime - this.orderInfo.create_time) / 1000) //单位秒
        if (endTime < 0) {
          clearInterval(this.timer)
        } else {
          let h = Math.floor(endTime / 3600) < 10 ? '0' + Math.floor(endTime / 3600) : Math.floor(endTime / 3600);
          let m = Math.floor((endTime / 60 % 60)) < 10 ? '0' + Math.floor((endTime / 60 % 60)) : Math.floor((endTime / 60 % 60));
          let s = Math.floor((endTime % 60)) < 10 ? '0' + Math.floor((endTime % 60)) : Math.floor((endTime % 60));
          this.engdingTime = `${h} 时 ${m} 分 ${s} 秒`
        }
      }, 1000)
    },
    //取消订单
    cancelOrder() {

      this.$confirm('您确定取消此订单吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        return cancelOrder({ orderId: this.orderId })
      }).then(res => {
        if (res.code === 200) {
          this.$message.success('订单取消成功！')
          this.reloadPage()
        }
      })
    },
    //获取所有单个订单的详细信息
    getOrderInfo() {
      getOrderInfo({
        orderId: this.orderId
      }).then(res => {
        window.console.log(res)
        if (res.code === 200) {
          this.orderInfo = res.data
          this.createTimeOut()
        }
      })
    }
  },
  mounted() {
    this.getOrderInfo()
  },
  beforeDestroy() {
    clearInterval(this.timer)
  }
}
</script>

<style lang="scss" scoped>
#order-detail {
  width: 61em;
  margin-left: 14em;
  margin-bottom: 2em;
  .detail-card {
    border-radius: 10px;
    .detail-card-head {
      font-size: 1.125em;
    }
  }
  .order-status {
    padding: 2em;
    .order-process {
      margin-top: 1em;
      padding: 0 1em;
      .time {
        width: 7em;
        text-align: center;
        transform: translate(-2em, 0);
      }
    }
    .order-type {
      padding: 0 1em;
      margin-top: 1em;
      background: #f6f6f6;
      position: relative;
      .order-methods {
        position: absolute;
        right: 2.5em;
        top: 1.25em;
      }
      .order-tip {
        font-size: 0.875em;
        color: #999;
        span {
          color: $emTetxColor;
        }
      }
    }
  }

  .goods-list {
    margin-top: 0.625em;
    .list-header {
      padding-left: 1.5em;
      height: 2.5rem;
      background: #eee;
      line-height: 2.5rem;
      color: #666;
      font-size: 0.75em;
      border-top: 1px solid #dbdbdb;
      border-bottom: 1px solid #dbdbdb;
      text-align: center;
      .goods-info {
        text-align: left;
      }
    }
    .goods-item {
      padding-left: 1.5em;
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
      .goods-amount,
      .goods-total {
        border-bottom: 1px solid #eee;
      }
      .goods-price,
      .goods-amount,
      .goods-total {
        font-weight: 700;
      }
      &:nth-last-child(2) {
        .goods-name,
        .goods-price,
        .goods-amount,
        .goods-total {
          border-bottom: 0;
        }
      }
    }

    .list-total {
      padding: 1em 1.5em;
      height: 3em;
      line-height: 3em;
      text-align: right;
      border-top: 1px solid #eee;
      span {
        color: $emTetxColor;
        font-weight: 700;
      }
    }
  }

  .address {
    .address-header {
      padding-left: 1.5em;
      height: 2.5rem;
      background: #eee;
      line-height: 2.5rem;
      color: #666;
      font-size: 0.75em;
      border-top: 1px solid #dbdbdb;
      border-bottom: 1px solid #dbdbdb;
    }
    .address-detail {
      padding: 2em;
      color: #666;
      p {
        font-size: 0.875em;
        margin-top: 1rem;
      }
    }
  }
}
</style>