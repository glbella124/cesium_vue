<template>
  <div id="cesiumContainer"></div>
</template>

<script setup>
import * as Cesium from "cesium";
import "./Widgets/widgets.css";
import { onMounted } from "vue";

// 基础配置

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
      sources:{
        positiveX: "./texture/sky/px.jpg",
        negativeX: "./texture/sky/nx.jpg",
        positiveY: "./texture/sky/ny.jpg",
        negativeY: "./texture/sky/py.jpg",
        positiveZ: "./texture/sky/pz.jpg",
        negativeZ: "./texture/sky/nz.jpg",
      }
    })
  });

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
