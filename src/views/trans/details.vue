  <template>
    <div class="app-container">
      <div class="filter-container">
        <el-input v-model="searchForm.id" placeholder="运单编号" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
        <el-input v-model="searchForm.OrderID" placeholder="订单编号" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
        <el-input v-model="searchForm.CarrierId" placeholder="承运商编号" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        搜索
      </el-button>
      <el-button  class="filter-item" style="margin-left: 3px;width:90px; margin-right:10px" icon="el-icon-refresh"
			@click="getRefresh">
        	刷新
        </el-button>
      {{searchForm }}
      <div class="finishitem" v-for="item in list" :key="item.id">
    	<div class="top_item">
			<!-- <span>下单时间：{{item.OrderDate}}</span> -->
			<span style="margin-left: 150px;">运单编号：{{item.id}}</span>
			<span style="margin-left:200px ;">运单总额：{{item.money}}</span>
      <span style="margin-left: 200px;">订单编号：{{item.OrderID}}</span>
			<span style="margin-left:200px ;">承运商编号：{{item.CarrierId }}</span>
			<span style="margin-right:150px ;float: right;">
				运单状态：
        <el-tag :type="item.arrive | statusFilter">
          {{item.arrive?'已完结':'未完结'}}
        </el-tag>
			</span>
       </div>
      <div class="bottom_item" >
          <div style="margin-left:100px;float: left;width:500px">
            <h4>货物类型:{{item.goodstype}}</h4>
            <h4>发件联系人:{{item.SendName}}</h4>
            <h4>联系人电话:{{item.SendPhone}}</h4>
            <h4 style="max-width: 1000px;">发件地址:{{item.Origin}}</h4>
          </div>
		  <div style="margin-right:100px;float: right;width:500px">
			<h4>收件联系人:{{item.ReceiverName}}</h4>
			<h4>联系人电话:{{item.ReceiverPhone}}</h4>
			<h4 style="max-width: 1000px;">收件地址:{{item.ReceiverAddress }}</h4>
          </div>
        <div class="c"></div>
      </div>
    </div>
 </div>
      <!-- <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.pageSize" @pagination="getTrans" /> -->
</div>
  </template>

  <script>
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
          "null": 'danger'
        }
        return statusMap[status]
      },
      typeFilter(type) {
        return calendarTypeKeyValue[type]
      }
    },
    data() {
      return {
        tableKey: 0,
        list: null,//表格依赖的数据
        total: 0,//分页的总数量
        listLoading: true,
        // 用于该模块请求数据时的参数,分页功能也是依赖这个数据
        listQuery: {
          page: 1,
          pageSize: 9,
        },
        searchForm:{
          id:undefined,
          OrderID:undefined,
          CarrierId:undefined
        },
        url: 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg'
      }
    },
    // 请求数据
    created() {
      // this.getTrans()
      this.getTransPageQuery()
    },
    methods: {
      // 请求商品数据的方法
      // getTrans() {
      //       // 无数据，转圈开始
      //       this.listLoading = true
      //       get('/trans/pageQuery',this.listQuery).then((res)=>{
      //         // console.log('trans',res);
      //         this.list=res.data.list
      //       })
      //       // 数据有，转圈结束
      //       this.listLoading = false
      // },
      getTransPageQuery() {
          // 无数据，转圈开始
          this.listLoading = true
          get('/trans/pageQuery',this.listQuery).then((res)=>{
            console.log('getTransPageQuery',res);
            this.list=res.data.list
            this.total=res.data.list.length
          })
          // 数据有，转圈结束
          this.listLoading = false
    },
    getRefresh(){
      this.getTransPageQuery();
      this.searchForm.CarrierId=undefined;
      this.searchForm.OrderID=undefined;
      this.searchForm.id=undefined
    },
    //   实现检索，每次Input根据属性添加值的时候，且多了一个参数，获取数据的方法会重新调用一次，
    handleFilter() {
      try {
        get('trans/findOneTrans',{
          id:this.searchForm.id,
          CarrierId:this.searchForm.CarrierId,
          OrderID:this.searchForm.OrderID
        }).then((res)=>{
        this.list=res.data;
		})
		} catch (error) {
			console.log(error);
			console.log('未查询到相关信息！');
		}

    },
    reload(){
      this.isRouterAlive=false;
      this.$nextTick(()=>{
        this.isRouterAlive=true
    })
    }

    }
  }
  </script>
<style>
  .filter-container{
    font-size: 13px;
  }
  .top_item{
    background-color: rgba(232, 232, 232,0.5);
    margin-top: 5px;
    height: 40px;
    line-height: 40px;
  }
  .bottom_item{
    /* width: 1167px; */
    /* background-color: aquamarine; */
  }
  .bottom_item .left_item{
    float: left;
  }
  .bottom_item .center_item{
    float: left;
    margin-left: 10px;
    display: block;
    width: 100%;
  }
  .bottom_item .right_item{
    float: right;
    position: relative;
    right: 300px;
  }
  .c{
    clear: both;
  }
  .finishitem{
    float: left;
    width: 100%;
  }
  .finished{
    float: left;
    position: relative;
    top:60px;
    margin-left: 70px;
  }
  h4{
    margin: 16px 0;
  }
</style>
