<template>
  <div style="height: 1400px;">
    <div class="top">
      <systemmap />
    </div>

    <div class="us-wrapper">
      <p class="us_title" style="padding-top: 90px;">
        联系我们<span class="bline" />
      </p>
      <ul class="us-contact">
        <li>
          <h1>服务热线</h1>
          <p>13096951181</p>
        </li>
        <li>
          <h1>客服邮箱</h1>
          <p>NUCLEAKO@GMAIL.COM</p>
        </li>
        <li>
          <h1>公司地址</h1>
          <p>甘肃：甘肃省兰州市安宁区银滩路街道营门村1号<br></p>
        </li>
      </ul>
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
.us-wrapper {
  width: 1200px;
  margin: auto;
  position: relative;
  top:35%;
}
.us_title {
  font-size: 32px;
  font-weight: 700px;
  color: #333333;
  text-align: center;
  position: relative;
}
.bline {
  width: 50px;
  height: 8px;
  border-radius: 4px;
  background: #4e6cef;
  position: absolute;
  left: 47.9%;
  top: 130px;
}
.us-contact {
  padding: 20px 0;
  margin: 40px 0;
  margin-left: 80px;
}
ul, ol {
  list-style: none;
}
.us-contact li {
  display: inline-table;
  width: 33%;
}
.us-map {
  text-align: center;
  padding: 80px 0;
  margin-left: -100px;
  margin-top: -80px;
}

</style>
