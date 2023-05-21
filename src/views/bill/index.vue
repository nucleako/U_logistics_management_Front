<template>
  <div v-show="billVisiable==false" class="app-container">
      <div class="filter-container">
          <el-button class="filter-item" style="margin-left: 10px;width:70px;margin-right:10px" type="primary"  @click="handleCreate">
              添加
          </el-button>
        <el-input v-model="id" placeholder="请输入编号" style="width: 200px;margin-left: 10px;" class="filter-item" @keyup.enter.native="handleFilter" />
        <el-button  class="filter-item" style="margin-left: 3px;width:90px;margin-left: 10px;" icon="el-icon-search" @click="handleFilter">
            搜索
        </el-button>
        <el-button  class="filter-item" style="margin-left: 3px;width:90px;margin-left: 10px;" icon="el-icon-refresh" @click="getRefresh">
          刷新
        </el-button>
        <exportExcel style="float: right; position: relative;top: -20px;left: -50px;"/>
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
          <template slot-scope="{row}" >
            <span>{{ row.id }}</span>
          </template>
        </el-table-column>
        <el-table-column label="订单编号" width="150px" align="center">
          <template slot-scope="{row}">
            <span>{{ row.OrderID}}</span>
          </template>
        </el-table-column>
        <el-table-column label="金额"  align="center">
          <template slot-scope="{row}">
            <span>{{ row.price}}</span>
          </template>
        </el-table-column>
        <el-table-column label="下单时间"  align="center">
          <template slot-scope="{row}">
            <span>{{ row.date}}</span>
          </template>
        </el-table-column>
        <el-table-column label="订单状态"  align="center">
          <template slot-scope="{row}">
            <el-tag :type="row.state | statusFilter">
              <span >{{ row.state===1 ? '已完结' : '未完结' }}</span>
            </el-tag>
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
            <el-button v-if="row.status!='deleted'" size="mini" type="danger" @click="handleDelete(row.id)" >
              移除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination style="position:relative;top:-30px;" v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.pageSize" @pagination="getBill" />
        <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
          <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="90px" style="width: 500px; margin-left:50px;" :disabled="formDisable">
            <el-form-item label="编号" prop="id">
              <el-input v-model="temp.id" />
            </el-form-item>
            <el-form-item label="订单编号" prop="OrderID">
              <el-input v-model="temp.OrderID" />
            </el-form-item>
            <el-form-item label="金额" prop="price">
              <el-input v-model="temp.price" />
            </el-form-item>
              <el-form-item label="下单时间" prop="date">
                <el-date-picker
                v-model="temp.date"
                type="date"
                format="yyyy 年 MM 月 dd 日"
                placeholder="选择日期">
              </el-date-picker>
              </el-form-item>
            <el-form-item label="订单状态" prop="state">
                <el-radio v-model="temp.state" label="1">已完结</el-radio>
                <el-radio v-model="temp.state" label="0">未完结</el-radio>
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
import {get,post,post_json} from '../../utils/request'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import permission from '@/store/modules/permission'
import { RegionSelects } from 'v-region'
import { mapGetters } from 'vuex'
import exportExcel from '../excel/export-excel.vue'
import moment from 'moment'
// v-permission=['admin']
// import permission from '@/directive/permission/index.js'
export default {
  name: 'ComplexTable',
  components: { Pagination,RegionSelects,exportExcel},
  // directives: { permission },
  filters: {
      statusFilter(stauts) {
        const statusMap = {
          "1": 'success',
          "0": 'danger'
        }
        return statusMap[stauts]
      },
    },
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
      // roles:'',
      billVisiable:false,
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
  // computed: {
  //   ...mapGetters([
  //     'roles'
  //   ])
  // },
  computed:{
    getDate(){
      return function(time){
        const dt = new Date(time)
        // Date.parse() 返回1970年1月1日午夜到指定日期（字符串）的毫秒数
        // 将获得的毫秒数加8个小时的毫秒数
        const ts = Date.parse(dt) + 8 * 3600 *1000
        // 将处理的毫秒数转为ios格式字符串，并进行格式化处理
        const d = new Date(ts).toISOString().replace(/T/g, ' ').slice(0, 19)
        //输出类似 2019-08-02 18:58:56
        return d;
      }
    },
   },
  // 请求数据
  created() {
    this.getBill()
  },
  methods: {
    getBill() {
          // 无数据，转圈开始
          this.listLoading = true
          get('bill/pageQuery',this.listQuery).then((res)=>{
            this.list=res.data.list.map(v=>{
              return{
                ...v,
                date:this.getDate(v.date)}
            })
            this.total=res.data.total
            console.log('billllllllll',res);
          })
          // 数据有，转圈结束
          this.listLoading = false
          // console.log('1111111',this.roles);
    },
    getRefresh(){
      this.getBill();
      this.id=undefined
    },
    handleFilter() {
      get('bill/findBillById',{id:this.id}).then((res)=>{
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
      this.temp.date = moment(this.temp.date).format('YYYY-MM-DD HH:mm:ss')
      this.temp.state=parseInt(this.temp.state),
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
            post('bill/saveOrUpdate',this.temp).then((res)=>{
            this.dialogFormVisible = false
            // 重新更新数据
            this.getBill();
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
        this.temp.state=this.temp.state.toString(2)
        this.dialogStatus = 'update'
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
    },
    updateData() {
    this.temp.date = moment(this.temp.date).format('YYYY-MM-DD HH:mm:ss')
      this.temp.state=parseInt(this.temp.state)
      this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            const tempData = Object.assign({}, this.temp)
            post('bill/saveOrUpdate',this.temp).then((res)=>{
              this.dialogFormVisible = false
              // 重新更新数据
              this.getBill();
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
           get('bill/deleteById',{id:id}).then(()=>{
          this.getBill()
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
