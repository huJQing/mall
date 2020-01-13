<template>
  <div class="goods-info">
    <top-bar></top-bar>
    <div class="goods-basic-info">
      <el-card shadow="always" body-style="overflow: hidden">
        <el-carousel
          :interval="5000"
          height="34.375em"
          v-if="carouselImg"
          class="left-carousel"
          indicator-position="outside"
          ref="goodsCarousel"
        >
          <el-carousel-item v-for="item in carouselImg" :key="item.name">
            <img :src="item" class="carousel-img" />
          </el-carousel-item>
        </el-carousel>
        <div class="right-goods-info">
          <div class="goods-name">{{goodsInfo.goodsName}}</div>
          <div class="goods-saleDesc">{{goodsInfo.saleDesc}}</div>
          <div class="goods-price">{{goodsInfo.price}}元</div>
          <div class="goods-version-title">选择版本</div>
          <div class="goods-version">
            <div
              class="goods-version-item"
              v-for="(item,index) of versionNameArr"
              :key="item.versionName"
              @click="versionSelect(item,index)"
              :class="{selected : item.selected}"
            >{{item.versionName}}</div>
          </div>
          <div class="goods-color-title">选择颜色</div>
          <div class="goods-color">
            <div
              class="goods-color-item"
              v-for="(item,index) of colorArr"
              :key="item.color"
              @click="colorSelect(item,index)"
              :class="{selected : item.selected}"
            >
              <img :src="item.img[0]" class="goods-color-item-img" />
              {{item.color}}
            </div>
          </div>
          <div class="now-goods-price">
            <div
              class="now-selected-version"
            >{{goodsInfo.goodsName}} {{selectedVersion.versionName}} {{selectedColor.color}}</div>
            <div class="now-selected-price">{{price}}元</div>
            <div class="now-total-price">总计：{{price}}元</div>
          </div>
          <div class="control-btns">
            <el-button type="primary" class="buy-btn" @click="addGoodsInCart">加入购物车</el-button>
          </div>
        </div>
      </el-card>
    </div>

    <div class="goods-details">
      <el-card shadow="always" :body-style="{ padding: '0px'}">
        <div slot="header" class="goods-details-title">
          <span>商品详情</span>
        </div>
        <el-image v-for="item of goodsDetailsImg" :key="item.name" :src="item" lazy></el-image>
      </el-card>
    </div>
  </div>
</template>

<script>
import TopBar from '../components/TopBar'
import { getGoodsInfoById, addGoodsInCart, checkUserIsLogin } from '../request/api'
import { uniqObjInArray } from '../assets/js/util'

export default {
  name: 'goodsInfo',
  components: { TopBar },
  props: ['goodsId'],
  data() {
    return {
      goodsInfo: {},
      carouselImg: [],//商品轮播图图片
      goodsDetailsImg: [],//商品详细信息图片
      versionNameArr: [],//商品版本
      colorArr: [],//商品颜色
      selectedVersion: {},//当前选中的版本
      selectedColor: {},//当前选中的颜色
      price: 0,//当前价格
    }
  },
  methods: {
    //版本选择
    versionSelect(item, index) {
      this.versionNameArr.forEach((item, i) => {
        item.selected = false
        if (i == index) {
          item.selected = true
          this.selectedVersion = item
        }
      })
      this.computedPrice()
    },
    //颜色选择
    colorSelect(item, index) {
      this.colorArr.forEach((item, i) => {
        item.selected = false
        if (i == index) {
          item.selected = true
          this.selectedColor = item
          this.carouselImg = item.img
          this.$refs.goodsCarousel.setActiveItem(0)
        }
      })
      this.computedPrice()
    },
    //计算当前价格
    computedPrice() {
      this.goodsInfo.goodsVersionInfo.forEach(item => {
        if (item.versionName == this.selectedVersion.versionName && item.color == this.selectedColor.color) {
          this.price = item.price
        }
      })
    },
    //获取商品信息
    getGoodsInfo() {
      getGoodsInfoById({
        goodsId: this.goodsId
      }).then(res => {
        if (res.code === 200) {
          var data = res.data;
          this.goodsInfo = data;
          this.carouselImg = data.goodsVersionInfo[0].versionImg
          this.goodsDetailsImg = data.goodsDetailsImg.img
          this.computedVersionAndColor()
          window.console.log(this.goodsInfo)
        } else {
          this.$message.error('获取数据失败')
          throw res.message
        }
      }).catch(err => {
        window.console.log(err)
      })
    },
    //计算版本和颜色的信息并初始化渲染
    computedVersionAndColor() {
      let goodsVersionInfo = JSON.parse(JSON.stringify(this.goodsInfo.goodsVersionInfo))
      let versionNameArr = []
      let colorArr = []
      goodsVersionInfo.forEach(item => {
        versionNameArr.push({
          versionName: item.versionName,
          optional: item.stock < 1 ? false : true,
          selected: false
        })
        colorArr.push({
          color: item.color,
          img: item.versionImg,
          selected: false
        })
      });
      this.versionNameArr = uniqObjInArray(versionNameArr)
      this.colorArr = uniqObjInArray(colorArr)
      this.versionNameArr[0].selected = true;
      this.colorArr[0].selected = true;
      this.selectedVersion = this.versionNameArr[0]
      this.selectedColor = this.colorArr[0]
      this.computedPrice()
    },
    //添加商品至购物车
    addGoodsInCart() {
      let version = {}
      this.goodsInfo.goodsVersionInfo.forEach(item => {
        if (item.versionName == this.selectedVersion.versionName && item.color == this.selectedColor.color) {
          version = item
        }
      })
      checkUserIsLogin().then(res => {
        if (res.code === 200) {
          return addGoodsInCart({
            goodsId: version.goodsId,
            goodsVersionId: version.id,
          })
        } else {
          throw res
        }
      }).then(res => {
        if (res.code === 200) {
          this.$message.success('已添加至购物车！')
        } else {
          this.$message.error('添加至购物车失败！')
        }
      }).catch((res) => {
        window.console.log(res)
        this.$message('您还未登录，赶紧登陆，体验更多功能吧！')
      })
    }
  },
  mounted() {
    this.getGoodsInfo()
  }
}
</script>

<style lang="scss" scoped>
.goods-info {
  .goods-basic-info {
    width: 75em;
    margin: 0 auto;
    margin-top: 20px;
    .left-carousel {
      width: 550px;
      height: 600px;
      float: left;
      .carousel-img {
        width: 550px;
        height: 550px;
      }
    }
    .right-goods-info {
      float: left;
      margin-left: 20px;
      width: 588px;
      .goods-name {
        font-size: 1.875em;
        font-weight: bold;
        margin-bottom: 10px;
      }
      .goods-saleDesc {
        font-size: 0.875em;
        color: #b0b0b0;
        margin-bottom: 10px;
      }
      .goods-price {
        font-size: 1.125em;
        color: $emTetxColor;
        border-bottom: 1px solid #e0e0e0;
        padding-bottom: 10px;
        margin-bottom: 20px;
      }
      .goods-version-title,
      .goods-color-title {
        font-size: 1.125em;
        margin-bottom: 20px;
        font-weight: 400;
      }
      .goods-version,
      .goods-color {
        display: flex;
        justify-content: space-between;
        flex-wrap: wrap;
        .goods-version-item,
        .goods-color-item {
          width: 48%;
          height: 2.5em;
          line-height: 2.5em;
          text-align: center;
          border: 1px solid rgba($color: #000000, $alpha: 0.2);
          margin-bottom: 20px;
          cursor: pointer;
          .goods-color-item-img {
            height: 20px;
            width: 20px;
            vertical-align: sub;
          }
        }
        .selected {
          border: 1px solid #409eff;
          color: $emTetxColor;
        }
      }
      .now-goods-price {
        background-color: rgba($color: #000000, $alpha: 0.025);
        padding: 30px;
        margin: 10px 0 30px 0;
        .now-selected-version {
          font-size: 1em;
          float: left;
        }
        .now-selected-price {
          font-size: 1em;
          float: right;
        }
        .now-total-price {
          clear: both;
          font-size: 1.5em;
          padding-top: 20px;
          color: $emTetxColor;
        }
      }
      .control-btns {
        .buy-btn {
          width: 300px;
          height: 50px;
          font-size: 1em;
          border-radius: 0;
        }
      }
    }
  }

  .goods-details {
    width: 75em;
    margin: 30px auto 80px auto;
    .goods-details-title {
      font-size: 1.25em;
    }
    .el-image {
      display: block;
    }
  }
}
</style>