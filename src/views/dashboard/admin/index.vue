<template>
  <div class="dashboard-editor-container">
    <github-corner class="github-corner" />

    <panel-group />

    <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;margin-top: 70px;">
      <bar-chart :xlist="xlist" :ylist="ylist"/>
    </el-row>
  </div>
</template>

<script>
import GithubCorner from '@/components/GithubCorner'
import {get,post,post_json} from '../../../utils/request'
import PanelGroup from './components/PanelGroup'
import BarChart from './components/BarChart'
export default {
  name: 'DashboardAdmin',
  components: {
    GithubCorner,
    PanelGroup,
    BarChart,
  },
  data() {
    return {
      listQuery: {
        page:1,
        pageSize:20,
      },
      list:[],
      xlist:[],
      ylist:[],
    }
  },
  mounted() {
    this.getBill()
  },
  methods: {
    getBill() {
          get('bill/pageQuery',this.listQuery).then((res)=>{
          var list1=res.data.list.map(v=>{
            if(v.state===1){
              return v.price
            }
          });
          var list2=[]
          list2=list1.filter(v=>v!=undefined)
          list2.sort((a,b)=>{return b-a})
          this.list=list2.slice(0,10)
          var list3=[];
          list3=res.data.list.map(v=>{
            if(v.state===1 && this.list.includes(v.price)){
              return {
                id:v.id,
                price:v.price
              }
            }
          })
          list3=list3.filter(v=>v!=undefined)
          list3.sort((a,b)=>{
            return b.price-a.price
          });
          this.xlist=list3.map(v=>v.id)
          this.ylist=list3.map(v=>v.price);
          console.log('1111111111111',this.xlist);
          console.log('22222222222222',this.ylist);
          })
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard-editor-container {
  padding: 32px;
  background-color: rgb(240, 242, 245);
  position: relative;

  .github-corner {
    position: absolute;
    top: 0px;
    border: 0;
    right: 0;
  }

  .chart-wrapper {
    background: #fff;
    padding: 16px 16px 0;
    margin-bottom: 32px;
  }
}

@media (max-width:1024px) {
  .chart-wrapper {
    padding: 8px;
  }
}
</style>
