
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin')
const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  configureWebpack: {
    plugins: [new NodePolyfillPlugin()],
  },

  transpileDependencies: true,
  // devServer: {
  //   proxy: 'http://localhost:8080' // 配置访问的服务器地址
  // }
})
