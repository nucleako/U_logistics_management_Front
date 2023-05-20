<template>

  <div>

      <baidu-map class="map" :center="map.center" :zoom="map.zoom" @ready="handler">
          <!--缩放-->
          <bm-navigation anchor="BMAP_ANCHOR_TOP_LEFT"></bm-navigation>
          <!--定位-->
          <bm-geolocation style="position: relative;top:240px" anchor="BMAP_ANCHOR_BOTTOM_RIGHT" :showAddressBar="true" :autoLocation="true"></bm-geolocation>
          <!--点-->
          <bm-marker :position="map.center" :dragging="map.dragging" animation="BMAP_ANIMATION_BOUNCE">
              <!--提示信息-->
              <bm-info-window :show="map.show">hello~这是我的位置</bm-info-window>
          </bm-marker>
          <bm-panorama></bm-panorama>
          <bm-traffic :predictDate="{weekday: 7, hour: 12}"></bm-traffic>

          <bm-view class="map"></bm-view>
  <bm-control :offset="{width: '10px', height: '10px'}">
    <bm-auto-complete v-model="keyword" :sugStyle="{zIndex: 1}">
      <el-input style="position: relative;left:100px" placeholder="甘肃农业大学" disabled></el-input> <!-- 这里指代一个自定义搜索框组件 -->
    </bm-auto-complete>
  </bm-control>
  <bm-local-search :keyword="keyword" :auto-viewport="true" ></bm-local-search>

</baidu-map>

  </div>

</template>

<script>

  export default {
      name: "demo",
      data: () => ({
          map:{
              center: {lng: 103.707647 , lat: 36.09687},
              zoom: 15,
              show: true,
              dragging: true
          },
          keyword:'甘肃农业大学'
      }),

      methods: {
          handler ({BMap, map}) {
              let me = this;
              console.log(BMap, map)
              // 鼠标缩放
              map.enableScrollWheelZoom(true);
              // 点击事件获取经纬度
              map.addEventListener('click', function (e) {
                  console.log(e.point.lng, e.point.lat)
              })

          }

      }

  }

</script>



<style scoped>

  .map {

      width: 100%;

      height: 500px;

  }

</style>
