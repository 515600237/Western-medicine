<template>
  <div class="wrapper">
    <van-nav-bar
      :title="titleList[pgListType]"
      left-text="返回"
      right-text
      left-arrow
      class="header"
      @click-left="goPage()"
    />
    <!-- // pgListType 日历显示1，按年显示2 列表，按月显示3 列表 -->
    <div class="queryTitle disFlex" v-if="pgListType == 1 || pgListType == 2">
      <van-col span="6">
        <van-icon name="notes-o" span="6" size="24px" @click="goPgList(2)" v-if="pgListType == 1" style="float:left;"/>
        <van-icon name="calender-o" span="6" size="24px" @click="goPgList(1)" v-if="pgListType == 2" style="float:left;"/>
      </van-col>
      <!-- 年份选择弹窗 -->
      <van-col span="12">
        <van-dropdown-menu  active-color="#1DA29A">
          <van-dropdown-item v-model="currentShowYear" :options="optionYear" @change="changeYear"/>
        </van-dropdown-menu>
      </van-col>
      <van-col span="6">
          <button class="addPlanBtn greenLgBtn" @click="goAddPage()">+ 新增计划</button>
      </van-col>
    </div>
    <div class="queryTitle text-center" v-if="pgListType == 3">
      <strong>{{currentShowYear}}年{{currentShowMonth}}月</strong>
    </div>

    <!-- 轮转日历 -->
    <div class="homeCtBox flex1" v-if="pgListType == 1">
      <div class="monthShowList van-hairline--left disFlex">
        <div class="monthShowItem van-hairline--right van-hairline--top"  v-for="(item1,index1) in [1,2,3]" :key="index1"  @click="selectMonth(item1)" :class="{'activeMonth':getActiveMonth(item1)}">
            <strong class="monthNum">{{item1}}</strong>月
        </div>

        <div class="btProgress" v-if="calendarList[0].calendarItemList &&calendarList[0].calendarItemList.length">
          <div class="btPressItem" v-for="(item1,index1) in calendarList[0].calendarItemList" :key="index1"  :class="{'btPressItem1': item1.startTime,'btPressItem2': item1.endTime }"  :style="getLeftWidth(item1,1)">
            <i v-show="item1.startTime"></i>
            <span v-show="item1.startTime || index1 == 0">{{item1.departmentName}}</span>
          </div>
        </div>

      </div>

      <div class="monthShowList van-hairline--left disFlex">
        <div class="monthShowItem van-hairline--right van-hairline--top"  v-for="(item1,index1) in [4,5,6]" :key="index1"  @click="selectMonth(item1)" :class="{'activeMonth':getActiveMonth(item1)}">
            <strong class="monthNum">{{item1}}</strong>月
        </div>

        <div class="btProgress" v-if="calendarList[1].calendarItemList &&calendarList[1].calendarItemList.length">
          <div class="btPressItem" v-for="(item1,index1) in calendarList[1].calendarItemList" :key="index1" :class="{'btPressItem1': item1.startTime,'btPressItem2': item1.endTime }" :style="getLeftWidth(item1,2)">
            <i v-show="item1.startTime"></i>
            <span v-show="item1.startTime || index1 == 0">{{item1.departmentName}}</span>
          </div>
        </div>
      </div>

      <div class="monthShowList van-hairline--left disFlex">
        <div class="monthShowItem  van-hairline--right van-hairline--top"  v-for="(item1,index1) in [7,8,9]" :key="index1"  @click="selectMonth(item1)" :class="{'activeMonth':getActiveMonth(item1)}">
            <strong class="monthNum">{{item1}}</strong>月
        </div>

        <div class="btProgress" v-if="calendarList[2].calendarItemList &&calendarList[2].calendarItemList.length">
          <div class="btPressItem" v-for="(item1,index1) in calendarList[2].calendarItemList" :key="index1" :class="{'btPressItem1': item1.startTime,'btPressItem2': item1.endTime }" :style="getLeftWidth(item1,3)">
            <i v-show="item1.startTime"></i>
            <span v-show="item1.startTime || index1 == 0">{{item1.departmentName}}</span>
          </div>
        </div>
      </div>

      <div class="monthShowList van-hairline--left van-hairline--bottom disFlex">
        <div class="monthShowItem van-hairline--right van-hairline--top"  v-for="(item1,index1) in [10,11,12]" :key="index1"  @click="selectMonth(item1)" :class="{'activeMonth':getActiveMonth(item1)}">
            <strong class="monthNum">{{item1}}</strong>月
        </div>

        <div class="btProgress" v-if="calendarList[3].calendarItemList &&calendarList[3].calendarItemList.length">
          <div class="btPressItem" v-for="(item1,index1) in calendarList[3].calendarItemList" :key="index1" :class="{'btPressItem1': item1.startTime,'btPressItem2': item1.endTime }" :style="getLeftWidth(item1,4)">
            <i v-show="item1.startTime"></i>
            <span v-show="item1.startTime || index1 == 0">{{item1.departmentName}}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 2 按年显示列表  3 按月显示-->

    <div class="homeCtBox homeCtBox2 flex1" v-if="pgListType == 2 || pgListType == 3">
      <div class="rotationItem text-left"  v-for="(item,index) in rolationList" :key="index" @click="goRationDetail(item)">
        <p>
          <van-icon name="orders-o" span="6" size="18px" class="calendarIcon greenWg fl"/>
          <span class="fl currentRoTime">{{item.startTime}}<hr>{{item.endTime}}</span>
        </p>
        <p class="demand_pbox">
          <strong class="rot_depName fl">{{item.departmentName}}</strong>
          <button class="demandBtn greenLgBtn fr" @click.stop="goRequires(item)">培训要求</button>
        </p>
        <p>
          是否在协同单位轮转:
          <span v-if="item.cooperationFlag == 0">否</span>
          <span v-if="item.cooperationFlag == 1">是</span>
        </p>
        <div class="teacherBox disFlex">
          <div class="teacherLabel">指导医师:</div>
          <div class="flex1">
            <template v-if="showTeacher(item.rotationScheduleTeacherDtoList)">
              <span class="guideTeacher" v-for="(item2,index2) in item.rotationScheduleTeacherDtoList" :key="index2">
                {{item2.teacherName}}
                <i class="verticalLine">|</i> {{item2.teacherPhone}}
              </span>
            </template>
            <span class="guideTeacher" v-else>
              暂未分配
            </span>
          </div>
        </div>
      </div>
      <div v-if="!rolationList.length" class="noData">
        <div class="img-box">
          <img src="../../../../assets/image/defaultStudent.png" alt="">
        </div>
        <p>暂无轮转计划</p>
      </div>
    </div>
  </div>

</template>

<script>
  // pgListType 日历显示1，按年显示2，按月显示3
  import selectPop from "@/components/selectListPop.vue";

  export default {
    name: "rotation",
    components: {
      vSelectpop: selectPop
    },
    data() {
      return {
        /*年度列表*/
        pgListType: 1,
        currentYear: "",
        currentShowYear: 2019,
        currentMonth: "",
        currentShowMonth: "",
        optionYear: [],
        yearList: [],
        titleList: { "1": "录入轮转计划", "2": "录入轮转计划", "3": "轮转计划" },
        rolationList: [],
        calendarList: [{},{},{},{}] //轮转日历默认值
      };
    },
    created() {
      const day= new Date();
      // 初始化年
      this.currentYear = day.getFullYear();
      this.currentShowYear = day.getFullYear();
      
      // 初始化月
      let currentMonth = day.getMonth() +1;
      this.currentMonth = currentMonth;
      this.currentShowMonth = currentMonth;

      // 实现默认显示
      let pgListType = this.$store.state.rotationShType;
      if(pgListType){
        this.pgListType = pgListType;
      }
      //从store中取出时间
      this.getStoreDate();
      // 初始化查询
      this.initCurrentSearch();
    },
    methods: {
      //从store中取出之前的时间
      getStoreDate(){
          let storeYear = this.$store.state.rotationDateJson.year;
          let storeMonth = this.$store.state.rotationDateJson.month;
          if(storeYear){
            this.currentShowYear = storeYear;
          }
          if(storeMonth){
            this.currentShowMonth = storeMonth;
          }
      },
      initCurrentSearch(){  //查询方法
      //选择年份，点击月份，pageType切换都调用该方法
         // pgListType 日历显示1，按年显示2，按月显示3
        //  轮转日历
         if(this.pgListType == 1){
            this.getRolationCalendar();
         }
        //  年份列表
        if(this.pgListType == 2){
            this.getRolationList();
         }
        //  月份列表
         if(this.pgListType == 3){
            this.getRolationList(this.currentShowMonth);
         }
      },
      getActiveMonth(month){
         //当前年份 高亮显示
         if(this.currentShowYear == this.currentYear && this.currentMonth == month){
              return true;
         }
         return false;
      },
      // 选择年份
      changeYear(){
        this.initCurrentSearch();
      },
      // 选择月份
      selectMonth(month) {
        this.currentShowMonth = month;
        this.pgListType = 3;
        this.initCurrentSearch();
      },
      // 页面类型
      goPgList(type) { //日历与列表切换
        this.pgListType = type;
        this.initCurrentSearch();
      },
      initYear(){
        let date = new Date();
        let startYear = date.getFullYear();
        let endYear   = date.getFullYear()+4;
        for(let i = startYear;i < endYear;i++){
          this.optionYear.push({
            text:i+'年',
            value:i
          })
        }

      },
      goPage() {
        //点击返回，列表3切回列表1
        if (this.pgListType == 3) {
          this.pgListType = 1;
          this.initCurrentSearch();
          return;
        }
        // 返回首页，设置当前年当前月
        this.$store.dispatch("setNewRotationShType",1);
        this.$router.push({ name: 'homeindex' });
      },
      goAddPage(){
        //新增计划
        //记录当前是哪个页面类型
        this.$store.dispatch("setNewRotationShType",this.pgListType);
        this.$store.state.rotationDateJson ={
             year: this.currentShowYear,
             month: this.currentShowMonth
        };
        // 轮转计划页面类型设置
        this.Global.rotationAddType =1;

        this.$router.push({ name: 'addRolation' });
      },
      // 获取轮转计划列表
      getRolationList( month =""){
        const url =this.api.schelist;
        const postJson={
          studentId: this.Global.userId,
          year: this.currentShowYear,
          pageIndex: 1,
          pageSize: 100
        };
        if(month){
          postJson.month = month;
        }
        this.utils.ajax({
          url:url,
          method:"POST",
          data:postJson,
          success:(res)=>{
            console.log(res);
            if(res.code == 0 && res.data){
              this.rolationList = res.data.result;
            }
          }
        })
      },
      // 获取轮转日历
      getRolationCalendar(){
        const url =this.api.scheduleCalendar;
        const postJson={
          year: this.currentShowYear,
        };
        console.log(url);
        this.utils.ajax({
          url:url,
          method:"POST",
          data:postJson,
          success:(res)=>{
            console.log(res);
            if(res.code == 0 && res.data && res.data.monthCalendarList && res.data.monthCalendarList.length){
              this.calendarList = res.data.monthCalendarList;
              console.log(this.calendarList);
            }else{
              this.calendarList = [{},{},{},{}];
            }
          }
        })
      },
      // 获取距离起始时间多少天
      getLongDate(time,type){
        let currentYear =this.currentShowYear || "2019";
        let zeroStTime = currentYear + "/01/01";
        let dayAllArea;
        if(type == 1){
          zeroStTime = currentYear + "/01/01";
          dayAllArea = 91;
        }
        if(type == 2){
          zeroStTime = currentYear + "/04/01";
          dayAllArea = 91;
        }
        if(type == 3){
          zeroStTime = currentYear+ "/07/01";
          dayAllArea = 92;
        }
        if(type == 4){
          zeroStTime = currentYear + "/10/01";
          dayAllArea = 92;
        }
        let day1= new Date(time.replace(/-/g, '/')).getTime() - new Date(zeroStTime).getTime();
        let days= Math.floor(day1/(1000*3600*24));
        let percent =  (days/dayAllArea).toFixed(2)*100 ;
        return percent;
      },
      getLeftWidth(item,type){
        let left ="0";
        let right = "100";
        let width;
        // 获取开始时间，结束时间百分数值
        if(item.startTime){
          left = this.getLongDate(item.startTime,type);
        }
        if(item.endTime){
          right = this.getLongDate(item.endTime,type);
        }
        width = right - left +"%";
        return { width: width, left:left+"%"};

      }, 
      setGlobalCurrent(item){
        this.$store.dispatch("setNewRotationShType",this.pgListType);
        // 保存必要参数
        this.Global.currentItem = {
            depDetailType : 1,
            currentDepartId: item.departmentId,
            departmentName: item.departmentName,
            currentScheduleId: item.id,
            listScheItem: item,
            currentRotationStartTime: item.startTime,
            currentRotationEndTime: item.endTime,
        };
        this.$store.state.rotationDateJson ={
             year: this.currentShowYear,
             month: this.currentShowMonth
        };
      },     
      // 培训要求
      goRequires(item) {
        this.setGlobalCurrent(item);
        this.$router.push({ name: "trainingRequires",params:{
            itemData: item
          } });
      },
      // 轮转详情
      goRationDetail(item){
        this.setGlobalCurrent(item);
        this.$router.push({name:'relationDetail'});
      },
      showTeacher(data) {
        if (!data) {
          return false;
        }
        if (!data.length) {
          return false;
        }
        return true;
      }
    },
    mounted() {
      this.initYear();
    }
  };
</script>

<style scoped>
  .wrapper >>> .van-dropdown-menu{
    background:#f2f2f2;
  }
  .wrapper {
    background: #f2f2f2;
    flex-direction: column;
  }
  .header /deep/ .van-nav-bar__left .van-nav-bar__text{
    left:0.625rem;
    height: 100%;
    line-height: 46px;
  }
  .homeCtBox {
    width: 100%;
    padding: 0 12px;
    position: absolute;
    top: 100px;
    bottom: 0px;
    overflow-y: scroll;
  -webkit-overflow-scrolling: touch;
  }
  .queryTitle {
    width: 100%;
    height: 54px;
    padding: 10px 12px 10px;
    justify-content: space-between;
    align-items: center;
  }
  .currentYear {
    font-weight: bold;
    font-size:1rem;
  }
  /* 弹窗 */
  .fade-enter-active, .fade-leave-active {
    transition: opacity .5s;
  }
  .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
    opacity: 0;
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
  .yearSeList li i{
    float: right;
    margin-right: 20px;
    font-size: 14px;
  }
  .addPlanBtn {
    font-size: 14px;
    padding: 4px;
    border-radius: 3px;
  }
  /* 月份展示 */
  .monthShowList {
    position: relative;
    flex-wrap: wrap;
    background: #fff;
  }
  /* .monthShowList:last-child{
    border-bottom: 2px solid #ccc;
  } */
  /* 每三个月为一组 */
  .btProgress {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    width: 100%;
    height: 16px;
    line-height: 16px;
  }
  .btPressItem {
    display: flex;
    position: absolute;
    top: 0;
    bottom: 0;
    height: 100%;
    background-color: #1DA29A;
    text-align: left;
    font-size: 12px;
    color: #fff;
    overflow: hidden;
    text-indent: 10px;
  }
  .btPressItem i {
    display: none;
    flex-shrink:0;
    width: 12px;
    height: 12px;
    border-radius: 12px;
    background-color: #fff;
    margin: 2px 4px 0 4px;
  }
  .btPressItem1 {
    border-top-left-radius: 16px;
    border-bottom-left-radius: 16px;
  }
  .btPressItem2 {
    border-top-right-radius: 16px;
    border-bottom-right-radius: 16px;
  }
  .monthLast {
    border-bottom: 1px solid #ccc;
  }
  .monthShowItem {
    width: 33.33%;
    height: 118px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .monthNum {
    font-size: 28px;
  }
  .monthShowItem.activeMonth{
    background: rgba(255, 245, 230, 1);
    color: #FE9400;
  }
  /* 年度选择弹窗 */
  .yearPops {
    top: 100px;
  }
  .overYearbg {
    opacity: 0.5;
  }
  .icon_more {
    border-width: 8px;
    margin-left: 10px;
    margin-top: 5px;
  }
  /* 轮转记录 */
  .rotationItem {
    padding: 10px 15px;
    font-size: 12px;
    background-color: #fff;
    overflow: hidden;
    margin-bottom: 10px;
  }
  .rotationItem p {
    overflow: hidden;
    height: 24px;
    line-height: 24px;
  }
  .rotationItem .demand_pbox {
    height: 30px;
    line-height: 30px;
    display: flex;
    justify-content: space-between;
  }

  .rotationItem .calendarIcon {
    margin-top: 2px;
  }
  .rot_depName {
    font-size: 20px;
    font-weight: bold;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    width: 70%;
  }
  .demandBtn {
    width: 92px;
    height: 30px;
    border-radius: 30px;
  }
  .teacherBox{
    overflow: hidden;
  }
  .guideTeacher {
    margin-right: 5px;
    margin-left: 5px;
  }
  .verticalLine {
    font-style: normal;
    margin: 0 8px;
  }
  .noData{
    width:100%;
    height:100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    margin:-50px auto;
  }
  .noData p{
    font-size:16px;
    color:#ccc;
  }
  /* 轮转时间 */
.currentRoTime{
  display: flex;
  align-items: center;
}
.currentRoTime hr{
  width: 24px;
  padding: 0;
  margin:0  1px;
}
</style>
