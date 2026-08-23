const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  productionSourceMap: false,
  transpileDependencies: true,
  lintOnSave: false,
  devServer:{
      https: false,
      proxy: {
        '/login': {
            target: 'http://127.0.0.1:3007',
        },
        '/api': {
            target: 'http://127.0.0.1:3007',
        },
      }
  },
  publicPath: './',
  configureWebpack: {
    optimization: {
      splitChunks: false
    }
  }
})
