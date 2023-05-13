<template>
    <div>
        <el-page-header @back="goBack" content="返回"></el-page-header>

        <el-form ref="dataForm" :model="temp" label-width="80px" style="margin-top:10px" >
            <el-form-item label="标题">
              <el-input v-model="temp.title"></el-input>
            </el-form-item>
            <el-form-item label="封皮">
                <el-upload
                class="avatar-uploader"
                action="http://121.4.83.32:7001/UploadControlle/upload"
                :show-file-list="false"
                :on-success="handleAvatarSuccess"
                :before-upload="beforeAvatarUpload">
                <img v-if="temp.cover" :src="temp.cover" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload>
            </el-form-item>
            <el-form-item label="正文">
              <el-input type="textarea" v-model="temp.content"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="onSubmit()">发布</el-button>
            </el-form-item>
          </el-form>{{temp}}
    </div>

</template>

<script>
import {get,post,post_json} from '../../utils/request'
export default {
    data(){
        return{
            input: '',
            fits: ['fill', 'contain', 'cover', 'none', 'scale-down'],
            temp: {  
                cover:'',
                title:'',
                content:''
            },
            rules: {
           
        },
        }
    },
    created(){
        this.getList()
    },
    methods:{
    // 提交表单
    onSubmit(){
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
              post('/article/saveOrUpdate',this.temp).then((res)=>{
              // 重新更新数据
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
        // 重置表单
    resetTemp() {
        this.temp = {
         cover:''
        }
      },
    //   获取所有文章
      getList() {
            // 无数据，转圈开始   
            get('/article/pageQuery',{page:1,pageSize:999}).then((res)=>{
              console.log(res);
            })  
      },
    //   提交表单
        onSubmit() {
         this.$refs['dataForm'].validate((valid) => {
          if (valid) {
              post('/article/saveOrUpdate',this.temp).then((res)=>{
              // 重新更新数据
              this.getList()
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
        goBack(){
            this.$router.go(-1)
        },
        handleAvatarSuccess(res, file) {
            this.temp.cover = file.response.data
      },
      beforeAvatarUpload(file) {
        const isJPG = file.type === 'image/jpeg';
        const isLt2M = file.size / 1024 / 1024 < 3;

        if (!isJPG) {
          this.$message.error('上传头像图片只能是 JPG 格式!');
        }
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 3MB!');
        }
        return isJPG && isLt2M;
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
</style>