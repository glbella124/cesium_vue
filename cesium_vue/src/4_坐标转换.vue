<template>
  <div id="cesiumContainer"></div>
</template>

<script setup>
import * as Cesium from "cesium";
import "./Widgets/widgets.css";
import { onMounted } from "vue";

// 坐标转换

// 设置cesium token
Cesium.Ion.defaultAccessToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJkYjBjMGZlMy01YmEyLTQ3OTctYjNhNC1iZjE1OWUxMWUxOWMiLCJpZCI6Nzc4OTksImlhdCI6MTY1NTQ0MzkyNX0.8cCNrZ_FJRSxIhqhZO_VP7XRLt3IxFB5TaXqpGLmxtk";
// 设置cesium静态资源路径
window.CESIUM_BASE_URL = "/";

// 设置cesium默认视角 -- 中国
Cesium.Camera.DEFAULT_VIEW_RECTANGLE = Cesium.Rectangle.fromDegrees(
  // 西边的经度
  89.5,
  // 南边维度
  20.4,
  // 东边经度
  110.4,
  // 北边维度
  61.2
);
onMounted(() => {
  let viewer = new Cesium.Viewer("cesiumContainer", {
    // 信息窗口 -- 不提示allow-script报错
    infoBox: false,
    // baseLayerPicker: false,
    animation: false,
    timeline: false,
    // homeButton: false,
    sceneModePicker: false,
    navigationHelpButton: false,
    fullscreenButton: false,
    vrButton: false,
    selectionIndicator: false,
    // creditContainer: "creditContainer",
    // 添加全球地形
    // terrainProvider:Cesium.createWorldTerrain(
    //   {
    //     // 更逼真
    //     // 光照效果 -- 法向
    //     requestVertexNormals:true,
    //     // 水纹
    //     requestWaterMask:true
    //   }
    // ),
    // terrainProvider: new Cesium.CesiumTerrainProvider({
    //   url: "./terrain/shanghai30",
    // }),
    // 天地图矢量图
    // imageryProvider: new Cesium.WebMapTileServiceImageryProvider({
    //   url: "http://t0.tianditu.com/vec_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=vec&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default&format=tiles&tk=30d07720fa76f07732d83c748bb84211",
    //   layer: "tdtBasicLayer",
    //   style: "default",
    //   format: "image/jpeg",
    //   tileMatrixSetID: "GoogleMapsCompatible",
    // }),
    // 天地图影像服务
    // imageryProvider: new Cesium.WebMapTileServiceImageryProvider({
    //   url: "http://t0.tianditu.com/img_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=img&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default&format=tiles&tk=30d07720fa76f07732d83c748bb84211",
    //   layer: "tdtBasicLayer",
    //   style: "default",
    //   format: "image/jpeg",
    //   tileMatrixSetID: "GoogleMapsCompatible",
    // }),
  });

  // 地图叠加
  // let imageryLayers = viewer.imageryLayers;
  // let layer = imageryLayers.addImageryProvider(
  //   // 天地图中文标记服务
  //   new Cesium.WebMapTileServiceImageryProvider({
  //     alpha: 0.8,
  //     url: "http://{s}.tianditu.gov.cn/cia_c/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=cia&tileMatrixSet=c&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default&format=tiles&tk=30d07720fa76f07732d83c748bb84211",
  //     layer: "tdtCva",
  //     style: "default",
  //     format: "tiles",
  //     tileMatrixSetID: "c",
  //     subdomains: ["t0", "t1", "t2", "t3", "t4", "t5", "t6", "t7"],
  //     tilingScheme: new Cesium.GeographicTilingScheme(),
  //     tileMatrixLabels: [
  //       "1",
  //       "2",
  //       "3",
  //       "4",
  //       "5",
  //       "6",
  //       "7",
  //       "8",
  //       "9",
  //       "10",
  //       "11",
  //       "12",
  //       "13",
  //       "14",
  //       "15",
  //       "16",
  //       "17",
  //       "18",
  //     ],
  //     maximumLevel: 18,
  //   })
  // );
  // 隐藏logo
  viewer.cesiumWidget.creditContainer.style.display = "none";

  // 1. 屏幕坐标系统，二维的笛卡尔坐标系, Cartesian2类型
  // 2. 地理坐标系统，WGS-84坐标系，Cartographic类型
  // 3. 笛卡尔空间直角坐标系，Cartesian3类型

  // 角度与弧度的转换
  let radians = Cesium.Math.toRadians(90);
  console.log(radians, "radians");
  // 弧度转角度
  let degrees = Cesium.Math.toDegrees(2*Math.PI)
  console.log(degrees,"degrees");

  // 将经纬度转为笛卡尔坐标 - 经纬度，高程
  let cartesian3 = Cesium.Cartesian3.fromDegrees(
    89.5,
    20.4,
    100
  )
  console.log(cartesian3,"cartesian3");

  // 将笛卡尔坐标转为经纬度
  let cartographic = Cesium.Cartographic.fromCartesian(cartesian3)
  console.log(cartographic,"cartographic");
});
</script>

<style>
* {
  margin: 0;
  padding: 0;
}
#cesiumContainer {
  width: 100vw;
  height: 100vh;
}
</style>
