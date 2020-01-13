<template>
  <div class="home-brick">
    <div class="header">
      <h2 class="title">手机</h2>
    </div>
    <div class="brick-list-wrap" v-loading="itemList.length > 0 ? false: true">
      <ul class="brick-list">
        <li
          v-for="item of itemList"
          :key="item.id"
          class="brick-item"
          @click="gotoGoodsInfoPage(item)"
        >
          <img v-lazy="item.goodsImg" class="item-img" />
          <div class="item-info">
            <div class="item-info-name">{{item.goodsName}}</div>
            <div class="item-info-info">{{item.simpleDesc}}</div>
            <div class="item-info-price">{{item.price}}元起</div>
          </div>
        </li>
        <li class="brick-item" v-if="itemList.length > 0 ? true: false">
          <i class="look-more-icon el-icon-arrow-right"></i>
          <h3 class="look-more-text">浏览更多</h3>
        </li>
      </ul>
    </div>

    <div class="home-banner">
      <img v-lazy="homeBannerImg" />
    </div>
  </div>
</template>

<script>
//import router from '../router/index'

export default {
  name: 'HomeBrick',
  data() {
    return {
      homeBannerImg: require('../assets/image/homeBanner.jpg')
    }
  },
  props: ['itemList'],
  methods: {
    gotoGoodsInfoPage(item) {
      window.open('#/goodsInfo/' + item.id, '_blank');
      //router.push('/goodsInfo/' + item.id)
    }
  }
}
</script>

<style lang="scss" scoped>
.home-brick {
  width: 75em;
  min-height: 39em;
  .header {
    padding: 0 0 1em 0;
    .title {
      font-weight: 1em;
      font-weight: 300;
      text-align: left;
      color: #777;
    }
  }

  .brick-list-wrap {
    width: 100%;
    text-align: center;
    .brick-list {
      width: 100%;
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      .brick-item {
        width: 14em;
        height: 18.5em;
        background: #fff;
        margin-bottom: 1em;
        transition: all 0.2s linear;
        cursor: pointer;
        .item-img {
          height: 10em;
          width: 10em;
          margin-top: 1em;
        }
        .item-info {
          margin-top: 0.7em;
          .item-info-name {
            font-size: 1em;
            margin-bottom: 0.25em;
          }
          .item-info-info {
            font-size: 0.75em;
            color: #cccccc;
            margin-bottom: 1.25em;
          }
          .item-info-price {
            font-size: 0.875em;
            color: $emTetxColor;
          }
        }

        .look-more-icon {
          font-size: 6em;
          font-weight: bold;
          color: $emTetxColor;
          margin-top: 4.5rem;
        }
        .look-more-text {
          color: $emTetxColor;
          margin-top: 1rem;
        }
      }
      .brick-item:hover {
        box-shadow: 0 15px 30px rgba(0, 0, 0, 0.15);
        transform: translate3d(0, -2px, 0);
      }
    }
  }

  .home-banner {
    width: 100%;
    padding: 0.5em 0 2em 0;
    img {
      width: 100%;
      height: 8em;
    }
  }
}
</style>