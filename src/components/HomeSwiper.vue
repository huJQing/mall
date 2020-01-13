<template>
  <div class="home-swiper">
    <div class="block">
      <el-carousel trigger="click" height="30em">
        <el-carousel-item v-for="item in swiperImg" :key="item.url">
          <img :src="item.url" class="swiper-img" />
        </el-carousel-item>
      </el-carousel>
    </div>

    <div class="home-swiper-ad">
      <div v-for="item in adImg" :key="item.url" class="ad-item">
        <img :src="item.url" class="swiper-img" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HomeSwiper',
  data() {
    return {
      swiperImg: [
        { url: require('../assets/image/homeSwiper1.jpg') },
        { url: require('../assets/image/homeSwiper2.jpg') },
        { url: require('../assets/image/homeSwiper3.jpg') },
        { url: require('../assets/image/homeSwiper4.jpg') },
        { url: require('../assets/image/homeSwiper5.jpg') },
      ],
      adImg: [
        { url: require('../assets/image/homeSwiperAd1.jpg') },
        { url: require('../assets/image/homeSwiperAd2.jpg') },
        { url: require('../assets/image/homeSwiperAd3.jpg') },
        { url: require('../assets/image/homeSwiperAd11.jpg') },
      ]
    }
  }
}
</script>

<style lang="scss" scoped>
.home-swiper {
  width: 75em;
  background: #fff;
  .swiper-img {
    width: 75em;
    height: 30em;
  }
  .home-swiper-ad {
    width: 100%;
    display: flex;
    justify-content: space-between;
    margin-top: 1em;
    padding-bottom: 1em;
    .ad-item {
      width: 18em;
      height: 9em;
      cursor: pointer;
      img {
        width: 18em;
        height: 9em;
      }
    }
  }
}
</style>