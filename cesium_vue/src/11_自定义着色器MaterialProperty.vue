<template>
  <div id="cesiumContainer"></div>
</template>

<script setup>
import * as Cesium from "cesium";
import "./Widgets/widgets.css";
import { onMounted } from "vue";
import { log } from "console";

import gsap from "gsap";

// 自定义着色器 -- MaterialProperty

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

  // 上海
  let position = Cesium.Cartesian3.fromDegrees(121.5, 31.1, 10000);

  // 广州塔
  let position2 = Cesium.Cartesian3.fromDegrees(113.3191, 23.109, 1000000);

  // 让相机飞往某个地方
  viewer.camera.flyTo({
    destination: position2,
    orientation: {
      heading: Cesium.Math.toRadians(0),
      pitch: Cesium.Math.toRadians(-40),
      roll: 0,
    },
  });

  // 封装一个自定义材质
  class CustomMaterialProperty {
    constructor() {
      this.definationChanged = new Cesium.Event();
      // 增加自己的着色器
      Cesium.Material._materialCache.addMaterial("CustomMaterial", {
        fabric: {
          type: "CustomMaterial",
          uniforms: {
            uTime: 0,
          },
          source: `
          czm_material czm_getMaterial(czm_materialInput materialInput)
          {
            // 生成默认的基础材质
            czm_material material = czm_getDefaultMaterial(materialInput);
            // material.diffuse = vec3(1.0,0.0,0.8);
            // st -- uv坐标
            material.diffuse = vec3(materialInput.st,uTime);
            return material;
          }
      `,
        },
      });

      this.params = {
        uTime:0
      }

      gsap.to(this.params,{
        uTime:1,
        duration:2,
        repeat:-1,
        yoyo:true,
        ease:"linear"
      })
    }


    getType() {
      // 返回材质类型
      return "CustomMaterial";
    }

    // 用来传uniform
    getValue(time, result) {
      // performance -- 以页面打开的毫秒数算的
      // let t = performance.now() / 1000;
      // 时间在0,1之间切换
      // t = t % 1;
      // console.log(t);
      // result.uTime = t;
      // console.log(result,"result");

      // 利用gsap
      result.uTime = this.params.uTime

      // 返回材质值
      return result;
    }
  }

  let material1 = new CustomMaterialProperty();

  // 实体创建矩形
  let rectangle = viewer.entities.add({
    id: "redRect",
    rectangle: {
      coordinates: Cesium.Rectangle.fromDegrees(
        // 西，南，东，北
        90,
        20,
        110,
        30
      ),
      // 设置entity材质, MaterialProperty
      material: material1,
    },
  });

  // primitive创建矩形几何体
  // 1 - 创建几何体
  let rectGeometry = new Cesium.RectangleGeometry({
    rectangle: Cesium.Rectangle.fromDegrees(115, 20, 135, 30),
    // 距离表面高度
    height: 2,
    // PerInstanceColorAppearance -- 实例颜色决定材质颜色
    vertexFormat: Cesium.EllipsoidSurfaceAppearance.VERTEX_FORMAT,
  });

  // 2 -- 创建几何体实例
  let instance = new Cesium.GeometryInstance({
    id: "yellowRect",
    geometry: rectGeometry,
    attributes: {
      color: Cesium.ColorGeometryInstanceAttribute.fromColor(
        Cesium.Color.YELLOW.withAlpha(0.5)
      ),
    },
  });

  let rectGeometry1 = new Cesium.RectangleGeometry({
    rectangle: Cesium.Rectangle.fromDegrees(140, 20, 160, 30),
    height: 0,
    // 改成椭球体顶点
    vertexFormat: Cesium.EllipsoidSurfaceAppearance.VERTEX_FORMAT,
  });

  let instance2 = new Cesium.GeometryInstance({
    id: "blueRect",
    geometry: rectGeometry1,
    attributes: {
      color: Cesium.ColorGeometryInstanceAttribute.fromColor(
        Cesium.Color.BLUE.withAlpha(0.5)
      ),
    },
  });

  // test -3 -- 编写着色器修改材质
  // https://cesium.com/downloads/cesiumjs/releases/b28/Documentation/
  // czm_getMaterialInput -- 用作每个材质 czm_getMaterial函数的输入
  // let material8 = new Cesium.Material({
  //   fabric: {
  //     uniforms: {
  //       uTime: 0.5,
  //     },
  //     // diffuse -- 漫反射没有透明度，三维向量
  // source: `
  // czm_material czm_getMaterial(czm_materialInput materialInput)
  // {
  //   // 生成默认的基础材质
  //   czm_material material = czm_getDefaultMaterial(materialInput);
  //   // material.diffuse = vec3(1.0,0.0,0.8);
  //   // st -- uv坐标
  //   // material.diffuse = vec3(materialInput.st,0.0);
  //   // 取余 10%1
  //   float strength = mod((materialInput.s+uTime)*10.0,1.0);
  //   material.diffuse = vec3(strength,0.0,0.0);
  //   return material;
  // }
  // `,
  //   },
  // });

  // gsap.to(material8.uniforms, {
  //   uTime: 1,
  //   duration: 2,
  //   repeat: -1,
  //   ease: "linear",
  // });

  // console.log(material8.shaderSource, "material8");

  // Appearance编写着色器修改外观
  // 表面先计算好
  let appearance = new Cesium.EllipsoidSurfaceAppearance({
    // material: material8,
    // aboveGround: false,
    // translucent: true,
    fragmentShaderSource: `
    varying vec3 v_positionMC;
    varying vec3 v_positionEC;
    varying vec2 v_st;
    uniform float uTime;
    void main(){
      czm_materialInput materialInput;
      gl_FragColor = vec4(v_st,uTime, 1.0);
    }
    `,
  });

  appearance.uniforms = {
    uTime: 0,
  };

  gsap.to(appearance.uniforms, {
    uTime: 1,
    duration: 2,
    repeat: -1,
    yoyo: true,
    ease: "linear",
  });

  // 表面没有直接计算
  // let appearance = new Cesium.MaterialAppearance({
  //   material: materialGrid,
  // });

  // 3 -- 图元
  let primitive = new Cesium.Primitive({
    geometryInstances: [instance, instance2],
    // 材质 -- 设置外观
    appearance: appearance,
  });

  // 4 -- 添加到viewer
  viewer.scene.primitives.add(primitive);
  viewer.zoomTo(viewer.entities);
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
