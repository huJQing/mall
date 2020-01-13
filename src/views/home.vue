<template>
  <div class="home">
    <top-bar></top-bar>
    <div class="home-swiper-wrap">
      <home-swiper class="home-swiper"></home-swiper>
    </div>
    <div class="home-brick-wrap" v-for="item of 4" :key="item">
      <home-brick class="home-brick" :itemList="phoneList"></home-brick>
    </div>
  </div>
</template>

<script>
import TopBar from '../components/TopBar'
import HomeSwiper from '../components/HomeSwiper'
import HomeBrick from '../components/HomeBrick'
import { getHomeConfig } from '../request/api'

export default {
  name: 'home',
  components: { TopBar, HomeSwiper, HomeBrick },
  data() {
    return {
      phoneList: []
    }
  },
  methods: {
    getHomeConfig() {
      getHomeConfig().then(res => {
        this.phoneList = res.phoneList;
      })
    }
  },
  mounted() {
    this.getHomeConfig()
  }
}
</script>

<style lang="scss" scoped>
.home {
  font-size: 1em;
  .home-swiper-wrap {
    width: 100%;
    background: #ffffff;
    margin-bottom: 1em;
    .home-swiper {
      width: 75em;
      margin: 0 auto;
    }
  }
  .home-brick-wrap {
    width: 100%;
    .home-brick {
      margin: 0 auto;
    }
  }
}
</style>
