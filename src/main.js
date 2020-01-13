import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

//引入自定义图标
import "./assets/icon/iconfont.css";

/*引入elementUI*/
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
Vue.use(ElementUI)

//引入fliter
import filter from './utils/filter.js'
Object.keys(filter).forEach(key => Vue.filter(key, filter[key]))

//引入lazy-loader图片懒加载插件
import vueLazy from 'vue-lazyload'
Vue.use(vueLazy)

//引入axios
import Axios from 'axios'
import VueAxios from 'vue-axios'
Vue.use(VueAxios, Axios)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
