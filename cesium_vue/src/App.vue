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

// 3dTiles -- 自定义样式 -- 高级设置

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
    shouldAnimate: true,

  });

  // 设置沙箱允许使用js
  let iframe = document.getElementsByClassName("cesium-infoBox-iframe")[0]
  iframe.setAttribute("sandbox","allow-same-origin allow-scripts allow-popups allow-forms")
  iframe.setAttribute("src","")

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
    defines: {
      distance:
        "distance(vec2(${feature['cesium#longitude']},${feature['cesium#latitude']}),vec2(113.3191,23.109))",
    },
    color: {
      conditions: [
        ["${distance} < 0.01", "color('rgba(200,100,190,0.9)')"],
        ["${distance} < 0.02", "color('rgba(200,100,190,0.7)')"],
        ["${distance} < 0.04", "color('rgba(200,100,190,0.4)')"],
        ["true", "color('white')"],
      ],
    },
    // show: true,
    show: "${distance} < 0.04",
  });

  // tiles3D.style = new Cesium.Cesium3DTileStyle({
  //   // 颜色设置，颜色名/16进制颜色值/rgba颜色值
  //   // color:"color('yellow')",
  //   // color: "rgba(255,255,0,0.5)",
  //   // color:"color('#f00')",
  //   color: {
  //     conditions: [
  //       [
  //         "${feature['building']} === 'apartments'",
  //         "color('rgba(50,255,0,0.5)')",
  //       ],
  //       [
  //         "${feature['building']} === 'commercial'",
  //         "color('rgba(255,100,20,0.8)')",
  //       ],
  //       ["${feature['building']} === 'office'", "color('#9999FF')"],
  //       ["${feature['building']} === 'residential'", "color('#cd7bdd')"],
  //       ["${feature['cesium#estimatedHeight']} > 300 ", "color('rgba(100,200,255,0.8)')"],
  //       ["true", "color('white')"],
  //     ],
  //   },
  //   show: true,
  // });
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
