<template>
    <div id="classify_con">
        <div class="con">
            <el-page-header @back="goBack" content="返回"></el-page-header>
            <h3>{{classify_info.title}}</h3>
            <span id="time">发布时间:{{getDate(classify_info.publishTime)}}</span>
            <div class="content" v-html="classify_info.content"></div>
        </div>
    </div>
</template>
<script>
import {get,post,post_json} from '../../utils/request'
import moment from 'moment'
export default {
    data:function(){
    return{
        classify_info:{},//保存单个公益信息
    }
   },
   methods:{
    goBack(){
        this.$router.go(-1);
    }
   },
   created(){
    var id=this.$route.params.id
    get('/article/findById',{id}).then((res)=>{
        this.classify_info=res.data
        // console.log(res);
    })
   },
   computed:{
    getDate(){
      return function(time){
        return moment(time).format("YYYY-MM-DD HH:mm:ss")
      }
    },
   }
}
</script>
<style>
    #classify_con{
        padding: 30px 10px;
       
        text-align:justify;
    }
    #classify_con h3{
        text-align: center;
    }
    #time{
        text-align: center;
        color: rgb(153, 153, 153);
        margin-left: 540px;
    }
</style>