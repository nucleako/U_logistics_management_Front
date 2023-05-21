<template>
  <div class="app-container">
      <div class="filter-container">
          <el-button class="filter-item" style="margin-left: 10px;width:70px;margin-right:10px" type="primary"  @click="handleCreate">
              添加
          </el-button>
        <el-input v-model="id" placeholder="请输入编号"  style="width: 200px;margin-right:10px" class="filter-item" @keyup.enter.native="handleFilter" />
        <el-button  class="filter-item" style="margin-left: 3px;width:90px; margin-right:10px" icon="el-icon-search" @click="handleFilter">
        	搜索
        </el-button>
        <el-button  class="filter-item" style="margin-left: 3px;width:90px; margin-right:10px" icon="el-icon-refresh"
			@click="getRefresh">
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
        <el-table-column label="序号" prop="Id" sortable="custom" align="center" width="80" :class-name="getSortClass('Id')">
          <template slot-scope="{row}">
            <span>{{ row.Id }}</span>
          </template>
        </el-table-column>
        <el-table-column label="发货人"  align="center">
          <template slot-scope="{row}">
            <span>{{ row.SdCustomerName}}</span>
          </template>
        </el-table-column>
        <el-table-column label="发货公司" width="250px" align="center">
          <template slot-scope="{row}">
            <span>{{ row.SdCustomerCompanyName.slice(0,15)}}</span>
          </template>
        </el-table-column>
        <el-table-column label="收货人"  align="center">
          <template slot-scope="{row}">
            <span>{{ row.RcvCustomerName}}</span>
          </template>
        </el-table-column>
        <el-table-column label="收货公司" width="250px" align="center">
          <template slot-scope="{row}">
            <span>{{ row.RcvCustomerCompanyName.slice(0,15)}}</span>
          </template>
        </el-table-column>
        <el-table-column label="下单日期" width="150px" align="center">
          <template slot-scope="{row}">
              <span>{{ row.OrderDate}}</span>
            </template>
        </el-table-column>
        <el-table-column label="订单金额" width="150px" align="center">
          <template slot-scope="{row}">
            <span>{{ row.OrderPrice}}</span>
          </template>
        </el-table-column>
        <el-table-column label="订单状态" width="100px" align="center">
          <template slot-scope="{row}">
            <el-tag :type="row.OrderStatus | statusFilter">
              <span>{{ row.OrderStatus===1 ? '已完结' : '未完结' }}</span>
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width">
          <template slot-scope="{row}">
            <el-button type="primary" size="mini" @click="handleUpdate(row,'edit')">
              修改
            </el-button>
            <el-button type="primary" size="mini" @click="handleUpdate(row,'see');" >
              详情
            </el-button>
            <el-button v-if="row.status!='deleted'" size="mini" type="danger" @click="handleDelete(row.Id)" >
              移除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination style="position:relative;top:-30px;" v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.pageSize" @pagination="getList" />
        <!-- 新增或删除弹出的模态框 -->
        <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
          <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="100px" style="width: 500px; margin-left:50px;" :disabled="formDisable">

			<el-form-item label="订单编号" prop="Id" required>
              <el-input v-model="temp.Id" />
            </el-form-item>
			<el-form-item label="订单金额" prop="OrderPrice">
              <el-input v-model="temp.OrderPrice" />
            </el-form-item>

			<el-form-item label="下单日期" prop="OrderDate">
                <el-date-picker
                v-model="temp.OrderDate"
                type="date"
                format="yyyy 年 MM 月 dd 日"
                placeholder="选择日期">
              </el-date-picker>
            </el-form-item>

			<el-form-item label="发货人编号" prop="SdCustomerID" required>
              <el-input v-model="temp.SdCustomerID" />
            </el-form-item>
			<el-form-item label="发货人" prop="SdCustomerName" required>
              <el-input v-model="temp.SdCustomerName" />
            </el-form-item>
			<el-form-item label="发货人电话" prop="SdCustomerName">
              <el-input v-model="temp.SdCustomerName" />
            </el-form-item>
			<el-form-item label="发件人性别" prop="SdCustomerGender">
              <el-input v-model="temp.SdCustomerGender" />
            </el-form-item>
            <el-form-item label="发货公司" prop="SdCustomerCompanyName">
              <el-input v-model="temp.SdCustomerCompanyName" />
            </el-form-item>
			<el-form-item label="发货地址" prop="SdCustomerAddress" required>
              <el-input v-model="temp.SdCustomerAddress" />
            </el-form-item>

			<el-form-item label="收件人编号" prop="RcvCustomerID" required>
              <el-input v-model="temp.RcvCustomerID" />
            </el-form-item>
            <el-form-item label="收货人" prop="RcvCustomerName" required>
              <el-input v-model="temp.RcvCustomerName" />
            </el-form-item>
			<el-form-item label="收货人电话" prop="RcvCustomerPhone">
              <el-input v-model="temp.RcvCustomerPhone" />
            </el-form-item>
			<el-form-item label="收件人性别" prop="RcvCustomerGender">
              <el-input v-model="temp.RcvCustomerGender" />
            </el-form-item>
            <el-form-item label="收货公司" prop="RcvCustomerCompanyName" >
              <el-input v-model="temp.RcvCustomerCompanyName" />
            </el-form-item>
			<el-form-item label="收件地址" prop="RcvCustomerAddress" required>
              <el-input v-model="temp.RcvCustomerAddress" />
            </el-form-item>
            <el-form-item label="订单状态" prop="OrderStatus">
                <el-radio v-model="temp.OrderStatus" label="1">已完结</el-radio>
                <el-radio v-model="temp.OrderStatus" label="0">未完结</el-radio>
              </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false" >
              取消
            </el-button>
            <el-button type="primary"  @click="dialogStatus==='create'?createData():updateData()" :disabled="formDisable">
              确定
            </el-button>
          </div>
        </el-dialog>
    </div>
</template>
<script>
import {get,post} from '../../utils/request'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import { RegionSelects } from 'v-region'
import moment from 'moment'
export default {
  components: { Pagination,RegionSelects},
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
      total: 0,//分页的总数
      listLoading: true,
      listQuery: {
        page:1,
        pageSize:10,
      },
      id:undefined,
      tip:true,
      listId:[],
      temp:{
        Id:undefined,
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
  mounted() {
    this.getList()
  },
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
  methods: {
    getList() {
          // 无数据，转圈开始
          this.listLoading = true
          get('list/pageQuery',this.listQuery).then((res)=>{
            this.list=res.data.list.map(v=>{
              return{
                ...v,
                OrderDate:this.getDate(v.OrderDate)}
            })
            console.log('list',this.list);
            this.total=res.data.total;
          })
          // 数据有，转圈结束
          this.listLoading = false
    },
    getRefresh(){
      this.getList();
      this.id=undefined
    },
    handleFilter() {
		try {
			get('list/findListById',{id:this.id}).then((res)=>{
			// this.tip=this.listId.includes(parseInt(this.id));
			this.list=res.data;
			this.total=res.data.length;
			// console.log('list',res);
			// if(this.tip===false){
			//   this.getList();
			//   this.$notify.error({
			//   title: '错误',
			//   message: '请输入正确的编号',
			//   position:'top-left',
			//   duration:2000,
			// });
			// this.id=undefined
			// }
		})
		} catch (error) {
			console.log(error);
			console.log('未查询到相关信息！');
		}

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
      if (prop === 'Id') {
        this.sortByID(order)
      }
    },
    sortByID(order) {
      if (order === 'ascending') {
        this.listQuery.sort = '+Id'
      } else {
        this.listQuery.sort = '-Id'
      }
      this.handleFilter()
    },
    resetTemp() {
      this.temp = {
        Id: undefined,
      }
    },
    handleCreate() {
      this.formDisable=false;
      this.resetTemp()
      this.dialogStatus = '新增订单'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
		this.temp.OrderPrice=parseInt(this.temp.OrderPrice),
		this.temp.OrderStatus=parseInt(this.temp.OrderStatus),
    this.temp.OrderDate = moment(this.temp.OrderDate).format('YYYY-MM-DD HH:mm:ss')
        this.$refs['dataForm'].validate((valid) => {
        if (valid) {
            post('list/saveOrUpdateList',this.temp).then((res)=>{
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
    handleUpdate(row,action) {
      if(action==='see'){
        this.formDisable=true;
      }else{
        this.formDisable=false;
      }
        this.temp = Object.assign({}, row) // copy obj
        this.temp.OrderStatus=this.temp.OrderStatus.toString(2)
        this.dialogStatus = 'update'
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
    },
    updateData() {
      this.temp.OrderDate = moment(this.temp.OrderDate).format('YYYY-MM-DD HH:mm:ss')
      this.temp.OrderPrice=parseInt(this.temp.OrderPrice),
      this.temp.OrderStatus=parseInt(this.temp.OrderStatus),
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            const tempData = Object.assign({}, this.temp)
            post('list/saveOrUpdateList',this.temp).then((res)=>{
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
           get('list/deleteList',{id:id}).then(()=>{
          this.getList()
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
  },

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
