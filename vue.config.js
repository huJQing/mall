// vue.config.js
module.exports = {
  //解决跨域
  publicPath: './', //vue-cli3.3+新版本使用
  configureWebpack: {
    devServer: {
      proxy: {
        //名字可以自定义，这里我用的是api
        '/api': {
          target: 'http://localhost:3000', //设置你调用的接口域名和端口号 别忘了加协议
          changeOrigin: true, //这里设置是否跨域
          pathRewrite: {
            '^/api': ''
          }
        }
      }
    }
  },
  //引入global.scss
  css: {
    loaderOptions: {
      // 给 sass-loader 传递选项
      sass: {
        prependData: `
                  @import "src/style/global.scss";
        `
      }
    }
  }
}