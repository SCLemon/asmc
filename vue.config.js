const { defineConfig } = require('@vue/cli-service')
const WebpackObfuscator = require('webpack-obfuscator');

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
  publicPath: '/',
  configureWebpack: (config) => {
      if (process.env.NODE_ENV === 'production') {
          // 加密與混淆
          config.plugins.push(
              new WebpackObfuscator(
              {
                  rotateUnicodeArray: true,
                  compact: true,
                  selfDefending: true
              },
              ['js/chunk-vendors*.js']
              )
          );

          // Tree shaking
          config.optimization.usedExports = true;
          config.optimization.sideEffects = true;

          // 拆分代碼
          config.optimization.splitChunks = {
          chunks: 'all',
          minSize: 120000,           // 不要太小
          maxInitialRequests: 5,     // 降低首屏請求數
          maxAsyncRequests: 8,
          cacheGroups: {
              vendors: {
                  test: /[\\/]node_modules[\\/]/,
                  name: 'chunk-vendors',
                  priority: -10,
              },
              elementUI: {
                  test: /[\\/]node_modules[\\/]element-plus[\\/]/,
                  name: 'chunk-element-plus',
                  priority: 20,
              },
              common: {
                  name: 'chunk-common',
                  minChunks: 2,
                  priority: -20,
                  reuseExistingChunk: true,
              },
          },
    }
      }
  }
})
