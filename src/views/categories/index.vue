<!--
 * @Author: 哎哟gg 3272684503@qq.com
 * @Date: 2022-10-12 11:11:49
 * @LastEditors: 哎哟gg 3272684503@qq.com
 * @LastEditTime: 2022-11-01 14:53:47
 * @FilePath: \order-admin\src\views\member\index.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div class="app-container">
      <div class="filter-container">
          <el-button class="filter-item" style="margin-left: 10px;width:70px;margin-right:10px" type="primary"  @click="handleCreate">
              添加
          </el-button>
        <el-input v-model="listQuery.Id" placeholder="序号" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
        <el-button class="filter-item" style="margin-left: 3px;width:90px;" icon="el-icon-search" @click="handleFilter">
          搜索
        </el-button>
      </div>
      <el-table
        :key="tableKey"
        v-loading="listLoading"
        :data="list"
        fit
        highlight-current-row
        style="width: 100%;"
        @sort-change="sortChange"
      >
        <el-table-column label="序号" prop="Id" sortable="custom" align="center" width="80" :class-name="getSortClass('Id')">
          <template slot-scope="{row}">
            <span>{{ row.Id }}</span>
          </template>
        </el-table-column>
        <el-table-column label="发件人" width="150px" align="center">
          <template slot-scope="{row}">
              <span>{{ row.SdCustomerName}}</span>
            </template>
        </el-table-column>
        <el-table-column label="寄件人公司" width="150px" align="center">
          <template slot-scope="{row}">
            <span>{{ row.SdCustomerCompanyName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="发件地址" width="150px" align="center">
          <template slot-scope="{row}">
            <span>{{ row.SdCustomerAddress }}</span>
          </template>
        </el-table-column>
        <el-table-column label="收件人" width="100px" align="center">
          <template slot-scope="{row}">
            <span>{{ row.RcvCustomerName}}</span>
          </template>
        </el-table-column>
        <el-table-column label="收件人公司" width="150px" align="center">
          <template slot-scope="{row}">
            <span>{{ row.RcvCustomerCompanyName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="收件地址"  align="center">
          <template slot-scope="{row}">
            <span>{{ row.RcvCustomerAddress}}</span>
          </template>
        </el-table-column>
        <el-table-column label="订单金额"  align="center">
          <template slot-scope="{row}">
            <span>{{ row.OrderPrice }}</span>
          </template>
        </el-table-column>
        <el-table-column label="订单状态"  align="center">
          <template slot-scope="{row}">
            <span>{{ row.OrderStatus }}</span>
          </template>
        </el-table-column>
        <el-table-column label="下单时间"  align="center">
            <template slot-scope="{row}">
              <span>{{ row.OrderDate }}</span>
            </template>
        </el-table-column>


        <el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width">
          <template slot-scope="{row,$index}">
            <el-button type="primary" size="mini" @click="handleUpdate(row)">
              修改
            </el-button>
            <el-button type="primary" size="mini" @click="handleUpdate(row)">
              详情
            </el-button>
            <el-button v-if="row.status!='deleted'" size="mini" type="danger" @click="handleDelete(row.id)">
              移除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        background
        layout="prev, pager, next"
        :total="1000">
      </el-pagination>
    </div>
</template>
<script>
import {get,post,post_json} from '../../utils/request'
export default {
  name: 'ComplexTable',
  components: { },
  data() {
    return {
      tableKey: 0,
      list: null,//表格依赖的数据
      total: 0,//分页的总数量
      listLoading: true,
      listQuery: {
        page:1,
        pageSize:9999
      },
      dialogStatus: '',
      dialogPvVisible: false,
    }
  },
  // 请求数据
  created() {
    // this.getList()
    this.getListPageQuery()
  },
  methods: {
    getListPageQuery() {
          // 无数据，转圈开始
          this.listLoading = true
          get('list/pageQuery',this.listQuery).then((res)=>{
            // console.log('getListPageQuery',res);
            // console.log('getListPageQuery',this.listQuery);
            this.total=res.data.list.length
            this.list=res.data.list
            this.total=res.data.list.length
          })
          // 数据有，转圈结束
          this.listLoading = false
    },
    getList() {
          // 无数据，转圈开始
          this.listLoading = true
          get('list/findAll').then((res)=>{
            // console.log('getList',res);
            this.total=res.data.length
            this.list=res.data
            this.total=res.data.length
          })
          // 数据有，转圈结束
          this.listLoading = false
    },
    handleFilter() {
      this.getList()
    },
    handleModifyStatus(row, status) {
      this.$message({
        message: '操作Success',
        type: 'success'
      })
      row.status = status
    },
    sortChange(data) {
      const { prop, order } = data
      if (prop === 'id') {
        this.sortByID(order)
      }
    },
    sortByID(order) {
      if (order === 'ascending') {
        this.listQuery.sort = '+id'
      } else {
        this.listQuery.sort = '-id'
      }
      this.handleFilter()
    },
    resetTemp() {
      this.temp = {
        id: undefined,
      }
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
            post('/baseUser/saveOrUpdate',this.temp).then((res)=>{
            this.dialogFormVisible = false
            // 重新更新数据
            this.getRole();
            this.setRole();
            this.getList();
            this.$notify({
              title: 'Success',
              message: '保存成功',
              type: 'success',
              duration: 2000
            })
            })
        }
      })
    },
    handleUpdate(row) {

    },
    updateData() {

    },
    handleDelete(id) {

    },
    formatJson(filterVal) {
      return this.list.map(v => filterVal.map(j => {
        if (j === 'timestamp') {
          return parseTime(v[j])
        } else {
          return v[j]
        }
      }))
    },
    getSortClass: function(key) {
      const sort = this.listQuery.sort
      return sort === `+${key}` ? 'ascending' : 'descending'
    }
  }
}
</script>
<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
