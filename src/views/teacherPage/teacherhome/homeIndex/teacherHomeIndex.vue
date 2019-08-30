<template>
  <div class="wrapper">
    <!--header-->
    <div class="header">
      <div class="header-title">
        <van-icon name="arrow-left" @click="arrowLeft"/>
        我的审核情况
        <van-icon name="exchange" size="18px" @click="anySelectClcik" v-if="$store.state.officeList.length > 1"/>
      </div>


        <!-- 选择科室 -->

      <!--弹出框-->
      <transition name="fade">
        <div class="shade" v-if="isShade"></div>
      </transition>
      <div class="dialog" v-if="isDialog">
        <ul class="dialog-content-box">
          <li class="dialog-content-text"
              v-for="(item,index) of $store.state.officeList"
              :class="{'active': $store.state.anySelectDept　==　index}"
              @click.stop="selectDepartId(item,index)"
              :key="index"
          >
            {{item.departmentName}}
            <span class="iconCheck" v-if="$store.state.anySelectDept　==　index"></span>
          </li>
        </ul>
      </div>

      <div class="audit-content">
        <div class="audit-content-left" @click="goAwaitPage">
          <span class="todo-list-color"><van-icon name="todo-list"/></span>
          <ul class="censor-left">
            <li class="censor">{{auditNumRes.waitingAuditNum}}</li>
            <li class="await-censor">待审核</li>
          </ul>
        </div>
        <div class="audit-content-left" @click="goAlreadyPage">
          <span class="checked"><van-icon name="checked"/></span>
          <ul class="censor-left">
            <li class="censor">{{auditNumRes.completeAuditNum}}</li>
            <li class="await-censor">已审核</li>
          </ul>
        </div>
      </div>
    </div>
    <!--轮转情况内容区-->
    <section>
      <div class="section-title">
        <span>我的科室学员轮转情况</span>
        <span>{{this.Global.userInfo.standardDepartment}}</span>
      </div>
      <!--缺省图-->
      <div v-if="!homeDetails||!homeDetails.length" class="miss disFlex">
        <div class="lack disFlex">
          <img :src="imgUrl" alt="">
          暂无学员信息
        </div>
      </div>


      <div class="sectionBox flex1" v-else>
        <van-list
          v-model="loading"
          :finished="finished"
          @load="onLoad"

        >
          <div class="section-content"
               v-for="(item,index) of homeDetails"
               :key="index"
               @click="pageClick(item,index)"
          >
            <!--右侧内容区-->
            <div class="section-content-right">
              <!--姓名信息-->
              <div class="name info">
                <ul class="name-audit info-flex">
                  <p class="frist-name">{{item.studentName}}</p>
                  <li @click.stop="passClick(item)">【 已通过：<span>{{item.allPassedAuditNum}}</span></li>
                  <li class="vertical">|</li>
                  <li @click.stop="waitClick(item)" >待审核：<span class="mark">{{item.allWaitingAuditNum}}</span> 】</li>
                </ul>
              </div>
              <!--参培时间-->
              <div class="time info">
                <ul class="timestart info-flex">
                  <li>参培时间：</li>
                  <li>{{ item.trainStartTime }}</li>
                  <li class="space">|</li>
                  <li>专业:</li>
                  <li>{{item.majorName}}</li>
                </ul>
              </div>
              <!--手术病种技能-->
              <div class="entity info">
                <ul class="entity-skill">
                  <li :class="{'activeTab':!item.diseaseRequireNum}">病种：<span>{{item.diseaseCompleteNum}}{{item.diseaseCompleteNum||item.diseaseRequireNum ?'/':'-'}}{{item.diseaseRequireNum}}</span>
                  </li>
                  <li :class="{'activeTab':!item.skillRequireNum}">技能：<span>{{item.skillCompleteNum}}{{item.skillCompleteNum||item.skillRequireNum?'/':'-'}}{{item.skillRequireNum}}</span>
                  </li>
                  <li :class="{'activeTab':!item.operationRequireNum}">手术：<span>{{item.operationCompleteNum}}{{item.operationCompleteNum ||item.operationRequireNum?'/':'-'}}{{item.operationRequireNum}}</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </van-list>
      </div>

    </section>
  </div>
</template>

<script>
    export default {
        name: 'teacherHomeindex',
        data() {
            return {

                /*列表加载*/
                page:1,
                loading: false,
                finished: false,
                imgUrl: require('../../../../assets/image/defaultStudent.png'),
                isShade: false,
                isDialog: false,
                auditNumRes: {},
                homeDetails: [],
                isActive: false,
                officeList:[],
                iconActive: 0,
                flag: true,
                styleObj: {
                    background: "#ccc"
                },
                slash: "/",
                line: '-'
            }
        },
        computed: {
            styleEvent() {
                let flag = false;
                this.homeDetails.forEach((item) => {
                    if (item.skillRequireNum == null) {
                        flag = !this.isActive;
                    }
                });
                return flag;
            },

        },
        methods: {
            arrowLeft(){
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
            isInApp() {
                if (typeof Elf.AppCallWeb != "undefined") {
                    return !!((window.webkit && window.webkit.messageHandlers) || typeof Elf.WebCallApp == "function" || typeof Elf.WebCallCef == "function");
                }
            },
            /*多科室选择*/
            anySelectClcik() {
                this.isShade = !this.isShade;
                this.isDialog = true;
                this.page = 1;
                this.homeDetails = [];
                this.finished = false;
                // this.Global.userInfo.standardDepartmentId = null;
            },
            //点击学员已通过
            passClick(item) {
                this.$router.push({
                    name: 'teacherAudit',
                    params: {
                        item: item,
                        auditState: 1  //学员审核状态 1为已通过
                    }
                })
            },
            //点击学员待审核
            waitClick(item) {
                this.$router.push({
                    name: 'teacherAudit',
                    params: {
                        item: item,
                        auditState: 0,   //学员审核状态 0为审核
                    }
                })
            },
            onLoad() {},
            pageClick(item, index) {
                this.$router.push({
                    name: 'staticdetail',
                    params: {
                        data: item,
                        type: 1 //统计详情根据类型跳转
                    }
                })
            },
            cancel() {
                this.isShade = false;
                this.isDialog = false;

            },
            selectDepartId(item, index) {
                console.log(index)
                this.$store.state.anySelectDept = index;
                this.Global.userInfo.standardDepartmentId = item.departmentId;
                this.getHomeDetail();
                this.cancel();
            },
            checkActive(item) {
              console.log(item);
              console.log(this.Global.userInfo.standardDepartmentId);
                let deptId = this.Global.userInfo.standardDepartmentId;
                if(!deptId){
                    return false;
                }
                return deptId == item.departmentId;
            },
            goPage() {
                this.$router.push({name: "teacherPerfecInfo"});
            },
            // 待审核 0,审核通过 1
            goAwaitPage() {
                this.$router.push({name: "teacherAudit", params: {type: 0}})
            },
            goAlreadyPage() {
                this.$router.push({name: "teacherAudit", params: {type: 1}})
            },
            /****************数据请求**************************/
            // 先完善信息，再判断多科室
            checkUserDetail() {
                const url = this.api.checkUserDetail;
                this.utils.ajax({
                    url: url,
                    method: "POST",
                    success: (res) => {

                        if (res.code == 0) {
                            this.flag = res.result;
                            if (this.flag) {
                                this.$dialog.alert({
                                    title: "请您先完善个人信息",
                                    message: '完善个人信息后可进行其他操作,\n请点击下方"去完善"',
                                    confirmButtonText: "去完善",
                                    className: 'perfect'
                                }).then(() => {
                                    this.$router.push({name: "teacherPerfecInfo"})
                                })
                            } else {
                                // 信息完善时，获取科室列表
                                this.getUserRelation();
                                //信息完善时不再调取完善信息接口 减少请求
                                this.$store.state.checkInfo = false;


                            }
                        } else {
                            this.$toast(res.msg);
                        }
                    }
                })
            },
            getHomeDetail() {
                this.teacherHome();
                this.page=1;
                this.homeDetails = [];
                this.finished = false;
                this.getStudentRotation();
            },
            teacherHome() {
                // 首页/home接口
                const url = this.api.teacherHomeStatic;
                const postJson = {
                    standardDepartmentId: this.Global.userInfo.standardDepartmentId,
                };
                this.utils.ajax({
                    url: url,
                    method: "POST",
                    data: postJson,
                    success: res => {
                        if (res.code == 0) {
                            this.auditNumRes = res.data;
                        }
                    }
                })
            },

            getStudentRotation() {
                const url = this.api.getStudentRotation;
                const postJson = {
                    standardDepartmentId: this.Global.userInfo.standardDepartmentId,
                    "pageIndex": this.page,
                    "pageSize": 10,
                };
                this.utils.ajax({
                    url: url,
                    method: "POST",
                    data: postJson,
                    success: res => {
                        if (res.code == 0 && res.data) {
                            this.homeDetails = this.homeDetails.concat(res.data.result);
                            this.loading = false;
                            this.page = res.data.page +1;
                        }
                        if (res.data.page === res.data.totalPage) {
                            this.finished = true;
                        }
                    }
                })
            },
            /*查询科室列表*/
            getUserRelation() {
                const url = this.api.getUserRelation;
                this.utils.ajax({
                    url: url,
                    method: "POST",
                    success: (res) => {
                        if (res.code == 0 && res.result) {
                            // 判断是否设置过
                            if (this.Global.userInfo.standardDepartmentId) {
                                this.getHomeDetail();
                                return;
                            }
                            // 获取默认科室id
                            if (res.result.id) {
                                this.Global.userInfo.standardDepartmentId = res.result.id;
                            }
                            this.$store.state.officeList = res.result.relationList;
                            // 多科室时才弹窗
                            if ( this.$store.state.officeList &&  this.$store.state.officeList.length >= 2) {
                                this.isShade = true;
                                this.isDialog = true;
                            } else {
                                this.Global.userInfo.standardDepartmentId =  this.$store.state.officeList[0].departmentId;
                            }
                            /*如果标准科室ID存在就调用审核数量的接口和学生轮转的接口*/
                            if (this.Global.userInfo.standardDepartmentId) {
                                this.getHomeDetail();
                            }

                        }
                    }
                })
            }
        },

        mounted() {

                // 查询信息是否需要完善
                if (this.$store.state.checkInfo == true) {
                    //登录时查询是否完善
                    this.checkUserDetail();
                    //完善后且存在多科室的情况下
                } else if (this.$store.state.checkInfo == false && this.$store.state.officeList.length > 1) {
                    //调取多科室接口
                    this.getUserRelation();
                } else {
                    //如果只是单科室，则只调取审核和学生列表两个接口
                    this.getHomeDetail();
                }
            // 首页active
            this.$store.dispatch("setNewNum", 0);
        },
        activated(){
            //如果审核
            if(this.$store.state.cacheHome){
                this.getUserRelation();
                this.$store.state.cacheHome =false;
            }
        },
        created(){
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
        }
    }

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .wrapper {
    width: 100%;
    height: 100%;
    background: #f2f2f2;
    position: relative;
    display: flex;
    flex-direction: column;
  }

  /*头部*/
  .header {
    width: 100%;
    height: 164px;
    background: #fff;
    padding: 0 10px;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
  }

  /*头部标题*/
  .header-title {
    width: 100%;
    display:flex;
    justify-content: space-between;
    align-items: center;
    height: 2.875rem;
    line-height: 2.875rem;
    font-size: 14px;
    color: #666;
  }

  /*头部内容区*/
  .audit-content {
    width: 100%;
    height: 118px;
    display: flex;
    justify-content: space-evenly;
    align-items: center;

  }

  /*头部图标*/
  .audit-content-left {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;

  }

  /*内容区大图标*/
  .audit-content-left span {
    width: 66px;
    height: 66px;
    background: #006754;
    margin-left: -10px;
    color: #fff;
    font-size: 3rem;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 5px;
  }

  /*内容区文字*/
  .audit-content-left .censor-left {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    margin-left: 10px;
  }


  .censor {
    font-size: 30px;
    color: #333;

  }

  .await-censor {
    font-size: 12px;
    color: #999;
  }

  /*section*/
  section {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
  }

  /*内容区标题*/
  .section-title {
    text-align: left;
    font-size: 14px;
    color: #666;
    height: 54px;
    line-height: 54px;
    padding-left: 10px;
    box-sizing: border-box;
    border: 1px solid #E4E4E4;
  }

  /*内容区主干*/
  .sectionBox {
    overflow-y: scroll;
    -webkit-overflow-scrolling: touch;
  }

  .section-content {
    width: 100%;
    height: 123px;
    background: #fff;
    padding: 22px 0 22px;
    box-sizing: border-box;
    margin-bottom: 12px;
  }

  /*姓名及内容*/
  .section-content-right {
    width: 100%;
    height: 73px;
    padding:0 10px;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
  }



  /*姓名信息*/
  .name {
    width: 100%;
    display: flex;
  }
  .major{
    display: flex;
  }
  .frist-name {
    font-size: 18px;
    color: #333;
  }

  .name-audit {
    width: 100%;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    font-size: 12px;
    color: #666;
  }

  .name-audit span {
    font-size: 16px;
    font-weight: bold;
    color: #333;
  }

  .name-audit .mark {
    color: #ed5e4c;
  }

  .name-audit .vertical {
    padding: 0 0.9rem;
  }

  /*参培时间*/
  .time {
    width: 100%;
    margin: 7px 0;
    display: flex;
  }

  .timestart {
    display: flex;
    width:100%;
    color: #666;
    font-size:12px;
    margin:5px auto;
  }

  .space {
    margin: 0 10px;
  }

  /*手术病种技能*/
  .entity {
    width: 100%;
  }

  .entity-skill {
    display: flex;
    margin:5px 0;
  }

  .entity-skill li {
    width:100%;
    height: 20px;
    border-radius: 10px;
    text-align: center;
    line-height: 20px;
    font-size: 12px;
    margin-right:5px;
    color: #fff;
    background: #1DA29A;
  }
  .entity-skill li:last-of-type{
    margin-right:0;
  }
  .entity-skill .activeTab {
    background: #ccc;
  }

  /*缺省图片*/
  .miss {
    width: 100%;
    height: calc(100% - 90px);
    justify-content: center;
    align-items: center;
  }

  .lack {
    width: 220px;
    height: 180px;
    flex-direction: column;
    font-size: 18px;
    color: #999;
  }

  .lack img {
    width: 100%;
  }


  .shade {
    width: 100%;
    height: 100%;
    background: black;
    opacity: 0.7;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 1700;
  }

  .fade-enter-active, .fade-leave-active {
    transition: opacity .4s;
  }

  .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */
  {
    opacity: 0;
  }
  .dialog {
    position: absolute;
    left: 50%;
    top: 40%;
    width: 200px;
    height: auto;
    max-height: 140px;
    overflow-y: scroll;
    -webkit-overflow-scrolling: touch;
    background: #fff;
    margin: auto;
    transform: translate(-50%, -50%);
    z-index: 2000;
    border-radius: 7px;
  }
  .dialog-content-box {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-evenly;
    width: 200px;
    border-radius: 5px;
    background: #fff;
    padding: 0 10px;
    font-size: 13px;
    box-sizing: border-box;
  }
  .dialog-content-box li{
    position: relative;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    line-height: 35px;
    border-bottom: 1px solid #ccc;
    box-sizing: border-box;
  }
  .dialog-content-box li:last-child{
    border-bottom: none;
  }
  .active {
    color: #1DA29A;
  }
  .dialog-content-text .iconCheck {
    display: block;
    width: 8px;
    height: 16px;
    position: absolute;
    right: 0;
    top: 50%;
    border-color: #1DA29A;
    border-style: solid;
    border-width: 0 3px 3px 0;
    transform: rotate(45deg) translate(-50%,-50%);
  }
</style>


