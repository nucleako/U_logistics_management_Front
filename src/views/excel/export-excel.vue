<template>
  <div class="app-container">

    <div>
      <!-- <FilenameOption v-model="filename" /> -->
      <!-- <AutoWidthOption v-model="autoWidth" /> -->
      <!-- <BookTypeOption v-model="bookType" /> -->
      <el-button :loading="downloadLoading" style="margin:0 0 0 20px;" type="primary" icon="el-icon-document" @click="handleDownload">
        导出 Excel
      </el-button>
    </div>

    <!-- <el-table v-loading="listLoading" :data="list" element-loading-text="Loading..." border fit highlight-current-row>
      <el-table-column align="center" label="Id" width="95">
        <template slot-scope="scope">
          {{ scope.$index }}
        </template>
      </el-table-column>
      <el-table-column label="Title">
        <template slot-scope="scope">
          {{ scope.row.title }}
        </template>
      </el-table-column>
      <el-table-column label="Author" width="110" align="center">
        <template slot-scope="scope">
          <el-tag>{{ scope.row.author }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="Readings" width="115" align="center">
        <template slot-scope="scope">
          {{ scope.row.pageviews }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="Date" width="220">
        <template slot-scope="scope">
          <i class="el-icon-time" />
          <span>{{ scope.row.timestamp | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
    </el-table> -->
  </div>
</template>

<script>
import { parseTime } from '@/utils'
// options components
import FilenameOption from './components/FilenameOption'
import AutoWidthOption from './components/AutoWidthOption'
import BookTypeOption from './components/BookTypeOption'
import { get } from '../../utils/request'
export default {
	name: 'ExportExcel',
	components: { FilenameOption, AutoWidthOption, BookTypeOption },
	data() {
		return {
			list: null,
			listLoading: true,
			downloadLoading: false,
			filename: '对账单',
			autoWidth: true,
			bookType: 'xlsx',
			pageQuery: {
				page: 1,
				pageSize: 9999
			}
		}
	},
	computed: {
		getDate() {
			return function(time) {
				const dt = new Date(time)
				// Date.parse() 返回1970年1月1日午夜到指定日期（字符串）的毫秒数
				// 将获得的毫秒数加8个小时的毫秒数
				const ts = Date.parse(dt) + 8 * 3600 * 1000
				// 将处理的毫秒数转为ios格式字符串，并进行格式化处理
				const d = new Date(ts).toISOString().replace(/T/g, ' ').slice(0, 19)
				// 输出类似 2019-08-02 18:58:56
				return d
			}
		}
	},
	created() {
		this.fetchData()
	},
	methods: {
		fetchData() {
			this.listLoading = true
			get('bill/pageQuery', this.pageQuery).then((res) => {
				this.list = res.data.list.map(v => {
					return {
						...v,
						date: this.getDate(v.date) }
				})
			})
			// 数据有，转圈结束
			this.listLoading = false
		},
		handleDownload() {
			this.downloadLoading = true
			import('@/vendor/Export2Excel').then(excel => {
				// const tHeader = ['Id', 'Title', 'Author', 'Readings', 'Date']
				// const filterVal = ['id', 'title', 'author', 'pageviews', 'display_time']
				const tHeader = ['订单id', '承运商', '金额', '下单时间', '订单状态']
				const filterVal = ['id', 'CarrierID', 'price', 'date', 'state']
				const list = this.list
				const data = this.formatJson(filterVal, list)
				data.forEach(v => {
					if (v[4] == 1) return v.splice(-1, 1, '已完结')
					else return v.splice(-1, 1, '未完结')
				})
				console.log('yayay', data)
				excel.export_json_to_excel({
					header: tHeader,
					filename: this.filename,
					data
				})
				this.downloadLoading = false
			})
		},
		formatJson(filterVal, jsonData) {
			return jsonData.map(v => filterVal.map(j => {
				if (j === 'timestamp') {
					return parseTime(v[j])
				} else {
					return v[j]
				}
			}))
		}
	}
}
</script>

<style>
.radio-label {
  font-size: 14px;
  color: #606266;
  line-height: 40px;
  padding: 0 12px 0 30px;
}
</style>
