<template>
  <div class="static">
    <!--header头部-->
    <van-nav-bar title="各科室轮转完成率"/>

    <!--缺省图-->
    <div v-if="!staticData||!staticData.length" class="miss disFlex">
      <div class="lack disFlex">
        <img :src="imgUrl" alt="">
      </div>
      <p class="textentering">您还没有录入病种/技能/手术信息</p>
      <button class="entering" @click="goPage">去录入</button>
    </div>
    <!--内容区容器-->
    <div class="static-view" v-else>
      <!--三个小标签-->
      <ul class="static-view-title">
        <li>
          <span class="one"></span>
          <p>已完成:{{ staticRes.passedDepartmentNum}}</p>
        </li>
        <li>
          <span class="two"></span>
          <p>进行中：{{staticRes.rotatingDepartmentNum}}</p>
        </li>
        <li>
          <span class="three"></span>
          <p>未开始：{{staticRes.noStartDepartmentNum}}</p>
        </li>
      </ul>
      <!--环形进度条-->

      <ol class="static-view-content">
        <li @click.prevent="goStaticDetail(item)"
            v-for="(item,index) of staticData"
            :key="index"
        >
          <div  class="pieItemBox"></div>
          <span>{{item.departmentName}}</span>
        </li>
      </ol>
    </div>
  </div>
</template>

<script>
export default {
  name: "staticindex",
  data() {
    return {
      msg:{

      },
      imgUrl:require('../../../../assets/image/defaulTentering.png'),
      rate1: 100,
      rate2: 27,
      currentRate1: 0,
      currentRate2: 0,
      resizeShow: "120px",
      staticRes: {},
      staticData: [1,2,3],
    };
  },
  created(){
  },
  computed: {
    circleSize() {
      let clientWidth_get = document.documentElement.clientWidth;
      let size = parseInt((clientWidth_get / 375) * 120) + "px";
      return size;
    },
    text1() {
      return this.currentRate1.toFixed(0) + "%";
    },
    text2() {
      return this.currentRate2.toFixed(0) + "%";
    }
  },
  methods: {
    goPage(){
      this.$router.push({name:'medicalAdd'})
    },
    goStaticDetail(item) {
     this.$router.push({name:"staticdetail",params:{itemData: item}});
    },
    resize() {
      var clientWidth_get = document.documentElement.clientWidth;
      this.resizeShow = (clientWidth_get / 375) * 16 + "px";
    },
    drawLine() {
      // 基于准备好的dom，初始化echarts实例
      let echartsDom = document.getElementsByClassName("pieItemBox");
      Array.from(echartsDom).forEach((item,index)=>{
        let myChart = this.$echarts.init(item);
        let dataItem = this.staticData[index];
        const option = this.getOption(dataItem);
        myChart.setOption(option);
      })

    },
    getOption(dataItem){
        let progress =  dataItem.progress + "%";
        let passNum = dataItem.passedNum;
        let noPassNum = dataItem.requiredNum - dataItem.passedNum;
        if(passNum == 0 && noPassNum== 0 ){
           noPassNum =1;
        }
        /*增加环形图文字颜色*/
      //  0 未开始 1 进行中 2 已完成
      let color ="";
      if(dataItem.rotationStatus == 0){
        color="#e4e4e4";
      }
      if(dataItem.rotationStatus == 1){
        color="#0079fe";
      }
      if(dataItem.rotationStatus == 2){
        color="#1da29a";
      }
        // 绘制图表
        let option = {
          series: [
            {
              name: "访问来源",
              type: "pie",
              radius: ["60%", "75%"], //这里是控制环形内半径和外半径             avoidLabelOverlap: false,
              hoverAnimation: false, //控制鼠标放置在环上时候的交互
              color:[color,'#e4e4e4'],
              label: {
                normal: {
                  show: true,
                  position: "center",
                  textStyle: {
                    fontSize: "16",
                    fontWeight: "bold"
                  }
                }
              },
              data: [
                {
                  value: passNum,
                  name: progress
                },
                {
                  value: noPassNum,
                  name: ""
                }
              ]
            }
          ],
          color: ["#339900", "#C9C9C9"]
        };
        return option;
    },

    /**************数据请求***************/
    //统计首页
    rotationProgress(){
         return new Promise( (resolve,reject) =>{
            const url = this.api.rotationProgress;
            this.utils.ajax({
              url:url,
              method:"POST",
              success:res=>{
                if(res.code == 0 && res.data){
                  resolve(res);
                }
              }
            })
         } )
    }
  },
  mounted() {
    this.rotationProgress().then((res)=>{
        this.staticRes = res.data;
        this.staticData = res.data.departPassedMedicalRecordDtoList;
        this.$nextTick(() =>{
           this.drawLine();
        })
    })

  }
};

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.static {
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  background: #fff;
}
.static-view {
  width: 100%;
  height:100%;
  padding: 0 30px;
  box-sizing: border-box;
}
/*三个小标签css*/
.static-view-title {
  width: 100%;
  height: 2rem;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 12px;
  text-align: center;
  margin-bottom: 10px;
}
.static-view-title li {
  display: flex;
  width: calc(100% / 3);
  height: 2rem;
  justify-content: center;
  align-items: center;
}
/* 饼状图 */
.pieItemBox{
    width: 100%;
    height: 145px;
}
.static-view-title span {
  width: 15px;
  height: 15px;
  margin-right: 5px;
}
.static-view-title .one {
  background: #1da29a;
}
.static-view-title .two {
  background: #0079fe;
}
.static-view-title .three {
  background: #e4e4e4;
}
/*环形进度条*/
.static-view-content {
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  height:85%;
  align-content: flex-start;   /*换行没有间隙*/
  overflow-y:scroll;
  -webkit-overflow-scrolling: touch;
}
.van-circle__layer {
  -webkit-transform: rotate(0deg);
  transform: rotate(0deg);
}
.static-view-content li {
  width: 49%;
  height:30%;
  margin-bottom: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  box-sizing: border-box;
}
.static-view-content li span {
  font-size: 12px;
  color: #333;
}
.static-view-content /deep/ .van-circle__text {
  font-size: 28px;
  color: #999;
  text-align: center;
}

  /*缺省图*/
.miss{
  width:100%;
  height:calc(100% - 90px);
  justify-content: center;
  align-items: center;
  flex-direction: column;
}
.lack{
  width:9rem;
  height:9rem;
}
.lack img{
        width:100%;
}
.textentering{
  font-size:18px;
  width:100%;
  color:#999;
  margin-bottom:20px;
}
.entering{
  width:12.5rem;
  height:2.5rem;
  border-radius:2rem;
  background:#fff;
  border: 1px solid #1da29a;
  font-size:1rem;
  color:#1da29a;
}
</style>
