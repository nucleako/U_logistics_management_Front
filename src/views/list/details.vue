  <template>
    <div class="app-container">
      <div class="filter-container">
        <el-input v-model="id" placeholder="订单号" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
        <!-- <el-select v-model="searchForm.OrderStatus" placeholder="Status" clearable class="filter-item" style="width: 130px" > -->
        <!-- <el-option label="全部" value="全部" /> -->
        <!-- <el-option label="已完结" value="1" />
        <el-option label="未完结" value="0" /> -->
      <!-- </el-select> -->
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        搜索
      </el-button>
      <el-button  class="filter-item" style="margin-left: 3px;width:90px; margin-right:10px" icon="el-icon-refresh"
			@click="getRefresh">
        	刷新
        </el-button>
      <div class="finishitem" v-for="item in list" :key="item.id">
    	<div class="top_item">
			<span>下单时间：{{item.OrderDate}}</span>
			<span style="margin-left: 250px;">订单编号：{{item.Id}}</span>
			<span style="margin-left:450px ;">订单总额：{{item.OrderPrice}}</span>
			<span style="margin-right:150px ;float: right;">
				订单状态：<el-tag :type="item.OrderStatus | statusFilter">{{item.OrderStatus===1 ?'已完结':'未完结'}}</el-tag>
			</span>
       </div>
      <div class="bottom_item" >
          <div style="margin-left:100px;float: left;width:500px">
			<h4>发件联系人:{{item.SdCustomerName}}</h4>
			<h4 style="max-width: 1200px;">发件地址:{{item.SdCustomerAddress}}</h4>
			<h4 style="max-width: 1200px;">公司总部地址:{{item.SdCustomerCompanyName}}</h4>
          </div>
		  <div style="margin-right:100px;float: right;width:500px">
			<h4>收件联系人:{{item.RcvCustomerName}}</h4>
			<h4 style="max-width: 1200px;">收件地址:{{item.RcvCustomerAddress}}</h4>
			<h4 style="max-width: 1200px;">公司总部地址:{{item.RcvCustomerCompanyName}}</h4>
          </div>
        <div class="c"></div>
      </div>
    </div>
    <!-- <pagination style="position:relative;top:-30px;" v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.pageSize" @pagination="getList" /> -->
      </div>
</div>
  </template>

  <script>
  import waves from '@/directive/waves' // waves directive
  import Pagination from '@/components/Pagination' // secondary package based on el-pagination
  import {get,post,post_json} from '../../utils/request'
  export default {
    name: 'ComplexTable',
    components: { Pagination },
    directives: { waves },
    filters: {
      statusFilter(status) {
        const statusMap = {
          "1": 'success',
          "0": 'danger'
        }
        return statusMap[status]
      },
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
          name: null,

        },
        id:undefined,
        url: 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg'
      }
    },
    // 请求数据
    created() {
      this.getList()
    },
    methods: {
      // 请求商品数据的方法
      getList() {
            // 无数据，转圈开始
            this.listLoading = true
            get('/list/pageQuery',this.listQuery).then((res)=>{
              // console.log(res.data.list);
              this.list=res.data.list.map(v=>{
              return{
                ...v,
                OrderDate:this.getDate(v.OrderDate)}
            })
              this.total=res.data.total;
            })
            // 数据有，转圈结束
            this.listLoading = false
      },
      getRefresh(){
      this.getList();
      this.id=undefined
    },
    //   实现检索，每次Input根据属性添加值的时候，且多了一个参数，获取数据的方法会重新调用一次，
    handleFilter() {
      try {
			get('list/findListById',{id:this.id}).then((res)=>{
			this.list=res.data;
		})
		} catch (error) {
			console.log(error);
			console.log('未查询到相关信息！');
		}
        // if(this.listQuery.status=="")
        //   this.$delete(this.listQuery,'status')
        // this.getList()
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
  .filter-item{
    margin-left: 10px;
    width: 200px;
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
