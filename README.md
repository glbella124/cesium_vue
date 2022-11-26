[TOC]



# cesium_vue

## 1.Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

## 2.Cesium

### 初始化项目运行node报错解决方案

https://blog.csdn.net/jiangzhanweiabc/article/details/125766728

```js
// vue.config.js配置如下

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

```

### 加载底图
1. cesium -- accessKey
   https://cesium.com/ion/tokens?page=1
2. 天地图
   https://www.tianditu.gov.cn/
3. 上海地形图
   http://www.gscloud.cn/sources/index?pid=1&rootid=1
   DEM数字高程数据 -- GDEMV3 30M 分辨率数字高程数据
   上海 121.5 30.5 -- 31.5
### Terrain

地形切片制作流程

地形切片 /tif数据/分散

### 坐标系与坐标转换
1. 屏幕坐标系统，二维的笛卡尔坐标系, Cartesian2类型
2. 地理坐标系统，WGS-84坐标系，Cartographic类型
3. 笛卡尔空间直角坐标系，Cartesian3类型

### 角度与弧度的转换



