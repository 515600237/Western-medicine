<template>
  <div class="wrapper">
    <van-nav-bar
      :title="title"
      left-text="返回"
      right-text="录入"
      left-arrow
      @click-left="goPage(1)"
      @click-right="goPage(2)"
    >
      <van-button size="small" slot="right" class="btnSave" :class="{'animation-btn':isAnimation}">录入</van-button>
    </van-nav-bar>
      <div v-if="deptType==1" class="current-dept-time">
          {{this.startTime}}----{{this.endTime}}
      </div>
    <div class="DetailsContent" :style="{'top':(deptType==2 ? '2.875rem' :'4.875rem')}">
      <!--  三个标签页-->
      <van-tabs type="card" class="header-nav"
                v-model="activeTab"
                @change="tabChange"
      >
        <!-- 标签标题-->
        <van-tab :title="item"
                 v-for="(item,index) in tabsTitle"
                 :key="index"
        >
        </van-tab>
      </van-tabs>
      <div class="contentBox">

        <!--缺省图-->
        <div v-if="(activeTab==0  && !deaseList.length)||(activeTab==1  && !skillList.length)||(activeTab==2 &&!operateList.length)">
          <div class="lose-img">
            <div class="img-box">
              <img src="../../../../assets/image/defaulTentering.png" alt="">
            </div>
            <p class="lose-text">暂无信息</p>
          </div>
        </div>

        <!-- 标签页内容区-->
        <div class="nav-content" v-show="activeTab==0">
          <div class="noPassBox" v-if="deptType==1 && deaseAttach && deaseAttach>0">
            <span >有{{deaseAttach}}例 [病种] 未通过,<i @click="lookNopass()">点击查看</i></span>
            <van-icon name="clear" class="fr closeNopass" @click="closeNopass()"/>
          </div>
          <div class="tab-content">
            <van-list
              v-model="loading"
              :finished="finished"
              :offset="30"
              :error.sync="error"
              error-text="请求失败"
              :finished-text="text"
              @load="onLoad"
            >
              <!---->
              <div v-for="(item,index) in deaseList" :key="index" >
                <div class="submit-time">
                  <div class="submit-time-all time-second">
                    <ul class="submit-time-left">
                      <van-icon name="todo-list-o" size="16"/>
                      <li>提交时间：</li>
                      <li>{{item.createTime}}</li>
                      <li>|</li>
                    </ul>

                    <ol class="time-second-right">
                      <li class="fl">{{item.auditStateTitle}}</li>
                      <li class="modifyBtn_li fr">
                        <van-button  v-if="item.auditState == 0" @click="goModify(item)" class="btnSave">修改</van-button>
                      </li>
                      <!-- 是否属实 -->
                      <li class="nottrue" v-if="item.auditState ==2"></li>
                    </ol>
                  </div>
                </div>
                <demo :msg="item.createTime"
                      :auditStatus="item.auditStateTitle"
                      :flag="item.auditState !== 0"
                      :type="item.auditState==0"
                      v-bind:styleObj="item.auditState | objStyle"
                >
                </demo>
                <table-list :items="myList" :list="myKey"></table-list>
                <ul class="office-message">
                  <li v-if="item.auditByName" :class="{highlight:item.auditState == 2}">审核人:</li>
                  <span v-if="item.auditByName" :class="{textcolor:item.auditState ==2}">{{item.auditByName}}</span>
                  <li v-if="item.auditTime" :class="{highlight:item.auditState == 2}">审核时间:</li>
                  <span v-if="item.auditTime" :class="{textcolor:item.auditState == 2}">{{item.auditTime}}</span>
                  <li v-if="item.auditReason" :class="{highlight:item.auditState ==2}">审核意见:</li>
                  <span v-if="item.auditReason" :class="{textcolor:item.auditState == 2}">{{item.auditReason}}</span>
                  <li>科室:</li>
                  <span>{{item.departmentName}}</span>
                  <li>就诊方式:</li>
                  <span>{{item.accessModeTitle}}</span>
                  <li>病种:</li>
                  <span>{{item.mainDiseaseName}}</span>
                  <li>就诊时间:</li>
                  <span>{{item.visitTime}}</span>
                  <li v-if="item.accessMode == 3">是否全程管理:</li>
                  <span v-if="item.accessMode == 3">{{item.manageWholeProcessTitle}}</span>
                  <li v-if="item.accessMode == 3">书写大病历:</li>
                  <span v-if="item.accessMode == 3">{{item.writeMajorMedicalRecordTitle}}</span>
                  <li>病历号:</li>
                  <span>{{item.medicalRecordNo}}</span>
                </ul>
              </div>
            </van-list>
          </div>
        </div>
          <!--临床技能-->
        <div class="nav-content" v-show="activeTab==1">
          <div class="noPassBox" v-if="deptType==1 && skillAttach &&  skillAttach > 0">
            <span >有{{skillAttach}}例 [临床技能操作] 未通过,<i @click="lookNopass()">点击查看</i></span>
            <van-icon name="clear" class="fr closeNopass" @click="closeNopass()"/>
          </div>
          <div class="tab-content">
            <van-list
              v-model="loading1"
              :finished="finished1"
              :offset="30"
              :error.sync="error1"
              error-text="请求失败"
              :finished-text="text1"
              @load="onLoad1"
            >
              <div v-for="(item,index) in skillList" :key="index">
                <div class="submit-time">
                  <div class="submit-time-all time-second">
                    <ul class="submit-time-left">
                      <van-icon name="todo-list-o"/>
                      <li>提交时间：</li>
                      <li>{{item.createTime}}</li>
                      <li>|</li>
                    </ul>
                    <ol class="time-second-right">
                      <li class="fl">{{item.auditStateTitle}}</li>
                      <li class="modifyBtn_li fr">
                        <van-button  v-if="item.auditState == 0" @click="goModify(item)" class="btnSave">修改</van-button>
                      </li>
                      <!-- 是否属实 -->
                      <li class="nottrue" v-if="item.auditState ==2"></li>
                    </ol>
                  </div>
                </div>
                <ul class="office-message">
                  <li v-if="item.auditByName" :class="{highlight:item.auditState==2}">审核人:</li>
                  <span v-if="item.auditByName" :class="{textcolor:item.auditState==2}">{{item.auditByName}}</span>
                  <li v-if="item.auditTime" :class="{highlight:item.auditState==2}">审核时间:</li>
                  <span v-if="item.auditTime" :class="{textcolor:item.auditState==2}">{{item.auditTime}}</span>
                  <li v-if="item.auditReason" :class="{highlight:item.auditState==2}">审核意见:</li>
                  <span v-if="item.auditReason" :class="{textcolor:item.auditState==2}">{{item.auditReason}}</span>
                  <li>科室:</li>
                  <span>{{item.departmentName}}</span>
                  <li>临床技能操作名称:</li>
                  <span>{{item.skillName}}</span>
                  <li>就诊时间:</li>
                  <span>{{item.operateTime}}</span>
                  <li>病历号:</li>
                  <span>{{item.medicalRecordNo}}</span>
                </ul>
              </div>
            </van-list>
          </div>
        </div>
        <!--手术-->
        <div class="nav-content" v-show="activeTab==2">
          <div class="noPassBox" v-if="deptType==1 && operationAttach && operationAttach>0">
            <span>有{{operationAttach}}例 [手术] 未通过,<i @click="lookNopass(2)">点击查看</i></span>
            <van-icon name="clear" class="fr closeNopass" @click="closeNopass()"/>
          </div>
          <div class="tab-content">
            <van-list
              v-model="loading2"
              :finished="finished2"
              :offset="30"
              :error.sync="error2"
              error-text="请求失败"
              :finished-text="text2"
              @load="onLoad2"
            >
              <div v-for="(item,index) in operateList" :key="index">
                <div class="submit-time">
                  <div class="submit-time-all time-second">
                    <ul class="submit-time-left">
                      <van-icon name="todo-list-o"/>
                      <li>提交时间：</li>
                      <li>{{item.createTime}}</li>
                      <li>|</li>
                    </ul>
                    <ol class="time-second-right">
                      <li class="fl">{{item.auditStateTitle}}</li>
                      <li class="modifyBtn_li fr">
                        <van-button  v-if="item.auditState == 0" @click="goModify(item)" class="btnSave">修改</van-button>
                      </li>
                      <!-- 是否属实 -->
                      <li class="nottrue" v-if="item.auditState ==2"></li>
                    </ol>
                  </div>
                </div>
                <ul class="office-message">

                  <li v-if="item.auditByName" :class="{highlight:item.auditState==2}">审核人:</li>
                  <span v-if="item.auditByName" :class="{textcolor:item.auditState==2}">{{item.auditByName}}</span>
                  <li v-if="item.auditTime" :class="{highlight:item.auditState==2}">审核时间:</li>
                  <span v-if="item.auditTime" :class="{textcolor:item.auditState==2}">{{item.auditTime}}</span>
                  <li v-if="item.auditReason" :class="{highlight:item.auditState==2}">审核意见:</li>
                  <span v-if="item.auditReason" :class="{textcolor:item.auditState==2}">{{item.auditReason}}</span>
                  <li>科室:</li>
                  <span>{{item.departmentName}}</span>
                  <li>手术名称:</li>
                  <span>{{item.operationName}}</span>
                  <li>角色:</li>
                  <span>
                   <i v-if="item.operationRole ==1">主刀</i>
                   <i v-if="item.operationRole ==2">助手</i>
                </span>
                  <li>手术类型:</li>
                  <span>
                  <i v-if="item.operationType ==1">门诊</i>
                  <i v-if="item.operationType ==2">急诊</i>
                  <i v-if="item.operationType ==3">住院</i>
                </span>
                  <li>手术时间:</li>
                  <span>{{item.operationTime}}</span>
                  <li>病历号:</li>
                  <span>{{item.medicalRecordNo}}</span>
                </ul>
              </div>
            </van-list>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
  import demo from "@/components/demo.vue"
  import tableList from "@/components/table-list.vue"
    export default {
        name: "medicaList",
        components:{
            demo,
           tableList,
        },
        data() {
            return {
                oneList:[],
                myList:{},
                goList:{
                    num:3,
                    accessMode: 1,
                    accessModeTitle: "门诊",
                    auditBy: null,
                    auditByName: null,
                    auditReason: null,
                    auditState: 0,
                    auditStateTitle: "待审核",
                    auditTime: null,
                    createTime: "2019-08-29 10:56:43",
                    departmentId: 716,
                    departmentName: "普通外科",
                    emergencyCase: null,
                    id: 38,
                    inHospitalTime: null,
                    mainDiseaseId: 6612,
                    mainDiseaseName: "急性淋巴管炎、淋巴结炎",
                    mainOtherDiseaseName: null,
                    manageWholeProcess: 1,
                    manageWholeProcessTitle: "是",
                    medicalRecordNo: "45646543213",
                    orgId: 2897,
                    outHospitalTime: null,
                    patientBelongType: null,
                    patientName: null,
                    rescue: null,
                    secondaryDiseaseId1: null,
                    secondaryDiseaseId2: null,
                    secondaryDiseaseId3: null,
                    secondaryDiseaseId4: null,
                    secondaryDiseaseList: null,
                    secondaryDiseaseName1: null,
                    secondaryDiseaseName2: null,
                    secondaryDiseaseName3: null,
                    secondaryDiseaseName4: null,
                    secondaryOtherDiseaseName1: null,
                    secondaryOtherDiseaseName2: null,
                    secondaryOtherDiseaseName3: null,
                    secondaryOtherDiseaseName4: null,
                    shortRotationScheduleDto: null,
                    studentId: 39725,
                    studentName: null,
                    visitTime: "2019-08-29",
                    writeMajorMedicalRecord: 1,
                    writeMajorMedicalRecordTitle: "是"
                },
                myKey:{},
                isAnimation:false,
                /*头部时间*/
                startTime:'',
                endTime:'',
                activeTab: 0,
                title: "全部录入情况",
                // 当前科室1，全部科室2
                deptType:1,
                currentDepartId:null,
                time: "",
                tabsTitle:["病种","临床技能操作","手术"],
                deaseAttach:0,
                skillAttach: 0,
                operationAttach: 0,
                // 病种
                deaseList: [],
                skillList: [],
                operateList: [],
                page:1,//病种   分页
                page1:1,//技能
                page2:1,//手术
                loading:false,//加载中
                finished:false,//加载结束
                error:false,//病种
                finished1:false,
                loading1:false,
                error1:false,//技能
                finished2:false,
                loading2:false,
                error2:false,//手术
                text:'',/*上拉加载的文本*/
                text1:'',
                text2:''
            };
        },
        created(){

            /*auditState:1 审核通过    2：审核未通过  0是待审核*/
            this.currentItem = this.Global.currentItem;
            this.deptType = this.Global.currentItem.depDetailType;
            //根据录入情况，显示对应的tab
            let medListTabType = this.$route.params.medListTabType;
            if(medListTabType){
              medListTabType = Number(medListTabType);
              if([0,1,2].includes(medListTabType)){
                  this.activeTab = medListTabType;
              }
            }

            // 当前科室1，全部科室2, title和统计数量
            if(this.deptType == 1){
                this.title = this.Global.currentItem.departmentName;
                this.currentDepartId =this.Global.currentItem.currentDepartId;
                this.currentStatistics();
            }else{
                this.currentDepartId = null;
                this.title= "全部录入情况";
                this.recordStatistics();
            }
        },
        //录入，保存，返回，修改，返回，保存，删除。
       //录入返回，修改返回，使用保存的页面 同一个事件
        beforeRouteEnter(to, from, next){
            // 新增，修改医疗信息返回，使用状态保持
            if(from.name == "medicalAdd" && from.meta.isBack == true ){
               to.meta.keepAlive= true;
              }else{
                to.meta.keepAlive= false;
              }
              // 从首页第一次进入该页面使用状态保持
              if(from.name =="homeindex" && from.meta.isBack == true){
                  to.meta.keepAlive= true;
                  from.meta.isBack = false;
              }
              next();
        },
        beforeRouteLeave(to, from, next) {
            to.meta.isBack = false;
            next();
        },
        methods: {
            onLoad(){
                /*默认加载病种*/
                this.getDeaseList(-1,true);
            },
            onLoad1(){
                this.getSkillList(-1,true);
            },
            onLoad2(){
                this.getOperateList(-1,true);
            },
            tabChange(name,title){
                /*tab页改变时 发送请求*/
                switch(name){
                    case 0:
                        if(!this.finished){
                            this.onLoad();
                        }
                        break;
                    case 1:
                        if(!this.finished1){
                            this.onLoad1();
                        }
                        break;
                    case 2:
                        if(!this.finished2){
                            this.onLoad2();
                        }
                        break;
                }
            },
            closeNopass(){
                switch(this.activeTab){
                    case 0:
                        this.deaseAttach =0;
                        break;
                    case 1:
                        this.skillAttach =0;
                        break;
                    case 2:
                        this.operationAttach =0;
                        break;
                }

            },
            lookNopass(type){
                if(this.activeTab== 0){
                    this.page=1;
                    this.deaseList = [];
                    this.getDeaseList(2,false);
                }
                if(this.activeTab== 1){
                    this.page1=1;
                    this.skillList = [];
                    this.getSkillList(2,false);
                }
                if(this.activeTab== 2){
                    this.page2 = 1;
                    this.operateList = [];
                    this.getOperateList(2,false);
                }
            },
            goPage(type) {
                if(type == 1) {this.isAnimation = false;}
                this.isAnimation = true;
                if( type == 1){
                    let deaseListPagePre = this.$store.state.deaseListPagePre || 1;
                    if(deaseListPagePre == 1){
                        this.$router.push({ path: "/studentHome/homeindex" });
                    }else{
                        this.$router.push({ path: "/studentHome/relationDetail" });
                        this.isAnimation = false;
                    }
                }
              // type == 1 返回页面，type ==2 录入页面
                setTimeout(()=>{
                    if( type == 2){
                        this.Global.rotationAddType =1;
                        this.$store.state.medicalPageType =1;//设置为病种,技能手术录入
                        this.$router.push({ path: "/studentHome/medicalAdd" });
                    }
                    this.isAnimation = false;
                },400)

            },
            goModify(item) {
                this.Global.rotationAddType =2;
                this.$store.state.medicalPageType =2;//设置为病种,技能手术修改
                //区分病种，技能，手术  medicalModifyItem
                this.$store.state.medicalModifyType = this.activeTab;
                this.$store.state.medicalModifyItem = item;

                this.$router.push({ path: "/studentHome/medicalAdd" });
            },
            // 当前科室录入统计
            currentStatistics() {
                //修改轮转计划页面，查看完成情况，取id. 首页进来取 currentRotationScheduleId
                let currentId = this.Global.currentItem.currentScheduleId;
                if(!currentId){
                    return;
                }
                let  url = this.api.recordStatisticsOfSchedule+ "/"+ currentId;
                const postJson = {};

                this.utils.ajax({
                    url: url,
                    method: "POST",
                    data: postJson,
                    success: res => {
                        if (res.code == 0) {
                            if(!res.data || !res.data.studentRecordStatisticsPerTypeVOList){
                                this.$toast(res.msg);
                                return;
                            }
                              console.log(res);
                            this.startTime = res.data.startTime;
                            this.endTime   = res.data.endTime;
                            this.showTabStatic(res.data.studentRecordStatisticsPerTypeVOList);
                        }else{
                            this.$toast(res.msg);
                        }
                    }
                });
            },
            // 全部科室录入统计
            recordStatistics() {
                const url = this.api.recordStatistics;
                const postJson = {};
                this.utils.ajax({
                    url: url,
                    method: "POST",
                    data: postJson,
                    success: res => {
                        if (res.code == 0) {
                            this.showTabStatic(res.data);
                        }else{
                            this.$toast(res.msg);
                        }
                    }
                });
            },

            showTabStatic(staticResult){
                if(! staticResult) return;
                let titles = JSON.parse(JSON.stringify(this.tabsTitle));
                staticResult.map(item => {
                    const arrIndex = item.dataType -1;
                    titles[arrIndex] += " (" + item.passNum + "/" + item.requireRecordNum + ")";
                });
                this.$nextTick(()=>{
                    this.tabsTitle = titles;
                })
            },

            // 获取病种录入列表
            getDeaseList(auditState,showFlag) {
                const url = this.api.deaseList;
                const postJson = {
                    departmentId: this.currentDepartId,
                    auditState: auditState,
                    showUnPassedNumFlag:1,
                    pageIndex: this.page,
                    pageSize: 10
                };
                postJson.pageIndex = this.page;
                this.loading = true;
                this.utils.ajax({
                    url: url,
                    method: "POST",
                    data: postJson,
                    success: res => {
                        if (res.code == 0) {
                            this.loading = false;
                            this.page = res.data.page + 1;
                            this.deaseList = this.deaseList.concat(res.data.result);
                            console.log(   this.deaseList,"病种列表")
                            let obj = {}
                            this.deaseList.forEach((item,index)=>{
                               obj.key =  item.departmentName
                            })

                          /*  this.myKey = {
                                departmentName:"科室",
                                accessModeTitle:"类型",
                                mainDiseaseName:'病种',
                                visitTime:"就诊时间",
                                medicalRecordNo:"病历号"
                            }
                             this.deaseList.forEach((item,index)=>{
                               this.myList.departmentName = item.departmentName
                                this.myList.accessModeTitle =  item.accessModeTitle
                                this.myList.mainDiseaseName = item.mainDiseaseName
                                this.myList.visitTime  =item.visitTime
                                this.myList.medicalRecordNo =   item.medicalRecordNo
                            })*/


                            if (res.data.page === res.data.totalPage || res.data.totalPage == 0) {
                                this.finished = true;
                                if(this.deaseList.length>=10&&this.deaseList.length==res.data.count){
                                    this.text='没有更多了'
                                }
                            }
                            if(showFlag){
                                this.deaseAttach= res.data.attach;
                            }else{
                                this.deaseAttach =0;
                            }
                        }

                    }
                });
            },
            // 获取技能录入列表
            getSkillList(auditState,showFlag) {
                const url = this.api.skillList;
                const postJson = {
                    departmentId: this.currentDepartId,
                    auditState: auditState,
                    showUnPassedNumFlag:1,
                    pageIndex: this.page1,
                    pageSize: 10
                };
                postJson.pageIndex = this.page1;
                this.loading1 = true;
                this.utils.ajax({
                    url: url,
                    method: "POST",
                    data: postJson,
                    success: res => {
                        if (res.code == 0) {
                            if(showFlag){
                                this.skillAttach= res.data.attach;
                                console.log(this.skillAttach);
                            }else{
                                this.skillAttach= 0;
                            }
                            this.loading1 = false;
                            this.page1 = res.data.page + 1;
                            this.skillList = this.skillList.concat(res.data.result);
                            if (res.data.page === res.data.totalPage || res.data.totalPage == 0) {
                                this.finished1 = true;
                                if(this.skillList.length>=10&&this.skillList.length==res.data.count){
                                    this.text1='没有更多了'
                                }
                            }

                        }
                    }
                });
            },
            // 获取手术录入列表
            getOperateList(auditState,showFlag) {
                const url = this.api.operateList;
                const postJson = {
                    departmentId: this.currentDepartId,
                    auditState: auditState,
                    showUnPassedNumFlag:1,
                    pageIndex: this.page2,
                    pageSize: 10
                };
                postJson.pageIndex = this.page2;
                this.loading2 = true;
                this.utils.ajax({
                    url: url,
                    method: "POST",
                    data: postJson,
                    success: res => {
                        if (res.code == 0) {
                            this.loading2 = false;
                            this.page2 = res.data.page + 1;
                            this.operateList = this.operateList.concat(res.data.result);
                            if (res.data.page === res.data.totalPage || res.data.totalPage == 0) {
                                this.finished2 = true;
                                if(this.operateList.length>=10&&this.operateList.length==res.data.count){
                                    this.text2='没有更多了'
                                }
                            }
                            if(showFlag){
                                this.operationAttach= res.data.attach;
                            }else{
                                this.operationAttach= 0;
                            }
                        }
                    }
                });
            },
        }
    };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .wrapper >>> .van-nav-bar__text{
    color:#1DA29A;
  }
  .wrapper >>> .van-icon-arrow-left{
    color:#1DA29A;
  }
  i{
    font-style: normal;
  }
  .van-icon-todo-list-o{
    font-size: 18px;
  }
  .wrapper {
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0;
    bottom: 0;
    background: #f2f2f2;
  }
  .contentBox {
    position: absolute;
    top: 40px;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 1000;
    overflow-y: scroll;
    -webkit-overflow-scrolling: touch;
  }
  .wrapper /deep/ .van-cell {
    text-align: left;
  }
  .wrapper /deep/ .van-cell span {
    font-size: 14px;
  }
  .wrapper /deep/ .van-hairline--surround {
    height: 0;
  }
  .wrapper /deep/.van-password-input {
    margin: 0 auto;
  }
  .noPassBox{
    width: 100%;
    height: 35px;
    line-height: 35px;
    margin-top: 8px;
    background-color: #FFF5E6;
    font-size: 14px;
    text-align: left;
    padding-left: 20px;
    color: red;
  }
  .noPassBox i{
    display: inline-block;
    text-decoration: underline;
  }
  .closeNopass{
    margin-right: 6px;
    margin-top: 8px;
    font-size: 15px;
    color: #ADABA8;
  }
  .DetailsContent {
    position: absolute;
    width: 100%;
    top: 4.875rem;
    bottom: 0;
    box-sizing: border-box;
    background: #f2f2f2;
    padding: 10px 10px;
    z-index: 1;
  }
  /*头部时间*/
  .header-time {
    margin: 10px 0;
    font-size: 12px;
  }
  /*头部标签页*/
  .DetailsContent /deep/ .van-tabs__nav--card {
    margin: 0;
  }
  .header-nav /deep/ .van-ellipsis {
    font-size: 12px;
  }
  .header-nav /deep/ .van-tab{
     flex: 3;
  }
   .header-nav /deep/ .van-tab:nth-child(2){
     flex: 4;
   }
  .submit-time {
    display: flex;
    margin-top: 12px;
    background: #666;
    opacity: 1;
    border-radius: 5px;
  }
  .submit-time-all {
    width: 100%;
    font-size: 12px;
    display: flex;
    padding: 5px 0;
    box-sizing: border-box;
  }
  .submit-time-left {
    width: 60%;
    display: flex;
    justify-content: space-around;
    align-items: center;
    color: #fff;
  }
  .submit-time-right {
    width: 40%;
    display: flex;
    align-items: center;
  }
  .submit-time-left li:nth-of-type(3) {
    color: #afc5c5;
  }
  .modifyBtn_li{
    margin-left: 20px;
  }
  .modifyBtn_li button{
    width: 54px;
    height: 30px;
    line-height: 30px;
    padding: 0;
  }
  .header-nav {
    height: 100%;
    z-index: 5;
  }
  .DetailsContent .nav-content {
    width: 100%;
    height: 100%;
    padding: 0 8px;
    overflow-x: hidden;
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    overflow-y: scroll;
    -webkit-overflow-scrolling: touch;
  }
  /* tab 内容区域 */
  .DetailsContent /deep/ .van-tabs__content{
    position: absolute;
    top: 30px;
    bottom: 0;
    width: 100%;
    overflow-y: scroll;
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
    width: 35%;
    border: 1px solid #f3f1f1;
    word-break: break-word;
    text-align: left;
    padding-left: 20px;
    line-height: 40px;
  }
  @media screen and (max-width: 320px) {
    .office-message li{width: 40%;}
     .submit-time .submit-time-left{
     width:64%;
      transform: scale(.9);
    }
    .submit-time .time-second-right{
      width:36%;
      transform: scale(.9);
      overflow: initial;
    }
    .submit-time .modifyBtn_li{
      margin-right:0;
      margin-left:0;
    }
    .time-second-right fl{
      margin-left:-10px;
    }
    .time-second-right .nottrue::before{
      right:-2.19rem;
      top:0.1625rem;
    }
  }
  .office-message span {
    width: 65%;
    word-break: break-word;
    text-indent: 20px;
    text-align: left;
    line-height: 40px;
    border: 1px solid #f3f1f1;
  }
  @media screen and (max-width: 320px) {
    .office-message  span{width: 60%;}
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
    right: -1.79rem;
    top: 9px;
    width: 40px;
  }
  .time-second {
    position: relative;
  }
  .time-second-right {
    width: 40%;
    height: 30px;
    line-height: 30px;
    color: #fff;
    overflow: hidden;
  }
  .modifyBtn_li{
    margin-right: 6px;
  }
  .notice {
    font-size: 12px;
    height: 2rem;
    justify-content: center;
    margin-top: 10px;
    color: #ff0000;
  }
  .audit {
    color: #1DA29A;
  }
  /*缺省图*/
  .lose-img {
    width:200px;
    height:200px;
    position: absolute;
    top:6rem;
    left:0;
    right:0;
    bottom:0;
    margin:0 auto;
    color:#ccc;
  }

  .img-box{
    width:200px;
    height:120px;
    justify-content: center;
    align-items: center;


  }
  .img-box img{
    display: block;
    width:100%;
  }
  .lose-text{
    font-size:16px;
    padding-top:40px;
    box-sizing: border-box;
  }
  .current-dept-time{
    padding-top:10px;
    position:absolute;
    top:2.875rem;
    left:10px;
    right:10px;
    height:1.2rem;
    text-align: center;
    line-height:1.2rem;
  }

  .highlight{
    background:lightgoldenrodyellow;
  }
  .textcolor{
    background:lightgoldenrodyellow;
    color:#F04844;
  }

  .animation-btn{
    animation: btn 0.4s ease-out ;

  }
  @keyframes btn {
    0%,100%{
      transform: scale(1,1);
    }
    25%,75%{
      transform: scale(0.8,1.1);
    }
    50%{
      transform: scale(1.1,0.8);
    }
  }
</style>
