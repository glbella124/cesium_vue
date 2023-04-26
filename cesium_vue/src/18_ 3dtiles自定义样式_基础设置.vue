<template>
  <div id="cesiumContainer"></div>
</template>

<script setup>
import * as Cesium from "cesium";
import "./Widgets/widgets.css";
import { onMounted } from "vue";
import gsap from "gsap";
import planeData from "@/assets/json/plane.json";
import TextureUniform from "cesium/Source/Scene/Model/TextureUniform";

// 自定义3dtiles样式

// 设置cesium token

// geometricError -- 几何误差，在屏幕上显示的与真实大小的误差,误差值越大越精细,变小了也可以看到
// boundingVolume -- 表示范围
// boundingVolume.region -- 顺序为west,south,east,north,minium height,maxmum height
Cesium.Ion.defaultAccessToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJkYjBjMGZlMy01YmEyLTQ3OTctYjNhNC1iZjE1OWUxMWUxOWMiLCJpZCI6Nzc4OTksImlhdCI6MTY1NTQ0MzkyNX0.8cCNrZ_FJRSxIhqhZO_VP7XRLt3IxFB5TaXqpGLmxtk";
// 设置cesium静态资源路径
window.CESIUM_BASE_URL = "/";

// 设置cesium默认视角 -- 中国
// Cesium.Camera.DEFAULT_VIEW_RECTANGLE = Cesium.Rectangle.fromDegrees(
//   // 西边的经度
//   89.5,
//   // 南边维度
//   20.4,
//   // 东边经度
//   110.4,
//   // 北边维度
//   61.2
// );
onMounted(() => {
  let viewer = new Cesium.Viewer("cesiumContainer", {
    // 信息窗口 -- 不提示allow-script报错
    infoBox: true,
    // terrainProvider: Cesium.createWorldTerrain({
    //   requestWaterMask: true,
    //   requestVertexNormals: true,
    // }),
    shouldAnimate: true,
    // baseLayerPicker: false,
    // animation: true,
    // timeline: false,
    // homeButton: false,
    // sceneModePicker: false,
    // navigationHelpButton: false,
    // fullscreenButton: false,
    // vrButton: false,
    // selectionIndicator: false,
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

  let tiles3D = new Cesium.createOsmBuildings();
  // 添加3D建筑
  const osmBuildings = viewer.scene.primitives.add(tiles3D);

  // 广州塔
  let position = Cesium.Cartesian3.fromDegrees(113.3191, 23.109, 1000);
  viewer.camera.flyTo({
    destination: position,
    duration: 2,
  });

  tiles3D.style = new Cesium.Cesium3DTileStyle({
    // 颜色设置，颜色名/16进制颜色值/rgba颜色值
    // color:"color('yellow')",
    // color: "rgba(255,255,0,0.5)",
    // color:"color('#f00')",
    color: {
      conditions: [
        [
          "${feature['building']} === 'apartments'",
          "color('rgba(50,255,0,0.5)')",
        ],
        [
          "${feature['building']} === 'commercial'",
          "color('rgba(255,100,20,0.8)')",
        ],
        ["${feature['building']} === 'office'", "color('#9999FF')"],
        ["${feature['building']} === 'residential'", "color('#cd7bdd')"],
        ["${feature['cesium#estimatedHeight']} > 300 ", "color('rgba(100,200,255,0.8)')"],
        ["true", "color('white')"],
      ],
    },
    show: true,
  });
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
