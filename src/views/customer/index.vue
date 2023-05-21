/* eslint-disable */
<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button class="filter-item" style="margin-left: 10px;width:70px;margin-right:10px" type="primary"  @click="handleCreate">
        添加
    </el-button>
      <el-input v-model="id" placeholder="请输入编号" style="width: 200px;margin-right:10px" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-button class="filter-item" style="margin-left: 3px;width:90px;margin-right:10px" icon="el-icon-search" @click="handleFilter">
        搜索
      </el-button>
      <el-button  class="filter-item" style="margin-left: 3px;width:90px;margin-right:10px" icon="el-icon-refresh" @click="getCustomerList">
        刷新
         </el-button>
    </div>
    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      fit
      border
      highlight-current-row
      style="width: 100%;"
      @sort-change="sortChange"
    >
      <el-table-column label="编号" prop="id" sortable="custom" align="center" width="80" :class-name="getSortClass('id')">
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="客户" width="100px">
        <template slot-scope="{row}">
          <span >{{ row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="客户性别" width="100px">
        <template slot-scope="{row}">
          <span >{{ row.gender ? '男':'女' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="手机号" width="200px">
        <template slot-scope="{row}">
          <span >{{ row.phone }}</span>
        </template>
      </el-table-column>
      <el-table-column label="公司名" width="300px">
        <template slot-scope="{row}">
          <span >{{ row.CompanyName.slice(0,15) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="地址" min-width="300px">
        <template slot-scope="{row}">
          <span >{{ row.addr }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="{row }">
          <el-button type="primary" size="mini" @click="handleUpdate(row,'edit')">
            修改
          </el-button>
          <el-button type="primary" size="mini" @click="handleUpdate(row,'see')">
            详情
          </el-button>
          <el-button v-if="row.status!='deleted'" size="mini" type="danger" @click="handleDelete(row.id)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.pageSize" @pagination="getCustomerList" />
      <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
        <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="90px" style="width: 500px; margin-left:50px;" :disabled="formDisable">
          <el-form-item label="编号" prop="id">
            <el-input v-model="temp.id" />
          </el-form-item>
          <el-form-item label="客户" prop="name">
            <el-input v-model="temp.name" />
          </el-form-item>
		  <el-form-item label="性别" prop="gender">
          <el-radio v-model="temp.gender" label="1">男</el-radio>
          <el-radio v-model="temp.gender" label="0">女</el-radio>
        </el-form-item>
            <el-form-item label="手机号" prop="phone">
            <el-input v-model="temp.phone" />
          </el-form-item>
          <el-form-item label="公司名" prop="CompanyName">
            <el-input v-model="temp.CompanyName" />
          </el-form-item>
          <el-form-item label="地址" prop="addr">
            <el-input v-model="temp.addr" />
          </el-form-item>
        </el-form>
          
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false" >
            取消
          </el-button>
          <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()" :disabled="formDisable">
            确定
          </el-button>
        </div>
      </el-dialog>

  </div>
</template>

<script>
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import {get,post,post_json} from '../../utils/request'
// const calendarTypeOptions = [
//   { key: 'CN', display_name: 'China' },
//   { key: 'US', display_name: 'USA' },
//   { key: 'JP', display_name: 'Japan' },
//   { key: 'EU', display_name: 'Eurozone' }
// ]

// // arr to obj, such as { CN : "China", US : "USA" }
// const calendarTypeKeyValue = calendarTypeOptions.reduce((acc, cur) => {
//   acc[cur.key] = cur.display_name
//   return acc
// }, {})
export default {
  name: 'ComplexTable',
  components: { Pagination },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        pageSize: 10
      },
      dialogPvVisible: false,
      id:undefined,
      temp:{
        id:undefined,
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap:{
        update: 'Edit',
        create: 'Create'
      },
      rules: {
        username: [{ required: true, message: 'title is required', trigger: 'blur' }]
      },
      formDisable:false
    }
  },
  created() {
    this.getCustomerList()
  },
  methods: {
    getCustomerList() {
      this.listLoading = true
      get('/customer/pageQuery',this.listQuery).then((res)=>{
        this.list = res.data.list
        this.total = res.data.total
        this.listLoading = false
        this.id=undefined
      })
    },
    handleFilter() {
      get('customer/findCustomerById',{id:this.id}).then((res)=>{
        this.list=res.data;
        this.total=res.data.length;
      })
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
      this.formDisable=false;
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
          post('/customer/saveOrUpdate',this.temp).then((res)=>{
            this.dialogFormVisible = false
            this.getCustomerList()//重新更新数据
            this.$notify({
              title: 'Success',
              message: '保存成功！',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleUpdate(row,action) {
      if(action==='see'){
        this.formDisable=true;
      }else{
        this.formDisable=false;
      }
      this.temp = Object.assign({}, row) // copy obj
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          post('/customer/saveOrUpdate',this.temp).then((res)=>{
            this.dialogFormVisible = false
            this.getCustomerList()//重新更新数据
            this.$notify({
              title: 'Success',
              message: '修改成功！',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleDelete(id) {
      this.$confirm('此操作将永久删除, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
           get('customer/deleteById',{id:id}).then(()=>{
          this.getCustomerList()
        })
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
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
#setting{
  position: absolute;
  right:20px
}
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
