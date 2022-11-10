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
  let position2 = Cesium.Cartesian3.fromDegrees(113.3191,23.109,1000)


  
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
    destination:position2,
    orientation:{
      heading:Cesium.Math.toRadians(0), 
      pitch:Cesium.Math.toRadians(-40),
      roll:0
    }
  })

  // 添加3D建筑
  const osmBuildings = viewer.scene.primitives.add(
    // 若是有自己的数据
    // new Cesium.Cesium3DTileset({
      // url:""
    // })

    new Cesium.createOsmBuildings()
  )

  // 创建一个点
  let point = viewer.entities.add({
    // position
    position: position2,
    point:{
      pixelSize:10,
      color:Cesium.Color.RED,
      outlineColor:Cesium.Color.WHITE,
      outlineWidth:4
    }
  })

  // 添加文字标签和广告牌
  let label = viewer.entities.add({
    position: Cesium.Cartesian3.fromDegrees(113.3191,23.109,1050),
    label:{
      text:"Guangzhou Tower",
      font:"24px sans-serif",
      fillColor:Cesium.Color.WHITE,
      outlineColor:Cesium.Color.BLACK,
      outlineWidth:2,
      style: Cesium.LabelStyle.FILL_AND_OUTLINE,
      // 设置文字的偏移量
      pixelOffset: new Cesium.Cartesian2(0,-24),
      // 设置文字的显示位置
      horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
      // 竖直方向
      verticalOrigin:Cesium.VerticalOrigin.BOTTOM
    },
    // 广告牌
    billboard:{
      image:"./texture/gzt.png",
      width:50,
      height:50,
      // 设置广告牌的显示位置
      verticalOrigin:Cesium.VerticalOrigin.BOTTOM,
      // 设置广告牌的水平方向位置
      horizontalOrigin: Cesium.HorizontalOrigin.CENTER
    }
  })

  // 添加飞机
  const airplane = viewer.entities.add({
    name: "Airplane",
    position: Cesium.Cartesian3.fromDegrees(113.3191, 23.109, 1500),
    model: {
      uri: "./model/Air.glb",
      // 设置飞机的最小像素
      minimumPixelSize: 128,
      // 设置飞机的轮廓
      silhouetteSize: 5,
      // 设置轮廓的颜色
      silhouetteColor: Cesium.Color.WHITE,
      // 设置相机距离模型多远的距离显示 -- 到达该距离内才会去显示
      distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 200000),
    },
  });

  viewer.zoomTo(viewer.entities)

  // 实体创建矩形
  let rectangle = viewer.entities.add({
    rectangle:{
      coordinates: Cesium.Rectangle.fromDegrees(
        // 西，难，东，北
        90,20,110,30
      ),
      material: Cesium.Color.RED.withAlpha(0.5)
    }
  })

  // primitive创建矩形几何体
  let rectGeometry = new Cesium.RectangleGeometry({
    rectangle: Cesium.Rectangle.fromDegrees(
      115,20,135,30
    ),
    // 距离表面高度
    height:2,
    // PerInstanceColorAppearance -- 实例颜色决定材质颜色
    vertexFormat: Cesium.PerInstanceColorAppearance.VERTEX_FORMAT
  })

  // 2 -- 创建几何体实例
  let instance = new Cesium.GeometryInstance({
    geometry:rectGeometry,
    attributes:{
      color:Cesium.ColorGeometryInstanceAttribute.fromColor(
        Cesium.Color.YELLOW.withAlpha(0.5)
      )
    }
  })

  // 3 -- 图元
  let primitive = new Cesium.Primitive({
    geometryInstances:instance,
    // 材质 -- 设置外观
    appearance:new Cesium.PerInstanceColorAppearance({
      flat:true
    })
  })

  viewer.scene.primitives.add(primitive)









  // 通过按键移动相机
  document.addEventListener("keydown",(e)=>{
    // 获取相机离地面的高度  
    let height = viewer.camera.positionCartographic.height
    let moveRate = height/10
    console.log(moveRate);
    if(e.key == "w"){
      // 设置相机向前移动
      viewer.camera.moveForward(moveRate)
    }else if(e.key == "s"){
      // 设置相机向后移动
      viewer.camera.moveBackward(moveRate)
    }else if(e.key == "a"){
      // 设置相机向左移动
      viewer.camera.moveLeft(moveRate)
    }else if(e.key == "d"){
      // 设置相机向右移动
      viewer.camera.moveRight(moveRate)
    }else if(e.key == "q"){
      // 设置相机向左旋转
      viewer.camera.lookLeft(Cesium.Math.toRadians(0.1))
    }else if(e.key == "e"){
      // 设置相机向右q旋转
      viewer.camera.lookRight(Cesium.Math.toRadians(0.1))
    }else if(e.key == "r"){
      // 向上移动相机
      viewer.camera.lookUp(Cesium.Math.toRadians(0.1))
    }else if(e.key =="f"){
      // 向下移动相机
      viewer.camera.lookDown(Cesium.Math.toRadians(0.1))
    }else if(e.key == "g"){
      // 向左逆时针翻滚
      viewer.camera.twistLeft(Cesium.Math.toRadians(0.1))
    }else if(e.key == "h"){
      viewer.camera.twistRight(Cesium.Math.toRadians(0.1))
    }
  })
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
