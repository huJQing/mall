<template>
  <div id="payment">
    <top-bar></top-bar>
    <div class="payment-box">
      <el-card class="box-card payment" :body-style="{ padding: '0' }">
        <div slot="header" class="clearfix">
          <span>支付订单</span>
        </div>
        <div class="payment-tips">
          <p class="head">提交订单成功，请选择支付方式</p>
          <p class="time-tips">
            请在
            <span>2 小时内</span>完成支付，超时订单将自动取消
          </p>
          <p>我们将在您完成支付后的 72 小时内陆续发货</p>
        </div>
        <el-tabs type="border-card" class="payment-info">
          <el-tab-pane class="pane">
            <span slot="label" class="tabs-icon">
              <img src="../../public/images/pay-alipay.png" />
            </span>
            <el-card class="code-card">
              <img src="../../public/images/alipay-code.png" class="image" />
              <p>
                请使用支付宝扫一扫
                <br />扫描二维码支付
              </p>
            </el-card>
          </el-tab-pane>
          <el-tab-pane class="pane">
            <span slot="label" class="tabs-icon">
              <img src="../../public/images/pay-wchat.png" />
            </span>
            <el-card class="code-card">
              <img src="../../public/images/wechat-code.png" class="image" />
              <p>
                请使用微信扫一扫
                <br />扫描二维码支付
              </p>
            </el-card>
          </el-tab-pane>
        </el-tabs>
        <div class="pay">
          <el-button type="primary" @click="payment">立即支付</el-button>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script>
import TopBar from "../components/TopBar"
import { getOrderStatus, payment } from "../request/api"
import router from "../router/index"
export default {
  name: 'payment',
  components: { TopBar },
  props: ['orderId'],
  data() {
    return {

    }
  },
  methods: {
    //支付订单
    payment() {
      const loading = this.$loading({
        lock: true,
        text: '支付中',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.8)'
      });
      payment({
        orderId: this.orderId
      }).then(res => {
        window.console.log(res)
        if (res.code === 200) {
          setTimeout(() => {
            loading.close();
            this.$message.success('订单支付成功！')
            router.push('/user/order/detail/' + this.orderId)
          }, 1000);
        } else {
          this.$message.erro('订单支付失败！')
        }
      })
    },
    //获取订单状态
    getOrderStatus() {
      getOrderStatus({
        orderId: this.orderId
      }).then(res => {
        if (res.code === 200 && res.data.status === 1) {
          window.console.log(res)
        } else if (res.code === 200 && res.data.status === 2) {
          router.push('/user/order/detail/' + this.orderId)
        } else {
          router.push('/user/order')
        }
      })
    }
  },
  mounted() {
    this.getOrderStatus()
    window.console.log(this.orderId)
  },
}
</script>

<style lang="scss" scoped>
#payment {
  .payment-box {
    width: 75em;
    margin: 0 auto;
    margin-top: 20px;
    .payment {
      margin-bottom: 2rem;
      .payment-tips {
        padding: 2em 0 2.5em 0;
        text-align: center;
        p {
          color: #999;
          font-size: 0.875em;
        }
        .head {
          font-size: 2em;
          color: #333;
          font-weight: normal;
        }
        .time-tips {
          margin-top: 0.5em;
          span {
            color: $emTetxColor;
            font-weight: 700;
          }
        }
      }
      .payment-info {
        width: 80%;
        margin: 0 auto;
        /deep/.el-tabs__item {
          height: 100%;
        }
        .tabs-icon {
          height: 1.8rem;
          img {
            height: 1.8rem;
            margin-top: 0.8rem;
          }
        }

        .pane {
          position: relative;
          height: 18rem;
          .code-card {
            width: 12.5rem;
            height: 16.5rem;
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
            .image {
              width: 10rem;
              height: 10rem;
            }
            p {
              margin-top: 1rem;
              text-align: center;
              font-size: 0.875rem;
              line-height: 1.375rem;
              color: #bbb;
            }
          }
        }
      }

      .pay {
        margin-top: 2em;
        background: #f9f9f9;
        padding: 0.625em 1.25em;
        overflow: hidden;
        button {
          float: right;
          width: 10em;
        }
      }
    }
  }
}
</style>