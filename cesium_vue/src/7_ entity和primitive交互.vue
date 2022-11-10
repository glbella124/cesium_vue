<template>
  <div id="cesiumContainer"></div>
</template>

<script setup>
import * as Cesium from "cesium";
import "./Widgets/widgets.css";
import { onMounted } from "vue";
import { log } from "console";

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
  let position2 = Cesium.Cartesian3.fromDegrees(113.3191, 23.109, 1000);

  // setView瞬间到达指定位置，视角
  // viewer.camera.setView({
  //   // 指定相机位置
  //   destination: position,
  //   // 指定相机视角
  //   orientation:{
  //     // 指定相机的朝向，偏航角 -- 沿y轴旋转
  //     heading:Cesium.Math.toRadians(0),
  //     // 指定相机的俯仰角 -- 沿x轴旋转 0度是竖直向上,-90度是向下
  //     pitch:Cesium.Math.toRadians(-40),
  //     // 指定相机的滚转角
  //     roll:0
  //   }
  // });

  // 让相机飞往某个地方
  viewer.camera.flyTo({
    destination: position2,
    orientation: {
      heading: Cesium.Math.toRadians(0),
      pitch: Cesium.Math.toRadians(-40),
      roll: 0,
    },
  });

  // 添加3D建筑
  const osmBuildings = viewer.scene.primitives.add(
    // 若是有自己的数据
    // new Cesium.Cesium3DTileset({
    // url:""
    // })

    new Cesium.createOsmBuildings()
  );

  // 实体创建矩形
  let rectangle = viewer.entities.add({
    id:"redRect",
    rectangle: {
      coordinates: Cesium.Rectangle.fromDegrees(
        // 西，难，东，北
        90,
        20,
        110,
        30
      ),
      material: Cesium.Color.RED.withAlpha(0.5),
    },
  });

  // primitive创建矩形几何体
  // 1 - 创建几何体
  let rectGeometry = new Cesium.RectangleGeometry({
    rectangle: Cesium.Rectangle.fromDegrees(115, 20, 135, 30),
    // 距离表面高度
    height: 2,
    // PerInstanceColorAppearance -- 实例颜色决定材质颜色
    vertexFormat: Cesium.PerInstanceColorAppearance.VERTEX_FORMAT,
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
    vertexFormat: Cesium.PerInstanceColorAppearance.VERTEX_FORMAT,
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

  // 设置外观
  let appearance = new Cesium.PerInstanceColorAppearance({
    flat: true,
  });

  // 3 -- 图元
  let primitive = new Cesium.Primitive({
    geometryInstances: [instance, instance2],
    // 材质 -- 设置外观
    appearance: appearance,
  });

  // 4 -- 添加到viewer
  viewer.scene.primitives.add(primitive);
  viewer.zoomTo(viewer.entities);

  // 动态修改图元颜色
  setTimeout(() => {
    // 获取图元属性
    let attributes = primitive.getGeometryInstanceAttributes("blueRect");
    attributes.color = Cesium.ColorGeometryInstanceAttribute.toValue(
      Cesium.Color.PURPLE.withAlpha(0.5)
    );
    console.log(attributes);
  }, 10000);

  // setInterval
  // setInterval(()=>{
  //   let attributes = primitive.getGeometryInstanceAttributes('blueRect')
  //   attributes.color = Cesium.ColorGeometryInstanceAttribute.toValue(
  //     Cesium.Color.fromRandom({
  //       alpha:0.5
  //     })
  //   )
  // },10000)

  // 拾取 Cesium.ScreenSpaceEventHandler(元素)
  // 处理用户输入事件, 可以添加自定义功能在用户输入时执行
  let handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
  // 设置监听事件
  handler.setInputAction(function (movement) {
    console.log(movement,"movement");
    let pickedObject = viewer.scene.pick(movement.position);
    console.log(pickedObject,"pickedObject");
    if (Cesium.defined(pickedObject) && typeof pickedObject.id == "string") {
      console.log(pickedObject.id,"id");
      let attributes = primitive.getGeometryInstanceAttributes(pickedObject.id)
      attributes.color = Cesium.ColorGeometryInstanceAttribute.toValue(
        Cesium.Color.BLUE.withAlpha(0.5)
      )
    }
    // 事件类型
  }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

  // 通过按键移动相机
  document.addEventListener("keydown", (e) => {
    // 获取相机离地面的高度
    let height = viewer.camera.positionCartographic.height;
    let moveRate = height / 10;
    console.log(moveRate);
    if (e.key == "w") {
      // 设置相机向前移动
      viewer.camera.moveForward(moveRate);
    } else if (e.key == "s") {
      // 设置相机向后移动
      viewer.camera.moveBackward(moveRate);
    } else if (e.key == "a") {
      // 设置相机向左移动
      viewer.camera.moveLeft(moveRate);
    } else if (e.key == "d") {
      // 设置相机向右移动
      viewer.camera.moveRight(moveRate);
    } else if (e.key == "q") {
      // 设置相机向左旋转
      viewer.camera.lookLeft(Cesium.Math.toRadians(0.1));
    } else if (e.key == "e") {
      // 设置相机向右q旋转
      viewer.camera.lookRight(Cesium.Math.toRadians(0.1));
    } else if (e.key == "r") {
      // 向上移动相机
      viewer.camera.lookUp(Cesium.Math.toRadians(0.1));
    } else if (e.key == "f") {
      // 向下移动相机
      viewer.camera.lookDown(Cesium.Math.toRadians(0.1));
    } else if (e.key == "g") {
      // 向左逆时针翻滚
      viewer.camera.twistLeft(Cesium.Math.toRadians(0.1));
    } else if (e.key == "h") {
      viewer.camera.twistRight(Cesium.Math.toRadians(0.1));
    }
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
