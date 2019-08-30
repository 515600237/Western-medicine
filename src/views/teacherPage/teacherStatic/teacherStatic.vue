<template>
  <div class="static">
    <!--header头部-->
    <van-nav-bar title="本科室学员轮转完成情况"/>

    <!--弹窗-->
    <van-dropdown-menu class="menu-drop-box">
      <!-- 年份 -->
      <van-dropdown-item v-model="value1" :options="optionYear" @change="menuChange1" :title="value1+'年'"/>
      <!-- 轮转状态 -->
      <van-dropdown-item v-model="rotationStatus" :options="option2" :title="menuTitle" class='menu-pop-box' @change="menuChange2" />
    </van-dropdown-menu>

    <div class="static-view">
       <div class="progressBox text-left"
            @click="goStaticDetail(item)"
            v-for="(item,index) of  relationResult" :key="index">
          <p class="progressTitle">{{item.studentName}}  [<span>{{item.rotationStatus}}</span>]</p>
          <div>
            <div class="progressBar">
              <div class="progressInBar" :style="{ width: item.completeRecordProgress +'%'}"></div>
            </div>
            <div class="progressNum" >{{item.completeRecordProgress}}%</div>
          </div>

       </div>
    </div>
    <!--缺省图-->
    <div v-if="!relationResult||!relationResult.length"
         class="miss disFlex">
      <div class="lack disFlex">
        <img :src="imgUrl" alt="">
        暂无统计信息
      </div>
    </div>
  </div>
</template>

<script>
import selectYear from "@/components/selectListPop.vue";
import selectState from "@/components/selectListPop.vue";
import selectListPop from "@/components/selectListPop/selectListPop.vue";
export default {
  name: "staticindex",
  data() {
    return {
      value1: 2019,
      optionYear: [
        { text: "2019年", value: 2019 },
        { text: "2020年", value: 2020 },
        { text: "2021年", value: 2021 },
        { text: "2022年", value: 2022 }
      ],
      page:1,
      pageSize:10,
      radio:0,
      staticShow:true,
      imgUrl:require('../../../assets/image/defaulTentering.png'),
      // 年份
      currentYear: 2019,
      yearList: [],
      showYearPop: false,
      // 轮转状态
      option2: [
        { text: '全部', value: -1 },
        { text: '未入科', value: 0 },
        { text: '轮转中', value: 1 },
        { text: '已出科', value: 2 },
    ],
     menuTitle:"轮转状态-轮转中",
      state: "全部",  
      //轮转状态，-1全部， 0 未入科，1轮转中，2已出科
      rotationStatus: 1,    
        list:[],
        index:0,
      stateList: ["全部","未入科","轮转中","已出科"],
      showStatePop: false,
      rate: 100,
      currentRate: 5,
      relationResult: []
    };
  },
  components:{
    vSelectyear : selectYear,
    vSelectstate : selectState,
    SelectListPop:selectListPop,
  },
  computed: {
    text() {
      return this.currentRate.toFixed(0) + "%";
    }
  },
  created(){
    this.getYearList();
    this.currentYear = new Date().getFullYear();
    this.showRotationProgress();
  },
  methods: {
      /*******************数据请求************************/
      showRotationProgress(){
          const url = this.api.showRotationProgress ;
          const postJson={
            standardDepartmentId:this.Global.userInfo.standardDepartmentId,
            year:this.value1,
            rotationStatus:this.rotationStatus,
            pageIndex:1,
            pageSize:10,
          }
          this.utils.ajax({
            url:url,
            method:"POST",
            data:postJson,
            success:res=>{
                if(res.code == 0){
                   this.relationResult = res.data.result;
                }
            }
          });
    },
    menuChange1(){
      this.showRotationProgress();
    },
    menuChange2(value){
          this.menuTitle="轮转状态-";
          const menuTitleJson={
            "-1":"全部",
            "0":"未入科",
            "1":"轮转中",
            "2":"已出科",
          }
          this.menuTitle += menuTitleJson[value];
          this.showRotationProgress();
    },
    selectYear(){
      this.showYearPop = true;
    },
    selectState(){
      this.showStatePop = true;
    },
    hideYearPop(){
        this.showYearPop  = false;
        this.showStatePop = false;
    },
    getYearList() {
      const date = new Date();
      let currentYear = date.getFullYear();
      for (let i = 0; i < 3; i++) {
        this.yearList.push(currentYear+"年");
        currentYear++;
      }

    },
    goStaticDetail(item){
        this.$router.push({name:"staticdetail",params:{itemData: item}});
    }
  },
  mounted(){
  }
};
</script>

<style scoped>
  .menu-drop-box{
    background:#f2f2f2;
    border-top: 1px solid rgba(228, 228, 228, 1);
    border-bottom:1px solid rgba(228, 228, 228, 1);
  }
  .static >>> .van-dropdown-menu__item:first-of-type{
    border-right:1px solid rgba(228, 228, 228, 1);
  }

  .menu-pop-box{
    border-left:1px solid #f2f2f2;
  }
  .static >>> .van-cell__title{
    text-align: left;
  }
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
  padding: 0 30px;
  box-sizing: border-box;
}
/*条件选择区*/
.queryBox {
  width: 100%;
  height: 38px;
  line-height: 38px;
  border-left: none;
  border-right: none;
    font-size:1rem;
}
.queryBox i {
  font-style: normal;
}
.yearBox {
  border-right: 1px solid #e4e4e4;

}
/* 年度选择弹窗 */
.yearPops {
  top: 84px;
}
.overYearbg {
  opacity: 0.5;
}
.icon_more {
  border-width: 8px;
  margin-left: 10px;
  margin-top: 5px;
}
.yearSeList {
  text-align: left;
  text-indent: 20px;
}
.yearSeList li {
  height: 45px;
  line-height: 45px;
  border-bottom: 1px solid #ccc;
}
/* 进度条 */
.progressBox{
  margin-top: 20px;
}
.progressTitle{
    font-size:1rem;
  margin-bottom: 6px;
}
.progressBar{
  position: relative;
  display: inline-block;
  width: 276px;
  height: 8px;
  background-color: #F2F2F2;
  border-radius: 8px;
  overflow: hidden;
}
.progressBar .progressInBar{
  position: absolute;
  width:50%;
  left: 0;
  top:0;
  bottom: 0;
  background-color: #1DA29A;
  border-top-right-radius: 4px;
  border-bottom-right-radius: 4px;
}
.progressNum{
  display: inline-block;
  font-size: 12px;
  margin-left: 8px;
}
/*环形进度条*/
.static-view-content {
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  height: 480px;
  /* border:1px solid greenyellow;*/
}
.static-view-content li {
  width: 50%;
  height: 160px;
  margin-bottom: 10px;
  /*  padding-top:10px;*/
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  /* border:1px solid lightcoral;*/
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
/*缺省图片*/
.miss{
    width:100%;
    height:calc(100% - 90px);
    justify-content: center;
    align-items: center;
}
.lack{
    width:220px;
    height:180px;
    flex-direction: column;
    font-size:18px;
    color:#999;
}
.lack img{
    width:100%;
}

</style>
