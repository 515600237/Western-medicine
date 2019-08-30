<template>
  <div class="wrapper">
    <van-nav-bar
      left-arrow
      @click-left="onClickLeft"
            title="住培过程管理系统(西医)"
    >
      <van-icon name="cluster" slot="right" @click="headIconEvent()" v-if="false"/>
    </van-nav-bar>
      <!--弹出框-->
    <transition name="fade">
      <div class="shade" v-if="isShade" @click="shadeEvent"></div>
    </transition>
    <!-- 右上角选择栏 -->
     <div class="dialog" v-if="isDialog">
          <ul class="dialog-content-box">
           <li class="dialog-content-text"
               v-for="(item,index) of textList"
               :class="{'active':iconActive　==　item}"
               @click="headGoPage(item,index)"
               :key ="index"
           >
             {{item}}
           </li>
          </ul>
     </div>
     <!-- 轮播图 -->
    <van-swipe :autoplay="autoplay"
               indicator-color="white" class="swipeBox"  v-if="swiperList && swiperList.length">
      <van-swipe-item v-for = "(item,index) of swiperList" :key="index"
                  :style="getImgPos(item)"
                  @touchstart="swiperStart($event,item)"    @touchend="swiperEnd($event,item)"
      >
        <img v-lazy="item.image_source"
             alt="item.image_name"
             class="swipeImg">
      </van-swipe-item>
    </van-swipe>

    <!-- 中间内容 -->
    <div class="homeCtBox disFlex" :class="{'hasSwiper':swiperList&&swiperList.length}">
      <van-row type="flex" justify="space-between" class="writeInBox">
        <van-col class="writeInBtn writeRotationBtn disFlex" @click.native="goPage('/studentHome/rotation',1)">
            <div class="enter_icon">
              <van-icon name="todo-list-o"/>
            </div>
            <div class="enter_text flex1">
              <span>录入</span>
              <p>轮转计划</p>
            </div>
        </van-col>
        <van-col class="writeInBtn  disFlex" @click.native="goPage('/studentHome/medicalAdd',2)">
            <div class="enter_icon">
              <van-icon name="records"/>
            </div>
            <div class="enter_text flex1">
              <span>录入</span>
              <p class="enter_text-right">病种/技能/手术</p>
            </div>
        </van-col>
      </van-row>

      <van-tabs type="card"   class="deptTapBox flex1 disFlex" >
        <van-tab title="当前轮转科室">
          <div v-if="stuResult.currentRotationScheduleId">
            <van-row type="flex" justify="space-between" class="absence" >
              <van-col span="12" class="text-left currentRoTime">
                <van-icon name="calender-o"/>
                <span>{{stuResult.currDepartStartTime}}</span>
                <hr>
                <span>{{stuResult.currDepartEndTime}}</span>
              </van-col>
              <van-col span="8">
                缺勤天数:
                <span>{{stuResult.currDepartAbsenceDaysNum ?stuResult.currDepartAbsenceDaysNum:'0'}}天</span>
              </van-col>
            </van-row>
            <h2 class="title_large">{{stuResult.currentDepartName}}</h2>
            <!--内容区-->
            <div class="DiseaseItemBox van-hairline--bottom">
              <h5 class="title_small">病种完成情况</h5>
              <van-row type="flex" justify="space-between">
                <van-col span="6" @click.native="goCurrentDep(0)">
                  <p>
                    <span class="text-color">{{stuResult.currDepartDiseaseCompleteCase}}
                    </span>/
                    {{stuResult.currDepartDiseaseRequireCase | staticShowNum}}
                  </p>录入例数
                </van-col>
                <van-col span="6" @click.native="goCurrentDep(0)">
                  <p>
                    <span class="text-color">{{stuResult.currDepartDiseaseCompleteRate ?stuResult.currDepartDiseaseCompleteRate+'%':'-'}}</span>
                  </p>疾病种类完成率
                </van-col>
                <van-col span="6" @click.native="goCurrentDep(0)">
                  <p>
                    <span class="text-color">{{stuResult.currDepartDiseaseCompleteCaseRate?stuResult.currDepartDiseaseCompleteCaseRate+'%':'-'}}</span>
                  </p>疾病例数完成率
                </van-col>
              </van-row>
            </div>
            <div class="DiseaseItemBox van-hairline--bottom">
              <h5 class="title_small">临床技能完成情况</h5>
              <van-row type="flex" justify="space-between">
                <van-col span="6" @click.native="goCurrentDep(1)">
                  <p>
                    <span class="text-color">{{stuResult.currDepartSkillCompleteCase}}
                    </span>/
                    {{stuResult.currDepartSkillRequireCase | staticShowNum}}
                  </p>录入例数
                </van-col>
                <van-col span="6" @click.native="goCurrentDep(1)">
                  <p>
                    <span class="text-color">{{stuResult.currDepartSkillCompleteCaseRate?stuResult.currDepartSkillCompleteCaseRate+'%':'-'}}</span>
                  </p>完成率
                </van-col>
                <van-col span="6"></van-col>
              </van-row>
            </div>
            <div class="DiseaseItemBox van-hairline--bottom">
              <h5 class="title_small">手术完成情况</h5>
              <van-row type="flex" justify="space-between">
                <van-col span="6" @click.native="goCurrentDep(2)">
                  <p>
                    <span class="text-color">{{stuResult.currDepartOperationCompleteCase}}
                    </span>/
                    {{stuResult.currDepartOperationRequireCase | staticShowNum}}
                  </p>录入例数
                </van-col>
                <van-col span="6" @click.native="goCurrentDep(2)">
                  <p>
                    <span class="text-color">{{stuResult.currDepartOperationCompleteCaseRate?stuResult.currDepartOperationCompleteCaseRate+'%':'-'}}</span>
                  </p>完成率
                </van-col>
                <van-col span="6">
                  <p>
                    <span></span>
                  </p>
                </van-col>
              </van-row>
            </div>
          </div>
          <div v-else  class="no-content">
            <div class="img-box">
              <img src="../../../../assets/image/defaultStudent.png" alt="">
              <p>暂无轮转计划</p>
            </div>
          </div>
        </van-tab>

        <!--全部科室内容-->
        <van-tab title="全部轮转科室">
          <div v-if="stuResult">
            <van-row type="flex" justify="space-between" class="absence" >
              <h2 class="title_large title-sec">
                已轮转科室
                <b>{{stuResult.completeRotatedDepartNum}}</b>
                <span v-if="false">
                 /
                {{stuResult.allRequireRotateDepartNum}}
              </span>
              </h2>
              <van-col span="8">
                缺勤天数:
                <span>{{stuResult.allDepartAbsenceDaysNum?stuResult.allDepartAbsenceDaysNum:'0'}}天</span>
              </van-col>
            </van-row>

            <!--内容区-->
            <div class="DiseaseItemBox van-hairline--bottom">
              <h5 class="title_small">病种完成情况</h5>
              <van-row type="flex" justify="space-between">
                <van-col span="6" @click.native="goAllDep(0)">
                  <p>
                    <span class="text-color">{{stuResult.allDepartDiseaseCompleteCase}}
                    </span>/
                    {{stuResult.allDepartDiseaseRequireCase | staticShowNum}}
                  </p>
                  录入例数
                </van-col>
                <van-col span="6" @click.native="goAllDep(0)">
                  <p>
                    <span class="text-color">{{stuResult.allDepartDiseaseCompleteRate?stuResult.allDepartDiseaseCompleteRate+'%':'-'}}</span>
                  </p>疾病种类完成率
                </van-col>
                <van-col span="6" @click.native="goAllDep(0)">
                  <p>
                    <span class="text-color">{{stuResult.allDepartDiseaseCompleteCaseRate?stuResult.allDepartDiseaseCompleteCaseRate+'%':'-'}}</span>
                  </p>疾病例数完成率
                </van-col>
              </van-row>
            </div>
            <div class="DiseaseItemBox van-hairline--bottom">
              <h5 class="title_small">临床技能完成情况</h5>
              <van-row type="flex" justify="space-between">
                <van-col span="6" @click.native="goAllDep(1)">
                  <p>
                    <span class="text-color">{{stuResult.allDepartSkillCompleteCase}}
                    </span>/
                    {{stuResult.allDepartSkillRequireCase  | staticShowNum}}
                  </p>录入例数
                </van-col>
                <van-col span="6" @click.native="goAllDep(1)">
                  <p>
                    <span class="text-color">{{stuResult.allDepartSkillCompleteCaseRate?stuResult.allDepartSkillCompleteCaseRate+'%':'-'}}</span>
                  </p>完成率
                </van-col>
                <van-col span="6">
                  <p>
                    <span></span>
                  </p>
                </van-col>
              </van-row>
            </div>
            <div class="DiseaseItemBox van-hairline--bottom">
              <h5 class="title_small">手术完成情况</h5>
              <van-row type="flex" justify="space-between">
                <van-col span="6" @click.native="goAllDep(2)">
                  <p>
                    <span class="text-color">{{stuResult.allDepartOperationCompleteCase}}

                    </span>/
                    {{stuResult.allDepartOperationRequireCase  | staticShowNum}}
                  </p>录入例数
                </van-col>
                <van-col span="6" @click.native="goAllDep(2)">
                  <p>
                    <span class="text-color">{{stuResult.allDepartOperationCompleteCaseRate?stuResult.allDepartOperationCompleteCaseRate+'%':'-'}}</span>
                  </p>完成率
                </van-col>
                <van-col span="6">
                  <p>
                    <span></span>
                  </p>
                </van-col>
              </van-row>
            </div>
          </div>
          <div v-else  class="no-content">
            <div class="img-box">
              <img src="../../../../assets/image/defaultStudent.png" alt="">
            </div>
          </div>
        </van-tab>
      </van-tabs>
    </div>
  </div>
</template>

<script>
import {mapGetters, mapMutations, mapActions} from 'vuex'

export default {
  name: "homeindex",
  data() {
    return {
      textList:["电子轮转手册","年度业务水平测试","医学电子书包"],
      isActive:0,
      active: 0,
      autoplay:3000,
      list: [],
      loading: false,
      finished: false,
      swiperList:[
        {image_name:"",image_source: require("@/assets/image/default.png")}
      ],
      stuResult:{},
      isDialog:false,
      isShade:false,
      iconActive:'电子轮转手册',
      clientX: 0,
      myInfo:{}
    };
  },
  methods: {
      isInApp() {
          if (typeof Elf.AppCallWeb != "undefined") {
              return !!((window.webkit && window.webkit.messageHandlers) || typeof Elf.WebCallApp == "function" || typeof Elf.WebCallCef == "function");
          }
      },
      onClickLeft(){
          this.$dialog
              .confirm({
                  message: "确定要退出过程管理吗"
              })
              .then(() => {
                  if(this.isInApp()){
                      this.webApp.WebCallApp("TabbarShow", {}, (res) => {});
                      this.webApp.WebCallApp("CmdGoBack", {}, (res) => {});
                  }
              })
              .catch(() => {

              });
      },
    shadeEvent(){
      this.isShade = false;
      this.isDialog = !this.isDialog;
    },
    headIconEvent(){
      this.isDialog = !this.isDialog;
      this.isShade = !this.isShade;
    },
    headGoPage(item,index){
      this.iconActive = item;
      if(index==0){
        /*电子轮转手册跳转页面*/
      /*  this.$router.push({name:'rotation'})*/
      }
      if(index==1){
        /*年度业务水平跳转页面*/
      /*  this.$router.push({path:''})*/
      }
      if(index==2){
        /*医学电子书包跳转页面*/
       /* this.$router.push({path:''})*/
      }
    },
    ...mapMutations({ setNum : "setNum"}),
    setActiveFooter(){
      const num= Math.floor(Math.random()*3);
      this.setNum(num);
    },
    setCurrentDep(){
      //存储从哪个页面进入
      this.$store.state.deaseListPagePre = 1;
      // 存储当前状态
      this.Global.currentItem = {
          depDetailType: 1,
          currentDepartId: this.stuResult.currentDepartId,
          departmentName: this.stuResult.currentDepartName,
          currentScheduleId: this.stuResult.currentRotationScheduleId,
      };

    },
    goPage(path,type) {
      //默认显示病种
      this.$store.dispatch("setNewType",0);
      this.setCurrentDep();
      // 跳轮转计划
      if( type == 1){
          this.$store.state.rotationDateJson = {
            year: "",
            month: ""
          };
          this.$router.push({ path: path, query: {'homeindex': true} });
      }
      //病种技能手术，设置为新增页面
      if(type == 2){
         this.$store.state.medicalPageType =1;
         this.$router.push({ path: path});
      }
    },
    goCurrentDep(type) {
      /*录入例数*/
      //setNewType  设置医疗信息列表页面tab值
      this.$store.dispatch("setNewType",type);
      this.setCurrentDep();
      this.$router.push(
          {
            name: "medicaList",
            params:{
              medListTabType: type
            }
          },
      );
    },
    goAllDep(type) {
      // 存储当前状态
      this.Global.currentItem = {
          depDetailType: 2,
          currentDepartId: null,
          departmentName: this.stuResult.currentDepartName,
          currentScheduleId: this.stuResult.currentRotationScheduleId,
      };

      this.$router.push(
          {
            name: "medicaList" ,
            params:{
              medListTabType: type
            }
          },
        );
    },
    // 首页轮播图
    getImgPos(item){
      // let clientWidth =document.documentElement.clientWidth;
      return {"background": "url("+item.image_source+")" + " no-repeat center center",}
      // "background-size":"100% 100%"
    },
    swiperStart(event,item){
       let target = event.targetTouches[0];
       this.clientX = target.clientX;
       console.log(this.clientX);
    },
    swiperEnd(event,item){
      console.log(event);
      let target = event.changedTouches[0];
      let clientX= target.clientX;
      let distance = Math.abs(clientX - this.clientX);
      console.log(distance);
      if(distance<20){
          this.swipeClick(item);
      }
    },
    swipeClick(item){
      if(!item.contentId){
          return;
      }
      this.$router.push({
          path:"/studentHome/newInformation",
          query:{
            contentId:item.contentId
          }
      })
    },

    /****************数据请求*********************/
    //轮播图
    swiper(){
      const url = this.api.swiper;
      this.utils.ajax({
        url:url,
        method:"POST",
        success:res=>{
          if(res.code == 0){
             this.swiperList = res.data;
          }
        }
      })
    },
    //完成率情况
    homeStudentInfo(){
      const url = this.api.homeStudentInfo;
      this.utils.ajax({
        url:url,
        method:"post",
        success:res=>{
          if(res.code == 0){
            this.stuResult = res.data;
          }
        }
      })
    },
    // 我的设置，获取用户信息
    getUserInfo() {
        const url = this.api.mysetInfo;
        const postJson = {
            userId: this.Global.userId,
            userType: this.Global.userType,
        };
        this.utils.ajax({
            url: url,
            method: "POST",
            data: postJson,
            success: res => {
                console.log(res);
                this.myInfo = Object.assign({},this.myInfo,res.result);
                this.Global.myInfo = this.myInfo;
            }
        });
    }
  },
  created() {
      this.swiper();
      this.homeStudentInfo(this.Global.userInfo.userId);
      this.$store.dispatch("setNewNum",0);
      if(this.isInApp()){
          this.webApp.WebCallApp("TabbarHiddent", {}, (res) => {
          });
      }
      let url =  window.location.href;
      this.$store.state.urlObj = this.utils.urlObj(url);
      if( this.$store.state.urlObj){
          this.$store.state.token = this.$store.state.urlObj.token
          this.$store.state.imei = this.$store.state.urlObj.imei
          this.$store.state.project = this.$store.state.urlObj.project
          this.$store.dispatch("setNewToken", this.$store.state.token);
          this.$store.dispatch("setNewImei",  this.$store.state.imei);
          this.$store.dispatch("setNewProject",this.$store.state.project)
          console.log(this.$store.state.token,"token存在", this.$store.state.imei,this.$store.state.project )
      }


  },
  mounted(){
      this.getUserInfo();  //获取个人基本信息

  },
   beforeRouteLeave(to, from, next) {
      // 设置下一个路由的 meta
      if(to.name == "newInformation"){
        from.meta.keepAlive = true;
      }else{
        from.meta.keepAlive = false;
      }
      next();
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .shade{
    width:100%;
    height:100%;
    background:black;
    opacity: 0.7;
    position: absolute;
    top:0;
    left:0;
    z-index:1700;
  }
  .fade-enter-active, .fade-leave-active {
    transition: opacity .4s;
  }
  .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
    opacity: 0;
  }

    .dialog{
        width:182px;
        height:124px;
        background:#fff;
        position:absolute;
        right:0;
        opacity: 1;
        top:calc(2.875rem + 7px);
        z-index:2000;
        border-radius: 7px;
    }
    .dialog-content-box{
      display:flex;
      width:182px;
      height:124px;
      background:#fff;
      flex-direction: column;
      align-items: flex-start;
      justify-content: space-evenly;
      padding: 0 10px;
      font-size:13px;
      box-sizing: border-box;
    }
    .dialog::before{
      content:"";
      border:8px solid transparent;
      border-bottom-color: #fff;
      position: absolute;
      right:15px;
      top:-16px;
      z-index:2000;
    }
    .dialog-content-text{
      width:100%;
      text-align: left;
    }
    .dialog-content-text:nth-of-type(1){
      border-bottom:1px solid #ccc;
      padding-bottom:6px;
      box-sizing:border-box;
    }
    .dialog-content-text:nth-of-type(2){
      box-sizing: border-box;
      padding-bottom:6px;
      border-bottom:1px solid #ccc;
    }
    .active{
      color:#1DA29A;
    }
    .wrapper /deep/ .van-icon-cluster{
      font-size:20px;
      color:#1DA29A;
    }
    .wrapper /deep/ .van-nav-bar__title{
      font-weight: 600;
    }
  .swipeBox {
    width: 100%;
    height: 120px;
    line-height: 120px;
    font-size: 30px;
  }
  .swipeBox /deep/ .van-swipe-item{
      position: relative;
  }
  .swipeImg{
    position: absolute;
    top: 0px;
    left: 0px;
    display: none;
  }
/*修改过的*/
.wrapper /deep/ .van-col {
  font-size: 12px;
}
.wrapper /deep/ .van-tabs__wrap .van-tabs__nav {
  width: 100%;
  margin: 0;
}
/*上面内容是修改过的*/
.wrapper /deep/ .van-cell__title span {
  font-weight: 900;
  font-size: 18px;
}
.wrapper /deep/ .van-cell__label {
  margin: 10px 0;
}
.desk {
  text-align: left;
}

.absence {
  margin-top: 12px;
  text-align: center;
}
.homeCtBox{
  position: absolute;
  top: 46px;
  left: 0;
  right: 0;
  bottom: 50px;
  width: 100%;
  padding: 12px 12px 0;
  flex-direction: column;
}
.homeCtBox.hasSwiper{
  top: 166px;
}
.homeCtBox /deep/ .van-tab{
    height: 30px;
    line-height: 30px;
}
.writeInBox {
  height: 80px;
  margin-bottom: 14px;
}
.writeInBtn {
  width: 170px;
  height: 80px;
  background: #006754;
  color: #fff;
  border-radius: 6px;
}
.writeRotationBtn{
  background: #E9660F;
}
.deptTapBox {
  flex-direction: column;
}
.deptTapBox /deep/ .van-tabs__content {
  flex: 1;
  -webkit-flex: 1;
  -moz-flex: 1;
  overflow-y: scroll;
  -webkit-overflow-scrolling: touch;
}
.deptTapBox /deep/ .van-tab__pane{
  height: 100%;
}
/* 轮转时间 */
.currentRoTime{
  display: flex;
  align-items: center;
}
.currentRoTime .van-icon-calender-o{
  margin-right: 5px;
}
.currentRoTime hr{
  width: 24px;
  padding: 0;
  margin:0  1px;
}
/*底部内容栏容器*/
.title_large {
  text-align: left;
  font-weight: bold;
  margin-top: 10px;
}
.DiseaseItemBox {
  width: 100%;
  height: 80px;
}
.DiseaseItemBox .van-row {
  margin: 10px 0;
}
/*病种完成情况*/
.title_small {
  font-size: 12px;
  text-align: left;
  color: #ccc;
  margin-top: 10px;
}
.absence .title-sec {
  margin-top: -6px;
  font-size: 18px;
}
.absence .title-sec b {
  margin-left: 10px;
  font-size: 18px;
}
.absence .title-sec span {
  font-size: 12px;
}
.box100 {
  display: flex;
}
.enter_icon {
  width: 50px;
  height: 100%;
  padding-top: 22px;
  font-size: 40px;
  box-sizing: border-box;
  text-align: right;
}
.enter_text{
    padding-top: 22px;
    padding-left: 10px;
    text-align: left;
}
.enter_text span {
  font-size: 16px;
  font-weight: bold;
}
.enter_text p{
  font-size: 16px;
  font-weight: bold;
}
.wrapper /deep/ .van-col--6 {
  text-align: left;
}
  .no-content{
    width:100%;
    height:100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .img-box{
    overflow: hidden;
    padding:30px 0;
    box-sizing: border-box;
  }
  .img-box img{
    max-width:100%;
  }
   .disabled{
    color:#ccc !important;

  }
  .text-color{
    font-size: 24px;
    color: #1DA29A;
  }
</style>
