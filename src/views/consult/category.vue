<template>
    <div class="app-container">
      <div class="filter-container">
        <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
          增加
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
        <el-table-column label="ID" prop="id" sortable="custom" align="center" width="80" :class-name="getSortClass('id')">
          <template slot-scope="{row}">
            <span>{{ row.id}}</span>
          </template>
        </el-table-column>
        <el-table-column label="名称" width="150px" align="center">
          <template slot-scope="{row}">
            <span>{{ row.name}}</span>
          </template>
        </el-table-column>
        <el-table-column label="父栏目" width="150px" align="center">
            <template slot-scope="{row}">
              <span v-if="row.parentId==null">无</span>
              {{row.parentId}}
            </template>
          </el-table-column>
        <el-table-column label="描述"  align="center">
          <template slot-scope="{row}">
            <span v-if="row.description==null || row.description==''">无</span>
            {{row.description}}
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width">
          <template slot-scope="{row,$index}">
            <el-button type="primary" size="mini" @click="handleUpdate(row)">
              修改
            </el-button>
            <el-button v-if="row.status!='deleted'" size="mini" type="danger" @click="handleDelete(row.id)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.pageSize" @pagination="getList" />
      <!-- 新增或删除弹出的模态框 -->
      <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
        <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="90px" style="width: 400px; margin-left:50px;">
          <el-form-item label="名称" prop="name">
            <el-input v-model="temp.name" />
          </el-form-item>
          <el-form-item label="父栏目" prop="parentId">
            <el-input v-model="temp.parentId" />
          </el-form-item>
          <el-form-item label="描述" prop="description">
            <el-input v-model="temp.description" />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">
            取消
          </el-button>
          <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
            确定
          </el-button>
        </div>
      </el-dialog>

      <el-dialog :visible.sync="dialogPvVisible" title="Reading statistics">
        <el-table :data="pvData" border fit highlight-current-row style="width: 100%">
          <el-table-column prop="key" label="Channel" />
          <el-table-column prop="pv" label="Pv" />
        </el-table>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="dialogPvVisible = false">Confirm</el-button>
        </span>
      </el-dialog>
    </div>
  </template>

  <script>
  import { fetchList, fetchPv, createArticle, updateArticle } from '@/api/article'
  import waves from '@/directive/waves' // waves directive
  import { parseTime } from '@/utils'
  import Pagination from '@/components/Pagination' // secondary package based on el-pagination
  import {get,post,post_json} from '../../utils/request'

  export default {
    name: 'ComplexTable',
    components: { Pagination },
    directives: { waves },
    filters: {
      statusFilter(status) {
        const statusMap = {
          "正常": 'success',
          "下架": 'danger'
        }
        return statusMap[status]
      },
    },
    data() {
      return {
        imageUrl: '',//图片上传组件依赖的图片名称
        tableKey: 0,
        list: null,//表格依赖的数据
        total: 0,//分页的总数量
        listLoading: true,
        // 用于该模块请求数据时的参数,分页功能也是依赖这个数据
        listQuery: {
          page: 1,
          pageSize: 9999,
        },
        importanceOptions: [1, 2, 3],
        calendarTypeOptions:[],
        sortOptions: [{ label: 'ID Ascending', key: '+id' }, { label: 'ID Descending', key: '-id' }],
        statusOptions: ['published', 'draft', 'deleted'],
        showReviewer: false,
        temp: {
          id: undefined,
          photo:''
        },
        dialogFormVisible: false,
        dialogStatus: '',
        textMap: {
          update: 'Edit',
          create: 'Create'
        },
        dialogPvVisible: false,
        pvData: [],
        // 对于模态框数据的验证对象
        rules: {
          name: [{ required: true, message: 'name is required', trigger: 'blur' }],
          price: [{ required: true, message: 'price is required', trigger: 'blur' }]
        },
        downloadLoading: false

      }
    },
    // 请求数据
    created() {
      this.getList()
    },
    methods: {
      handleAvatarSuccess(res, file) {
        // console.log(URL.createObjectURL(file.raw));
        this.temp.photo = file.response.data
      },
      beforeAvatarUpload(file) {
        const isJPG = file.type === 'image/jpeg';
        const isLt2M = file.size / 1024 / 1024 < 2;

        if (!isJPG) {
          this.$message.error('上传头像图片只能是 JPG 格式!');
        }
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 2MB!');
        }
        return isJPG && isLt2M;
      },
      // 请求商品数据的方法
      getList() {
            // 无数据，转圈开始
            this.listLoading = true
            get('/category/findAll',this.listQuery).then((res)=>{
              console.log(res);
              this.list=res.data
            })
            // 数据有，转圈结束
            this.listLoading = false
      },
      handleFilter() {
        this.listQuery.page = 1
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
         photo:''
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
              post('/category/saveOrUpdate',this.temp).then((res)=>{
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
      handleUpdate(row) {
        this.temp = Object.assign({}, row) // copy obj
        // this.temp.timestamp = new Date(this.temp.timestamp)
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
            post('/category/saveOrUpdate',this.temp).then((res)=>{
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
        get('/category/deleteById',{id}).then(()=>{
          this.getList()
          this.$notify({
          title: 'Success',
          message: '删除成功',
          type: 'success',
          duration: 2000
        })
        })
      },
      handleFetchPv(pv) {
        fetchPv(pv).then(response => {
          this.pvData = response.data.pvData
          this.dialogPvVisible = true
        })
      },
      handleDownload() {
        this.downloadLoading = true
        import('@/vendor/Export2Excel').then(excel => {
          const tHeader = ['timestamp', 'title', 'type', 'importance', 'status']
          const filterVal = ['timestamp', 'title', 'type', 'importance', 'status']
          const data = this.formatJson(filterVal)
          excel.export_json_to_excel({
            header: tHeader,
            data,
            filename: 'table-list'
          })
          this.downloadLoading = false
        })
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
