<template>
  <div class="app-container">
      <div class="filter-container">
          <el-button class="filter-item" style="margin-left: 10px;width:70px;margin-right:10px" type="primary"  @click="handleCreate">
              添加
          </el-button>
        <el-input v-model="id" placeholder="请输入编号" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
        <el-button  class="filter-item" style="width:90px;" icon="el-icon-search" @click="handleFilter">
          搜索
        </el-button>
        <el-button  class="filter-item" style="width:90px;" icon="el-icon-refresh" @click="getTrans">
          刷新
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
        <el-table-column label="编号" prop="id" sortable="custom" align="center" width="80" :class-name="getSortClass('id')">
          <template slot-scope="{row}">
            <span>{{ row.id }}</span>
          </template>
        </el-table-column>
        <el-table-column label="订单号" width="100px" align="center">
          <template slot-scope="{row}">
            <span>{{ row.OrderID}}</span>
          </template>
        </el-table-column>
        <el-table-column label="目的地" width="270px" align="center">
          <template slot-scope="{row}">
              <span>{{ row.Destination.slice(0,15)}}</span>
            </template>
        </el-table-column>
        <el-table-column label="发送地址" width="250px" align="center">
          <template slot-scope="{row}">
            <span>{{ row.Origin.slice(0,15)}}</span>
          </template>
        </el-table-column>
        <el-table-column label="发件人"  align="center">
          <template slot-scope="{row}">
            <span>{{ row.SendName}}</span>
          </template>
        </el-table-column>
        <el-table-column label="收货地址" width="220px" align="center">
          <template slot-scope="{row}">
            <span>{{ row.ReceiverAddress.slice(0,15)}}</span>
          </template>
        </el-table-column>
        <el-table-column label="收货人"  align="center">
          <template slot-scope="{row}">
            <span>{{ row.ReceiverName}}</span>
          </template>
        </el-table-column>
        <el-table-column label="联系方式" width="150px" align="center">
          <template slot-scope="{row}">
            <span>{{ row.ReceiverPhone}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width">
          <template slot-scope="{row}">
            <el-button type="primary" size="mini" @click="handleUpdate(row,'edit')">
              修改
            </el-button>
            <el-button type="primary" size="mini" @click="handleUpdate(row,'see')">
              详情
            </el-button>
            <el-button v-if="row.status!='deleted'" size="mini" type="danger" @click="handleDelete(row.id)">
              移除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <pagination style="position:relative;top:-30px;" v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.pageSize" @pagination="getTrans" />

        <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
          <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="90px" style="width: 500px; margin-left:50px;" :disabled="formDisable">
            `id`, `name`, `phone`, `addr`, `gender`, `CompanyName`
            <el-form-item label="编号" prop="id">
              <el-input v-model="temp.id" />
            </el-form-item>
            <el-form-item label="订单号" prop="OrderID">
              <el-input v-model="temp.OrderID" />
            </el-form-item>
              <el-form-item label="目的地" prop="Destination">
              <el-input v-model="temp.Destination" />
            </el-form-item>
            <el-form-item label="发送地址" prop="Origin">
              <el-input v-model="temp.Origin" />
            </el-form-item>
            <el-form-item label="发件人" prop="SendName">
              <el-input v-model="temp.SendName" />
            </el-form-item>
            <el-form-item label="收货地址" prop="ReceiverAddress">
              <el-input v-model="temp.ReceiverAddress" />
            </el-form-item>
            <el-form-item label="收货人" prop="ReceiverName">
              <el-input v-model="temp.ReceiverName" />
            </el-form-item>
            <el-form-item label="联系方式" prop="ReceiverPhone">
              <el-input v-model="temp.ReceiverPhone" />
            </el-form-item>
          </el-form>
            {{temp}}
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
import {get,post,post_json} from '../../utils/request'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import { RegionSelects } from 'v-region'
export default {
  name: 'ComplexTable',
  components: { Pagination,RegionSelects},
  data() {
    return {
      tableKey: 0,
      list: null,//表格依赖的数据
      total: 0,//分页的总数量
      listLoading: true,
      listQuery: {
        page:1,
        pageSize:10,
      },
      dialogStatus: '',
      dialogPvVisible: false,
      id:undefined,
      tip:true,
      listId:[],
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
  // 请求数据
  created() {
    this.getTrans()
  },
  methods: {
    getTrans() {
          // 无数据，转圈开始
          this.listLoading = true
          get('trans/pageQuery',this.listQuery).then((res)=>{
            this.list=res.data.list;
            console.log(this.list);
            this.total=res.data.total;
          })
          // 数据有，转圈结束
          this.listLoading = false
          this.id=undefined
    },
    handleFilter() {
      get('trans/findOneTrans',{id:this.id}).then((res)=>{
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
      this.dialogStatus = '新增运单'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
            post('/trans/saveOrUpdate',this.temp).then((res)=>{
            this.dialogFormVisible = false
            // 重新更新数据
            this.getTrans();
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
            const tempData = Object.assign({}, this.temp)
            post('trans/saveOrUpdateTrans',this.temp).then((res)=>{
              this.dialogFormVisible = false
              // 重新更新数据
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
    handleDelete(id) {
      this.$confirm('此操作将永久删除, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
           get('trans/deleteTrans',{id:id}).then(()=>{
          this.getTrans()
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
  .filter-item{
    margin-left: 10px;
    width: 200px;
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
