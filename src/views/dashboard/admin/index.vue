<template>
  <div class="dashboard-editor-container">
    <github-corner class="github-corner" />

    <panel-group />

    <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;margin-top: 70px;">
      <bar-chart :xlist="xlist" :ylist="ylist" />
    </el-row>
  </div>
</template>

<script>
import GithubCorner from '@/components/GithubCorner'
import { get } from '../../../utils/request'
import PanelGroup from './components/PanelGroup'
import BarChart from './components/BarChart'
export default {
	name: 'DashboardAdmin',
	components: {
		GithubCorner,
		PanelGroup,
		BarChart
	},
	data() {
		return {
			listQuery: {
				page: 1,
				pageSize: 20
			},
			list: [],
			xlist: [],
			ylist: []
		}
	},
	mounted() {
		this.getBill()
	},
	methods: {
		getBill() {
			get('bill/pageQuery', this.listQuery).then((res) => {
				// 提取满足条件的价格列表
				const priceList = res.data.list
					.filter(v => v.state === 1)
					.map(v => v.price)
					.filter(price => price !== undefined)

				// 对价格列表进行排序并截取前十个
				this.list = priceList.sort((a, b) => b - a).slice(0, 10)

				// 获取满足条件且价格在前十个中的数据，并按价格降序排序
				const selectedData = res.data.list
					.filter(v => v.state === 1 && this.list.includes(v.price))
					.map(v => ({ id: v.id, price: v.price }))
					.sort((a, b) => b.price - a.price)

				// 提取 id 列表和价格列表
				this.xlist = selectedData.map(v => v.id)
				this.ylist = selectedData.map(v => v.price)

				console.log('ID 列表:', this.xlist)
				console.log('价格列表:', this.ylist)
			})
		}
	}
}
</script>

<style lang="scss" scoped>
.dashboard-editor-container {
  padding: 32px;
  background-color: rgb(240, 242, 245);
  position: relative;

  .github-corner {
    position: absolute;
    top: 0px;
    border: 0;
    right: 0;
  }

  .chart-wrapper {
    background: #fff;
    padding: 16px 16px 0;
    margin-bottom: 32px;
  }
}

@media (max-width:1024px) {
  .chart-wrapper {
    padding: 8px;
  }
}
</style>
