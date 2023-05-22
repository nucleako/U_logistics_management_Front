<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
import echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
import resize from './mixins/resize'
import { get, post } from '../../../../utils/request'
const animationDuration = 6000

export default {
  mixins: [resize],
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '300px'
    },
    xlist: {
      type: [Array]
    },
    ylist: {
      type: [Array]
    }
  },
  data() {
    return {
      chart: null
    }
  },
  watch: {
    xlist: {
      handler(val) {
        this.initChart()
      },
      deep: true
    },
    ylist: {
      handler(val) {
      },
      deep: true
    }
  },
  // mounted() {
  //     this.initChart()
  // },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    initChart() {
      this.chart = echarts.init(this.$el, 'macarons')
      this.chart.setOption({
        tooltip: {
          trigger: 'axis',
          axisPointer: { // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        grid: {
          top: 30,
          left: '2%',
          right: '2%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [{
          name: 'ID',
          type: 'category',
          data: this.xlist,
          axisTick: {
            alignWithLabel: true
          }
        }],
        yAxis: [{
          name: '账单收益(元)',
          type: 'value',
          axisTick: {
            show: false
          },
          axisLabel: {
            textStyle: {
              fontSize: '18'
            }
          }
        }],
        series: [{
          name: '十佳收益',
          type: 'bar',
          stack: 'vistors',
          barWidth: '60%',
          data: this.ylist,
          animationDuration,
          itemStyle: {
            normal: {
              label: {
                formatter: '{c}',
                show: true,
                position: 'top',
                textStyle: {
                  fontWeight: 'bolder',
                  fontSize: '12',
                  color: '#57b2de'
                }
              }
            }
          }
        }]

      })
    }

  }
}
</script>
