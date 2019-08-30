<template>
  <div class="wrapper auditWrapper">
    <!--标题-->
    <van-nav-bar title="审核"
                 left-arrow
                 left-text="返回"
                 @click-left="onClickLeft"
    >
      <van-button
        plain
        hairline
        type="primary"
        slot="right"
        size="small"
        @click="batchAudit()"
        v-if="valueAudit==0"
        :disabled="auditResList.length===0"
        :class="{'active':auditResList.length===0}"
        class="batchBtn"
      >
        <van-icon name="checked"
                  :color="'auditResList.length == 0'?'#1DA29A':''"
                  :class="{ 'disabled':'auditResList.length == 0'}"
        />批量审核
      </van-button>
    </van-nav-bar>
    <!-- 批量审核 -->
    <v-dialogt ref="headBatchAudit"
               :studentNameList="studentNameList"
               @checkAudit="submitBatchAudit"
               :auditType ="2"
    >
    </v-dialogt>
    <!--nav-->
    <van-dropdown-menu class="auditDropMenu" :z-index="1000">
      <van-dropdown-item v-model="valueAudit" :options="optionAudit" @change="changeAudit"/>
      <van-dropdown-item v-model="valueYear" :options="optionYear" @change="changeYear"/>
      <van-dropdown-item v-model="studentId" :options="optionName" @change="changeName"/>
    </van-dropdown-menu>

    <section class="section" @scroll="scroll" ref="sectionScroll">
      <!--缺省图-->
      <div v-if="!auditResList||!auditResList.length" class="miss disFlex">
        <div class="lack disFlex">
          <img :src="imgUrl" alt="">
          暂无相关信息
        </div>
      </div>
      <van-list
        v-model="loading"
        :finished="finished"
        :finished-text="loadText"
        @load="onLoad"
        ref="sectionScroll"
      >
      <!--待审核   审核操作-->
      <v-waitaudit :auditList="auditResList"
              @auditOperate="auditSure"
      >
      </v-waitaudit>
      </van-list>
      <!--单次审核弹出框-->
      <v-dialogt
        ref="showOneAudit"
        :studentNameList="studentNameList"
        @checkAudit="submitAudit"
        :auditType ="1"
      ></v-dialogt>

    </section>
  </div>
</template>

<script>

// 待审核
import waitAudit from "@/components/audit/waitAudit.vue";

import diglog from "@/components/dialog/dialog.vue";
import selectListPop  from "@/components/selectListPop/selectListPop";

export default {
  name: "awaitAudit",
  components: {
    vWaitaudit: waitAudit,
    vDialogt: diglog,
    /*测试弹窗*/
    SelectListPop:selectListPop
  },
  data() {
    return {

        num:0,//记录当前列表下标，
        indexFlag:false,//记录提交成功后的结果
        scrollTop:0,
        /*上拉加载文本*/
        loadText:'',
      /*弹出框*/
      valueAudit: 0,
      valueYear: 2019,
      studentId:-1,
      optionAudit: [
        { text: '待审核', value: 0 },
        { text: '已通过', value: 1 },
        { text: '未通过', value: 2 }
      ],
      optionYear: [],
      optionName: [
        {
          value: -1,
          text: "全部住院医师"
        },
      ],

      imgUrl:require('../../../../assets/image/defaultStudent.png'),
      radio:1,
      auditListShow:true,
      //审核状态
      auditStatus: 0,
      //当前年
      currentYear: 2019,
      //全部住院医师
      studentList: [
        {studentId: "-1",
        studentName: "全部住院医师"}
       ],
      currentStudent:{studentId: "-1",
        studentName: "全部住院医师"},

      currentStudentName: "全部住院医师",
      showStudentListPop: false,
      //审核弹窗
      studentNameList: "",
      //审核列表
      curAuditState: "待审核",
      showAuditStatePop: false,
      //  待审核 0，已通过1，未通过2
      AuditList: ["待审核", "已通过", "未通过"],
      currentCord:{}, //单次审核 item数据
      //年度列表
      yearList: [],
      showYearPop: false,
      list: [],
      //列表数据
      auditResList: [],
      loading: false,
      finished: false,
      page:1,
    };
  },
  methods: {
      scroll(event) {
          let scrollTop = event.target.scrollTop;
          this.$store.state.pos = scrollTop;
          console.log(scrollTop,this.$store.state.pos)
      },


     onLoad(){
      this.listAuditCollect();
    },
    //初始化年度列表
      initYear(){
        let  date = new Date();
        let startYear = date.getFullYear();
        let  endYear = date.getFullYear()+ 4;
        for (let i = startYear; i < endYear; i++) {
          this.optionYear.push(
            {
              text: i + "年",
              value:i,
            },
          );
        }
      },
    /*下拉菜单*/
    changeAudit(){
        this.page = 1;
        this.auditResList = [];
        this.finished = false;
        this.listAuditCollect();
    },
    changeYear(){
        this.page = 1;
        this.auditResList = [];
        this.finished = false;
      this.listAuditCollect();
    },
    changeName(){
        this.page = 1;
        this.auditResList = [];
        this.finished = false;
      this.listAuditCollect();
    },
    onClickLeft(){
      this.$router.go(-1);
    },
    //批量审核
    batchAudit() {

      let nameList= this.auditResList.map((item) =>{
        return item.studentName;
      });
      this.studentNameList = nameList;
      this.$refs.headBatchAudit.isShowHidePopUp();
    },


    // 单个审核
    auditSure(item,index) {
      this.num  = index;
      this.currentCord =item;
      this.studentNameList = [item.studentName];
      this.$refs.showOneAudit.isShowHidePopUp();
    },


    submitBatchAudit(textarea, Status){
         let array = [];
          this.auditResList.forEach(item => {
            array.push(item.auditCollectId);
          });
          this.auditPostAjax(textarea,Status,array,this.num);
    },
    /**********提交审核数据请求***********/
    submitAudit(textarea, Status) {
      let array = [];
       array.push(this.currentCord.auditCollectId);
       this.auditPostAjax(textarea,Status,array);
    },
     auditPostAjax(textarea,Status,idList,index){
        console.log(Status,'状态');

      const url = this.api.audit;
      const postJson = {
        idList: idList,
        auditState: Status,
        auditReason: textarea,
        teacherId: this.Global.userInfo.userId
      };

      this.utils.ajax({
        url: url,
        method: "POST",
        data: postJson,
        success: res => {
          if (res.code == 0) {
            this.$toast("审核成功");
             /* this.page = 1;
              this.auditResList = [];
              this.finished = false;
             this.listAuditCollect();*/
              this.auditResList.splice(index,1)
              this.$store.state.cacheHome = true;

          }else{
             this.$toast("审核失败");
          }
        }
      });
    },

    /*************数据请求******************/
   listAuditCollect() {

      this.loading= true;
      const url = this.api.listAuditCollect;
      let postJson = {
        auditState: this.valueAudit,
        standardDepartmentId: this.Global.userInfo.standardDepartmentId,
        pageIndex:this.page,
        pageSize: 10,
        studentId: this.studentId,
        year: this.valueYear
      };

      this.utils.ajax({
        url: url,
        method: "POST",
        data: postJson,
        success: res => {

            this.loading= false;
            if(!res.data){
                this.finished = true;
            }
            this.page = res.data.page+1;

          if(res.code == 0){


              this.auditResList =this.auditResList.concat(res.data.result);

              if (res.data.page == res.data.totalPage || res.data.totalPage == 0) {
                    this.finished = true;
                  if(this.auditResList.length >=10&&this.auditResList.length==res.data.count){
                     this.loadText='没有更多了'
                  }
              }
           /*   this.$nextTick(()=>{

                  if(this.$store.state.pos){
                      this.$refs.sectionScroll.scrollTop =this.$store.state.pos
                      console.log( this.$refs.sectionScroll.scrollTop)
                  }
                  console.log( this.$refs.sectionScroll.scrollTop,this.$store.state.pos,"花花草草")
              })
*/
          }
        }
      });
    },
    // 获取科室下全部住院医师
    getStudentList() {
      const url = this.api.studentInfoList;
      const postJson = {
        standardDepartmentId: this.Global.userInfo.standardDepartmentId
      };
      this.utils.ajax({
        url: url,
        method: "POST",
        data: postJson,
        success: res => {
          if (res.code == 0 && res.data) {
             let optionName = res.data;
         optionName =  optionName.map((item) => {
            return {
              ...item,
              text:item.studentName,
              value:item.studentId
            }

          })
            optionName.unshift({
              value: -1,
              text:"全部住院医师",
            });
          this.optionName = optionName;

          }
        }
      });
    },


  },
    updated(){
       /* if(this.$store.state.pos){
            this.$refs.sectionScroll.scrollTop =this.$store.state.pos
        }
        console.log(this.$refs.sectionScroll.scrollTop,111111)*/
    },
  created() {

      /*年度列表*/
      this.initYear();
      /*全部住院医师列表*/
      this.getStudentList();
   /* this.valueAudit = this.$route.params.type;*/
    this.curAuditState = this.AuditList[this.auditStatus];
     /*首页已通过、待审核跳转*/
    if([0,1].includes(this.$route.params.type)){
        this.valueAudit = this.$route.params.type
    }else{
        this.valueAudit =  this.$route.params.auditState;
    }
   /* 当前学生跳转*/
      if(this.$route.params.item){
          this.studentId = this.$route.params.item.studentId?this.$route.params.item.studentId:-1
      }

  },


};
</script>

<style scoped>
.van-toast--text.redToast{
  background-color: red;
}
  .wrapper >>> .van-button__text .disabled{
          background:none;
  }
  .wrapper >>> .van-nav-bar .van-icon-arrow-left{
    color:#1DA29A;
    font-size:16px;
  }
  .wrapper >>> .van-nav-bar .van-nav-bar__text{
    color:#1DA29A;
  }
  .wrapper >>> .van-cell__title{
    text-align: left;
  }
/*box*/
.wrapper {
  display: flex;
  flex-direction: column;
  position: relative;
}

/*导航栏*/
nav {
  display: flex;
  height: 38px;
  justify-content: space-around;
  align-items: center;
  width: 100%;
  background: #f2f2f2;
  position: absolute;
  top: 45px;
  left: 0;
  bottom: 0;
  right: 0;
}
.nav-box {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  line-height: 38px;
  height: 38px;
  font-size: 12px;
}
.nav-box span {
  margin: 5px 0 0 5px;
  border: 5px solid transparent;
  border-top-color: #333;
}
.batchBtn.van-button--primary{
  width:80px;
  color: #1DA29A;
}
/* 查询弹窗 */
.auditDropMenu{
  z-index: 1000;
  background: #F2F2F2;
}
/*主干*/
.auditWrapper section {
  width: 100%;
  position: absolute;
  top: 88px;
  bottom: 50px;
  left: 0;
  right: 0;
  padding: 0 10px;
  box-sizing: border-box;
  overflow-y:scroll;
  -webkit-overflow-scrolling: touch;
}
.office-message {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  background: #fff;
  border: 1px solid #f3f1f1;
  font-size: 12px;
  color: #666;
}
.office-message li {
  width: 30%;
  height: 40px;
  border: 1px solid #f3f1f1;
  text-align: left;
  text-indent: 20px;
  line-height: 40px;
}

.office-message span {
  width: 70%;
  text-indent: 20px;
  text-align: left;
  height: 40px;
  line-height: 40px;
  border: 1px solid #f3f1f1;
}

.office-message-tag {
  display: flex;
  background: #fff;
}

.office-tag-left {
  width: 30%;
  height: 52px;
  display: flex;
  justify-content: space-around;
  align-items: center;
}

.office-tag-left .tag {
  width: 55px;
  height: 24px;
  line-height: 20px;
  text-align: center;
  background: #1DA29A;
  border-radius: 10px;
  color: #fff;
  font-size: 12px;
}

.office-tag-left .name {
  font-weight: bold;
  font-size: 13px;
}

.office-tag-right {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 70%;
  font-size: 12px;
  color: #666;
}

.nottrue {
  line-height: 1.875rem;
  font-size: 14px;
  text-align: left;
  height: 1.875rem;
  text-indent: -3px;
}

.nottrue::before {
  content: "不属实";
  color: #fff;
  display: block;
  height: 0;
  border-width: 0 35px 35px;
  border-style: none solid solid;
  border-color: transparent transparent #f04844;
  position: absolute;
  -moz-transform: rotate(-315deg);
  -webkit-transform: rotate(-315deg);
  -o-transform: rotate(-315deg);
  -ms-transform: rotate(-315deg);
  right: -50px;
  top: 16px;
  width: 60px;
}

/* 弹窗 */
.queryBox {
  width: 100%;
  height: 38px;
  line-height: 38px;
  border-left: none;
  border-right: none;
}
.queryBox i {
  font-style: normal;
}
.yearBox {
  border-right: 1px solid #e4e4e4;
}
.disabled {
  background: #ccc;
  color: #fff;
}
.active {
  border: 1px solid #ccc;
  background: #ccc;

}
/* 全部住院医师弹窗 */
.yearSeList {
  text-align: left;
  text-indent: 20px;
}
.yearSeList li {
  height: 45px;
  line-height: 45px;
  border-bottom: 1px solid #ccc;
}
/*缺省图*/
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
  .batchBtn{
    min-width:65px;
  }
  .disabled{
    background:#f2f2f2;
    border:#ccc;

  }
</style>
