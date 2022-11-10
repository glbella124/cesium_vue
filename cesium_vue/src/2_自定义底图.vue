<template>
  <div id="cesiumContainer"></div>
</template>

<script setup>
import * as Cesium from "cesium";
import "./Widgets/widgets.css";
import { onMounted } from "vue";

// 自定义定图

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
    // 图层选择
    // baseLayerPicker: false,
    // 播放动画
    animation: false,
    // 时间轴
    timeline: false,
    // 查询按钮
    // geocoder: false,
    // home按钮
    // homeButton: false,
    // 控制查看器显示模式
    sceneModePicker: false,
    // 帮助按钮
    navigationHelpButton: false,
    // 全屏
    fullscreenButton: false,
    vrButton: false,
    selectionIndicator: false,
    // creditContainer: "creditContainer",
    // 设置天空盒
    skyBox: new Cesium.SkyBox({
      sources: {
        positiveX: "./texture/sky/px.jpg",
        negativeX: "./texture/sky/nx.jpg",
        positiveY: "./texture/sky/ny.jpg",
        negativeY: "./texture/sky/py.jpg",
        positiveZ: "./texture/sky/pz.jpg",
        negativeZ: "./texture/sky/nz.jpg",
      },
    }),
    // 天地图矢量图
    // imageryProvider: new Cesium.WebMapTileServiceImageryProvider({
    //   url: "http://t0.tianditu.com/vec_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=vec&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default&format=tiles&tk=30d07720fa76f07732d83c748bb84211",
    //   layer: "tdtBasicLayer",
    //   style: "default",
    //   format: "image/jpeg",
    //   tileMatrixSetID: "GoogleMapsCompatible",
    // }),
    // 天地图影像服务
    imageryProvider: new Cesium.WebMapTileServiceImageryProvider({
      url: "http://t0.tianditu.com/img_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=img&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default&format=tiles&tk=30d07720fa76f07732d83c748bb84211",
      layer: "tdtBasicLayer",
      style: "default",
      format: "image/jpeg",
      tileMatrixSetID: "GoogleMapsCompatible",
    }),
    // OSM地图
    // imageryProvider: new Cesium.OpenStreetMapImageryProvider({
    //   url: "https://a.tile.openstreetmap.org/",
    // }),
    // 高德矢量地图
    // imageryProvider: new Cesium.UrlTemplateImageryProvider({
    //   url: "http://webrd02.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}",
    //   layer: "tdtVecBasicLayer",
    //   style: "default",
    //   format: "image/png",
    //   tileMatrixSetID: "GoogleMapsCompatible",
    // }),
  });

  // 地图叠加
  let imageryLayers = viewer.imageryLayers;
  let layer = imageryLayers.addImageryProvider(
    // 天地图中文标记服务
    new Cesium.WebMapTileServiceImageryProvider({
      alpha: 0.8,
      url: "http://{s}.tianditu.gov.cn/cia_c/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=cia&tileMatrixSet=c&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default&format=tiles&tk=30d07720fa76f07732d83c748bb84211",
      layer: "tdtCva",
      style: "default",
      format: "tiles",
      tileMatrixSetID: "c",
      subdomains: ["t0", "t1", "t2", "t3", "t4", "t5", "t6", "t7"],
      tilingScheme: new Cesium.GeographicTilingScheme(),
      tileMatrixLabels: [
        "1",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8",
        "9",
        "10",
        "11",
        "12",
        "13",
        "14",
        "15",
        "16",
        "17",
        "18",
      ],
      maximumLevel: 18,
    })
  );
  // 隐藏logo
  viewer.cesiumWidget.creditContainer.style.display = "none";
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
