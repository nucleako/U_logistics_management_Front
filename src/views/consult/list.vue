<template>
    <div class="app-container">
      <div class="filter-container">
        <el-button type="primary" style="position:relative;top:-4px" @click="send()">发布</el-button>
        <el-input v-model="listQuery.title" placeholder="名称" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
        <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
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
      <el-table-column label="封面" width="200px" align="center">
        <template slot-scope="{row}">
          <el-image
          style="width: 50px; height: 50px"
          :src="row.cover"
          fit="cover"></el-image>
        </template>
      </el-table-column>
        <el-table-column label="风采" prop="title" sortable="custom" align="center" min-width="80">
          <template slot-scope="{row}">
            <span @click="getcontent(row.id)">{{ row.title}}</span>
          </template>
        </el-table-column>

        <el-table-column label="状态" class-name="status-col" width="80">
            <template slot-scope="{row}">
              <el-tag :type="row.status | statusFilter">
                {{ row.status }}
              </el-tag>
            </template>
          </el-table-column>

        <el-table-column label="阅读次数"  align="center">
          <template slot-scope="{row}">
            <span>{{ row.readTimes}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width">
          <template slot-scope="{row,$index}">
            <el-button v-if="row.status!='deleted'" size="mini" type="danger" @click="handleDelete(row.id)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.pageSize" @pagination="getList" />
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
          "审核通过": 'success',
          "未审核": 'danger'
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
          title: undefined,
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
      // send()发布
      send(){
        this.$router.push('/send/')
      },
      // 通过id来跳转具体的文章
      getcontent(id){
        this.$router.push('/content/'+id)
      },
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
            get('/article/pageQuery',this.listQuery).then((res)=>{
              console.log(res);
              this.list=res.data.list
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
              post('/product/saveOrUpdate',this.temp).then((res)=>{
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
            post('/product/saveOrUpdate',this.temp).then((res)=>{
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
        get('/article/deleteById',{id}).then(()=>{
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
