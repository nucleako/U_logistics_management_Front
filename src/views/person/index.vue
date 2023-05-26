<template>
  <div>
    <el-page-header content="" @back="goBack" />
    <!-- 头像显示与修改头像 -->
    <div class="img">
      <el-form label-width="80px">
        <el-form-item>
          <el-image
            style="width: 150px; height: 150px;border-radius:50%;box-shadow:2px 5px 8px;margin-left:40%;margin-top:40px"
            :src="$store.state.user.user_data.avatar"
            fit="cover"
          />
        </el-form-item>
      </el-form>

      <!-- <el-button type="text" @click="centerDialogVisible = true" style="margin-left:47.2%">修改头像</el-button> -->
      <el-dialog
        title="请修改头像"
        :visible.sync="centerDialogVisible"
        width="30%"
        center
      >
        <el-form ref="dataForm" :model="temp" label-width="80px" style="margin-top:10px">
          <el-form-item label="封皮">
            <el-upload
              class="avatar-uploader"
              action="http://121.4.83.32:7001/UploadControlle/upload"
              :show-file-list="false"
              :on-success="handleAvatarSuccess"
              :before-upload="beforeAvatarUpload"
            >
              <img v-if="temp.userface" :src="temp.userface" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon" />
            </el-upload>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="centerDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="onsubmitimg()">确 定</el-button>
        </span>
      </el-dialog>
    </div>

    <!-- 用户信息 -->
    <div class="userinfo">
      <table>
        <tr>
          <td width="100px" class="fontw">用户名</td>
          <td width="300px">{{ $store.state.user.user_data.username }}</td>
          <td width="100px" class="fontw">密码</td>
          <td width="300px">{{ $store.state.user.user_data.password }}</td>
        </tr>
        <tr>
          <td width="100px" class="fontw">性别</td>
          <td width="300px">{{ setsex($store.state.user.user_data.gender) }}</td>
          <td width="100px" class="fontw">角色</td>
          <td width="300px">{{ setrole($store.state.user.user_data.roles) }}</td>
        </tr>
        <tr>
          <td width="100px" class="fontw">真实姓名</td>
          <td width="300px">{{ $store.state.user.user_data.realname }}</td>
          <td width="100px" class="fontw">手机号</td>
          <td width="300px">{{ $store.state.user.user_data.telephone }}</td>
        </tr>
        <tr>
          <td width="100px" class="fontw">简介</td>
          <td width="300px">{{ $store.state.user.user_data.introduction }}</td>
        </tr>
      </table>
      <el-button type="text" style="margin-left:28%" @click="centerDialogVisible1= true">修改个人信息</el-button>
      <el-dialog
        title="请修改个人信息"
        :visible.sync="centerDialogVisible1"
        width="30%"
        center
      >
        <el-form ref="dataForm" :model="form" label-width="80px" style="margin-top:10px">
          <el-form-item label="用户名" prop="name">
            <el-input v-model="form.username" />
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input v-model="form.password" />
          </el-form-item>
          <el-form-item label="性别" prop="gender">
            <el-radio v-model="form.gender" label="1">男</el-radio>
            <el-radio v-model="form.gender" label="0">女</el-radio>
          </el-form-item>
          <el-form-item label="角色" prop="roles">
            <el-radio v-model="form.roles[0]" label="admin">管理员</el-radio>
            <el-radio v-model="form.roles[0]" label="viewer">普通用户</el-radio>
          </el-form-item>
          <el-form-item label="真实姓名" prop="realname">
            <el-input v-model="form.realname" />
          </el-form-item>
          <el-form-item label="手机号" prop="telephone">
            <el-input v-model="form.telephone" />
          </el-form-item>
          <el-form-item label="简介" prop="introduction">
            <el-input v-model="form.introduction" />
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="centerDialogVisible1 = false">取 消</el-button>
          <el-button type="primary" @click="onsubmitinfo()">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import { post, get } from '../../utils/request'
import { formatDate } from '../../utils/formatDate.js'
export default {
	// 过滤器，过滤时间
	filters: {
		// 方法一: yyyy-MM-dd hh:mm
		formatDate(time) {
			time = time
			const date = new Date(time)
			return formatDate(date, 'yyyy-MM-dd hh:mm')
		}
	},
	data() {
		return {
			centerDialogVisible: false,
			centerDialogVisible1: false,
			// 头像表单
			temp: {
				userface: '',
				id: this.$store.state.user.user_data.id
			},
			// 必须写所有属性，否则提交完之后，有些属性会成为null
			form: {
				username: this.$store.state.user.user_data.username,
				realname: this.$store.state.user.user_data.realname,
				password: this.$store.state.user.user_data.password,
				gender: this.$store.state.user.user_data.gender.toString(2),
				telephone: this.$store.state.user.user_data.telephone,
				introduction: this.$store.state.user.user_data.introduction,
				id: this.$store.state.user.user_data.id,
				password: this.$store.state.user.user_data.password,
				roles: this.$store.state.user.user_data.roles
			}
		}
	},
	created() {
		this.getuser()
	},
	methods: {
		// 设置性别
		setsex(sex) {
			if (sex == '1') { return '男' } else { return '女' }
		},
		setrole(role) {
			if (role == 'admin') { return '管理员' } else { return '普通用户' }
		},
		getuser() {
			get('/user/findAll', this.user).then((res) => {
				console.log(res)
			})
		},
		//  提交用户信息表单
		onsubmitinfo() {
			this.$refs['dataForm'].validate((valid) => {
				if (valid) {
					post('/user/saveOrUpdate', this.form).then((res) => {
						this.getuser()
						this.$notify({
							title: 'Success',
							message: '保存成功',
							type: 'success',
							duration: 3000
						})
					})
				}
			})
			this.$router.go(0)
			this.centerDialogVisible1 = false
		},
		//  提交头像表单
		onsubmitimg() {
			this.$refs['dataForm'].validate((valid) => {
				if (valid) {
					post('/user/alterUserface', this.temp).then((res) => {
						// 重新更新数据
						this.getuser()
						this.$notify({
							title: 'Success',
							message: '保存成功',
							type: 'success',
							duration: 3000
						})
					})
				}
			})
			// 更新仓库
			// this.$store.commit('user/SET_AVATAR',this.temp.userface)
			// 刷新页面
			this.$router.go(0)
			// location.reload()
			this.centerDialogVisible = false
		},
		// 返回
		goBack() {
			this.$router.go(-1)
		},
		// 处理头像
		handleAvatarSuccess(res, file) {
			this.temp.userface = file.response.data
		},
		beforeAvatarUpload(file) {
			const isJPG = file.type === 'image/jpeg'
			const isLt2M = file.size / 1024 / 1024 < 3

			if (!isJPG) {
				this.$message.error('上传头像图片只能是 JPG 格式!')
			}
			if (!isLt2M) {
				this.$message.error('上传头像图片大小不能超过 3MB!')
			}
			return isJPG && isLt2M
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
  margin-left: 80px;
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
.c{
  clear: both;
}
.userinfo{
  margin-left: 25%;
}

.fontw{
font-weight: bold;
}
table{
position: relative;
left:20px
}
table tr{
height: 70px;
}
</style>
