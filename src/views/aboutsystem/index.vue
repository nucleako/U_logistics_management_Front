<template>
  <div style="height: 1400px;">
    <div class="top">
      <systemmap />
    </div>
  </div>
</template>
<script>
import systemmap from './systemmap.vue'
export default {
	name: 'Aboutsystem',
	components: { systemmap },
	data() {
		return {}
	},
	methods: {}
}
</script>

<style>
.el-carousel__item h3 {
  color: #475669;
  font-size: 14px;
  opacity: 0.75;
  line-height: 200px;
  margin: 0;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n+1) {
  background-color: #d3dce6;
}

.top{
  width:100%;
  height: 500px;
  background-position: 1px;
}
 .support{
    font-family: 微软雅黑;
    line-height: 64px;
    color: #fff;
    font-size: 36px;
    margin-top: -220px;
    margin-left: 150px;
}
.us_bar {
  background: #f4f8fd;
  width: 100%;
  height: 100px;
  margin-top: 90px;
}
.us_tab {
  width: 1200px;
  height: 80px;
  margin: auto;
}
.us_tab li {
  display: inline;
  font-size: 20px;
  line-height: 80px;
  padding-bottom: 26px;
}

.us_tab li:hover{
  border-bottom: #078be4 solid;
}

.us-map {
  text-align: center;
  padding: 80px 0;
  margin-left: -100px;
  margin-top: -80px;
}

</style>
