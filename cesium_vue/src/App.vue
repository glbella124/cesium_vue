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

// 追踪航班跨洋飞行
// CZML格式 -- Cesium Language(CZML) Guide
// 一种JSON格式，用于描述时间动态图形场景，主要用于在运行Cesium的Web浏览器中显示
// CZML允许数据驱动，可以通过Cesium查看器显示丰富的场景，无需任何自定义代码

// 设置cesium token
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
    infoBox: false,
    terrainProvider: Cesium.createWorldTerrain({
      requestWaterMask: true,
      requestVertexNormals: true,
    }),
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

  // 添加3D建筑
  const osmBuildings = viewer.scene.primitives.add(
    new Cesium.createOsmBuildings()
  );
  // 采样位置
  const positionProperty = new Cesium.SampledPositionProperty();
  // 事件间隔
  const timeStepInSeconds = 30;
  // 整个飞行花费的时间
  const totalSeconds = (planeData.length - 1) * timeStepInSeconds;
  // console.log(planeData);
  // 设置起点时间
  const time = new Date("2022-03-09T10:00:00Z");
  // Cesium,默认使用的是儒略日的时间
  const startJulianDate = Cesium.JulianDate.fromDate(time);
  // 设置终点时间
  const stopJulianDate = Cesium.JulianDate.addSeconds(
    startJulianDate,
    totalSeconds,
    new Cesium.JulianDate()
  );

  // 将查看器的时间调整到起点和结束点的范围
  viewer.clock.startTime = startJulianDate.clone();
  viewer.clock.stopTime = stopJulianDate.clone();
  viewer.clock.currentTime = startJulianDate.clone();
  viewer.timeline.zoomTo(startJulianDate, stopJulianDate);
  // 采样点会自动进行插值计算
  planeData.forEach((dataPoint, i) => {
    // 当前点的时间
    const time = Cesium.JulianDate.addSeconds(
      startJulianDate,
      i * timeStepInSeconds,
      new Cesium.JulianDate()
    );
    // 设置当前点的位置
    const position = Cesium.Cartesian3.fromDegrees(
      dataPoint.longitude,
      dataPoint.latitude,
      dataPoint.height
    );
    // 添加轨迹采样点
    positionProperty.addSample(time, position);
    // 暂时查看
    viewer.entities.add({
      position: position,
      point: {
        pixelSize: 10,
        color: Cesium.Color.RED,
        outlineColor: Cesium.Color.WHITE,
        outlineWidth: 2,
      },
    });
  });

  // 创建飞机
  const planeEntity = viewer.entities.add({
    name: "飞机",
    // 设置飞机的可用 -- 时间间隔集合
    availability: new Cesium.TimeIntervalCollection([
      new Cesium.TimeInterval({
        start: startJulianDate,
        stop: stopJulianDate,
      }),
    ]),
    position: positionProperty,
    // VelocityOrientationProperty会自动根据采样点，计算出飞机的速度和方向
    orientation: new Cesium.VelocityOrientationProperty(positionProperty),
    model: {
      uri: "./model/Air.glb",
      minimumPixelSize: 128,
      maximumScale: 20000,
    },
    // 绘制轨迹线
    path: new Cesium.PathGraphics({
      width: 5,
    }),
  });

  // 相机追踪运动的物体
  viewer.trackedEntity = planeEntity;

  // 设置时间速率
  viewer.clock.multiplier = 10
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
