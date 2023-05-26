<template>
  <div>
    <div id="container" />
    <el-button id="cleanBtn" round @click="cleanPas">清除地图</el-button>
    <baidu-map ref="baiduMap" class="map" :center="map.center" :zoom="map.zoom" @ready="handler">
      <!-- 缩放 -->
      <bm-navigation anchor="BMAP_ANCHOR_TOP_LEFT" />
      <!-- 定位 -->
      <bm-geolocation
        style="position: relative;top:240px"
        anchor="BMAP_ANCHOR_BOTTOM_RIGHT"
        :show-address-bar="true"
        :auto-location="true"
      />
      <!-- 点 -->
      <bm-marker
        :position="map.center"
        :dragging="map.dragging"
        animation="BMAP_ANIMATION_BOUNCE"
      >
        <!-- 提示信息 -->
        <bm-info-window :show="map.show">这是您的当前位置</bm-info-window>
      </bm-marker>
      <bm-panorama />
      <bm-traffic :predict-date="{ weekday: 7, hour: 12 }" />
      <bm-view class="map" />
      <bm-control :offset="{ width: '10px', height: '10px' }">
        <bm-auto-complete v-model="keyword" :sug-style="{ zIndex: 1 }">
          <el-input v-model="keyword" style="position: relative; left: 100px" placeholder="甘肃农业大学" />
        </bm-auto-complete>
      </bm-control>
      <bm-local-search :keyword="keyword" :auto-viewport="true" />
    </baidu-map>

  </div>
</template>
<script src="http://api.map.baidu.com/api?v=2.0&ak=BUZxRvMCjg5q9VRo03xi1gSRjro3pSF1"></script>

<script>
import { BMap } from 'vue-baidu-map';
import { Message } from 'element-ui';

export default {
  name: 'Demo',
  data() {
    return {
      map: {
        center: { lng: 103.707647, lat: 36.09687 },
        zoom: 15,
        show: true,
        dragging: true
      },
      keyword: '',
      sourcePoint: '',
      destinationPoint: ''
    };
  },

  methods: {
    handler({ BMap, map }) {
		map.enableScrollWheelZoom(true);
		// 修正 this 的指向
		const self = this;

		// 点击事件获取经纬度
		map.addEventListener('click', function(e) {
		const lng = e.point.lng;
		const lat = e.point.lat;
		console.log('经度:', lng, '纬度:', lat);

		if (self.sourcePoint && self.destinationPoint) {
			self.sourcePoint = '';
			self.destinationPoint = '';
		}

		if (!self.sourcePoint) {
			// 设置源地址和源点
			self.sourceAddress = `${lng},${lat}`;
			self.sourcePoint = new BMap.Point(lng, lat);
		} else if (!self.destinationPoint) {
			// 设置目的地地址和目的地点
			self.destinationAddress = `${lng},${lat}`;
			self.destinationPoint = new BMap.Point(lng, lat);

			// 进行路线规划
			if (self.sourcePoint && self.destinationPoint) {
				const driving = new BMap.DrivingRoute(map, {
					renderOptions: { map: map, autoViewport: true },
					onSearchComplete: function(results) {
						if (driving.getStatus() == BMap.STATUS_SUCCESS) {
							return ;
						}
						var plan = results.getPlan(0);
						var output = "从起始地到出发地运送大约需要";
						const timeInfo = self.splitTimeString(plan.getDuration(true));
						output += timeInfo + "\n";
						output += "总路程为：" ;
						output += plan.getDistance(true) + "\n";

						Message({
							message: output,
							type: 'success',
							duration: 5 * 1000
						})
					}
				});
				driving.search(self.sourcePoint, self.destinationPoint);
			}
		}
		});
	},
    cleanPas() {
      this.sourcePoint = '';
      this.destinationPoint = '';
	  //清除路径
	  if (this.$refs.baiduMap && this.$refs.baiduMap.map) {
      const map = this.$refs.baiduMap.map;
      map.clearOverlays();
    }
    },
    splitTimeString(timeString) {
		// 使用正则表达式匹配数字信息
		const regex = /((\d+)天)?((\d+)小时)?(\d+)分钟/;
		const match = timeString.match(regex);
		if (match) {
			// 提取匹配结果中的数字信息
			const days = match[2] ? parseInt(match[2], 10) : 0;
			const hours = match[4] ? parseInt(match[4], 10) : 0;
			const minutes = parseInt(match[5], 10);

			const totalMinutes = (days * 24 * 60) + (hours * 60) + minutes;
			const convertedDays = Math.ceil(totalMinutes / (24 * 20));
			return `${convertedDays}天`;
		}
		return null; // 如果字符串格式不匹配，则返回null或其他适当的值
	}

  }
};
</script>
<style scoped>
.map {
  width: 100%;
  height: 1000px;
}
#cleanBtn{
	position: absolute;
	top: 90px;
	left: 1500px;
	z-index: 999;
}
</style>
