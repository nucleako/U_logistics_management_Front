<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button class="filter-item" style="margin-left: 10px;width:70px;margin-right:10px" type="primary" @click="handleCreate">
        添加
      </el-button>
      <el-input v-model="id" placeholder="请输入编号" style="width: 200px;margin-left: 10px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-button class="filter-item" style="margin-left: 3px;width:90px;margin-left: 10px;" icon="el-icon-search" @click="handleFilter">
        搜索
      </el-button>
      <el-button class="filter-item" style="margin-left: 3px;width:90px;margin-left: 10px;" icon="el-icon-refresh" @click="getRefresh">
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
      <el-table-column label="用户名" align="center">
        <template slot-scope="{row}">
          <span>{{ row.username }}</span>
        </template>
      </el-table-column>
      <el-table-column label="性别" align="center">
        <template slot-scope="{row}">
          <span v-if="row.gender=='1'">男</span>
          <span v-if="row.gender=='0'">女</span>
        </template>
      </el-table-column>
      <el-table-column label="手机号" align="center">
        <template slot-scope="{row}">
          <span>{{ row.telephone }}</span>
        </template>
      </el-table-column>
      <el-table-column label="真实姓名" align="center">
        <template slot-scope="{row}">
          <span>{{ row.realname }}</span>
        </template>
      </el-table-column>
      <el-table-column label="角色" align="center">
        <template slot-scope="{row}">
          <el-tag :type="row.roles | statusFilter">
            <span>{{ row.roles == 'admin'?'管理员':'普通用户' }}</span>
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="400" class-name="small-padding fixed-width">
        <template slot-scope="{ row }">
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

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.pageSize" @pagination="getList" />
    <!-- <el-dialog title="角色配置" :visible.sync="dialogRolesVisible">
      <el-form ref="dataForm"  :model="Roles" label-position="left" label-width="70px" style="width: 400px; margin-left:50px;">
        <el-checkbox-group v-model="Roles.roles">
          <el-checkbox v-for="i in Roles_list" :key="i.id" :label="i.id">{{i.name}}</el-checkbox>
        </el-checkbox-group>
        {{Roles}}
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogRolesVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="ConfirmRoles">
          确定
        </el-button>
      </div>
    </el-dialog> -->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="70px" style="width: 400px; margin-left:50px;" :disabled="formDisable">
        <el-form-item label="编号" prop="id">
          <el-input v-model="temp.id" />
        </el-form-item>
        <el-form-item label="真实姓名" prop="realname">
          <el-input v-model="temp.realname" />
        </el-form-item>
        <el-form-item label="性别" prop="gender">
          <el-radio v-model="temp.gender" label="1">男</el-radio>
          <el-radio v-model="temp.gender" label="0">女</el-radio>
        </el-form-item>
        <el-form-item label="手机号" prop="telephone">
          <el-input v-model="temp.telephone" />
        </el-form-item>
        <el-form-item label="用户名" prop="username">
          <el-input v-model="temp.username" />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="temp.password" />
        </el-form-item>
        <el-form-item label="角色" prop="roles">
          <el-radio v-model="temp.roles" label="admin">管理员</el-radio>
          <el-radio v-model="temp.roles" label="viewer">普通用户</el-radio>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          Cancel
        </el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
          Confirm
        </el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import { get, post } from '../../utils/request'

export default {
	name: 'ComplexTable',
	components: { Pagination },
	directives: { waves },
	filters: {
		statusFilter(status) {
			const statusMap = {
				'admin': 'success',
				'viewer': 'info'
			}
			return statusMap[status]
		}

	},
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
			id: undefined,
			temp: {
				id: undefined,
				username: ''
			},
			dialogFormVisible: false,
			dialogStatus: '',
			textMap: {
				update: 'Edit',
				create: 'Create'
			},
			rules: {
				username: [{ required: true, message: 'title is required', trigger: 'blur' }]
			},
			formDisable: false
		}
	},
	created() {
		this.getList()
	},
	methods: {
		getList() {
			this.listLoading = true
			get('/user/pageQuery', this.listQuery).then((res) => {
				console.log(res)
				this.list = res.data.list
				this.total = res.data.total
				this.listLoading = false
			})
		},
		getRefresh() {
			this.getList()
			this.id = undefined
		},
		handleFilter() {
			get('user/findUserById', { id: this.id }).then((res) => {
				var list1 = [res.data]
				this.list = list1
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
				username: ''
			}
		},
		// handleRoles(id,roles){
		//   var arr = []//用户当前的角色
		//   roles.forEach((i)=>{//数据处理
		//     arr.push(i.id)
		//   })
		//   this.Roles.roles = arr
		//   this.Roles.id = id
		//   this.dialogRolesVisible = true//打开模态框
		// },
		handleCreate() {
			this.formDisable = false
			this.resetTemp()
			this.dialogStatus = 'create'
			this.dialogFormVisible = true
			this.$nextTick(() => {
				this.$refs['dataForm'].clearValidate()
			})
		},
		// ConfirmRoles(){
		//   post('/user/setRoles',this.Roles).then((res)=>{
		//     this.getList()
		//     this.dialogRolesVisible = false
		//     this.$notify({
		//           title: 'Success',
		//           message: '配置成功！',
		//           type: 'success',
		//           duration: 2000
		//         })
		//   })
		// },
		createData() {
			this.$refs['dataForm'].validate((valid) => {
				if (valid) {
					post('/user/saveOrUpdate', this.temp).then((res) => {
						this.dialogFormVisible = false
						this.getList()// 重新更新数据
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
		handleUpdate(row, action) {
			if (action === 'see') {
				this.formDisable = true
			} else {
				this.formDisable = false
			}
			this.temp = Object.assign({}, row) // copy obj
			this.temp.gender = this.temp.gender.toString(2)
			this.dialogStatus = 'update'
			this.dialogFormVisible = true
			this.$nextTick(() => {
				this.$refs['dataForm'].clearValidate()
			})
		},
		updateData() {
			this.$refs['dataForm'].validate((valid) => {
				if (valid) {
					post('/user/saveOrUpdate', this.temp).then((res) => {
						this.dialogFormVisible = false
						this.getList()// 重新更新数据
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
				get('user/deleteById', { id: id }).then(() => {
					this.getList()
				})
				this.$message({
					type: 'success',
					message: '删除成功!'
				})
			}).catch(() => {
				this.$message({
					type: 'info',
					message: '已取消删除'
				})
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
