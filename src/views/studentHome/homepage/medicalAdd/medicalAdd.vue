<template>
  <div class="wrapper">
    <!--标题-->
    <van-nav-bar
      :title="pageTitle"
      left-text="返回"
      right-text="保存"
      left-arrow
      @click-left="goBackPage()"
      @click-right="savePage()"
    >
      <van-button
              loading-type
              loading-size="15px"
              loading-text="保存"
                  size="small"
                  slot="right"
                  class="btnSave">
        保存
      </van-button>
    </van-nav-bar>

    <!--标签页-->
    <div class="tabbar">
      <van-tabs type="card" color="#1DA29A" class="tabs_card" v-model="activeTab" v-show="pageType == 1">
        <!--第一栏病种-->
        <van-tab title="病种" class="tab_content"></van-tab>
        <!--第二栏内容-->
        <van-tab title="临床技能操作" class="tab_content"></van-tab>
        <!--第三栏内容-->
        <van-tab title="手术" class="tab_content"></van-tab>
      </van-tabs>

      <!-- 病种 -->
      <div class="inputBox deaseBox" :class="{'inputModifyBox': pageType == 2}" v-if="activeTab ==0">
        <div class="van-tabs__content" v-for="(item,index) in diseaseList" :key="index">
          <van-cell-group>
            <van-field
              v-model="item.departmentName"
              is-link
              placeholder="请选择"
              label="科室"
              readonly="readonly"
              input-align="right"
              @click="toggleDeparmentList(item)"
            ></van-field>
          </van-cell-group>
          <!--就诊方式-->
          <van-field label="就诊方式" class="typeCardBox" disabled>
            <van-button
              slot="button"
              :size="itemSm.size"
              :text="itemSm.text"
              :type="itemSm.type"
              v-for="(itemSm,indexSm) of accessModeList"
              :key="indexSm"
              class="hospitalType"
              :class="{'active': item.accessMode == (indexSm+1)}"
              @click="hospTypeClick(itemSm,indexSm,item)"
            ></van-button>
          </van-field>

          <van-cell-group class="displayBlock" v-show="item.accessMode==3">
            <van-field label="是否全程管理">
              <van-button slot="button"  v-for="(item1,index1) in wholeDeaseList" :key="index1" size="small" @click="wholeProcess(item,item1.id)" :class="{'active': item.manageWholeProcess == item1.id}">{{item1.name}}</van-button>
            </van-field>

            <van-field label="书写大病历">
              <van-button slot="button" v-for="(item1,index1) in bigRecordDeaseList"  :key="index1"  size="small" @click="bigRecord(item,item1.id)" :class="{'active': item.writeMajorMedicalRecord == item1.id}">{{item1.name}}</van-button>
            </van-field>
          </van-cell-group>

          <!--病种名称-->
          <van-cell-group>
            <van-field
              v-model="item.mainDiseaseName"
              is-link
              placeholder="请选择"
              label="病种名称"
              readonly="readonly"
              input-align="right"
              @click="toggleDeaseList(item)"
            ></van-field>
          </van-cell-group>



          <!--就诊时间-->
          <van-cell-group>
            <van-field
              v-model="item.visitTime"
              is-link
              placeholder
              label="就诊时间"
              readonly="readonly"
              input-align="right"
              @click="TimeClick('就诊时间',item)"
            ></van-field>
          </van-cell-group>

          <!--病历号-->
          <van-cell-group class="deaseInputBox">
            <van-field
              v-model="item.medicalRecordNo"
              placeholder="请输入病历号"
              label="病历号"
              input-align="right"
            ></van-field>
          </van-cell-group>
        </div>

        <div style="overflow:hidden;" v-if ="pageType == 1">
            <v-mditemaddreduce :currentList="diseaseList" @addList="addList()" @reduceList="reduceList()"></v-mditemaddreduce>
        </div>
         <button class="deleteBtn" @click="handleDelete" v-if ="pageType == 2">删除</button>
      </div>
      <!-- 技能 -->
      <div class="inputBox deaseBox" :class="{'inputModifyBox': pageType == 2}"   v-if="activeTab ==1">
        <div class="van-tabs__content" v-for="(item,index) in skillList" :key="index">
          <van-cell-group>
            <van-field
              v-model="item.departmentName"
              is-link
              placeholder="请选择"
              label="科室"
              readonly="readonly"
              input-align="right"
              @click="toggleDeparmentList(item)"
            ></van-field>
          </van-cell-group>

          <!--临床操作技能-->
          <van-cell-group>
            <van-field
              v-model="item.skillName"
              is-link
              placeholder="请选择"
              label="临床操作技能"
              readonly="readonly"
              input-align="right"
              @click="toggleSkillList(item)"
            ></van-field>
          </van-cell-group>
          <!--操作时间-->
          <van-cell-group>
            <van-field
              v-model="item.operateTime"
              is-link
              placeholder
              label="操作时间"
              readonly="readonly"
              input-align="right"
              @click="TimeClick('操作时间',item)"
            ></van-field>
          </van-cell-group>
          <!--病历号-->
          <van-cell-group class="deaseInputBox">
            <van-field
              v-model="item.medicalRecordNo"
              placeholder="请输入病历号"
              label="病历号"
              input-align="right"
            ></van-field>
          </van-cell-group>
        </div>
        <div style="overflow:hidden;" v-if ="pageType == 1">
            <v-mditemaddreduce :currentList="skillList" @addList="addList()" @reduceList="reduceList()"></v-mditemaddreduce>
        </div>
        <button class="deleteBtn" @click="handleDelete" v-if ="pageType == 2">删除</button>
      </div>
      <!-- 手术 -->
      <div class="inputBox deaseBox"  :class="{'inputModifyBox': pageType == 2}"  v-if="activeTab ==2">
        <div class="van-tabs__content" v-for="(item,index) in operateionList" :key="index">
          <van-cell-group>
            <van-field
              v-model="item.departmentName"
              is-link
              placeholder="请选择"
              label="科室"
              readonly="readonly"
              input-align="right"
              @click="toggleDeparmentList(item)"
            ></van-field>

          </van-cell-group>
          <!--手术名称-->
          <van-cell-group>
            <!--手术名称-->
            <van-field
              v-model="item.operationName"
              is-link
              placeholder="请选择"
              label="手术名称"
              readonly="readonly"
              input-align="right"
              @click="toggleOperateList(item)"
            ></van-field>
          </van-cell-group>
          <!--角色-->
          <van-field label="角色">
            <van-button
              slot="button"
              :size="itemSm.size"
              :text="itemSm.text"
              :type="itemSm.type"
              v-for="(itemSm,indexSm) of roleList"
              :key="indexSm"
              :class="{'active': item.operationRole == (indexSm+1)}"
              @click="hosRoleClick(itemSm,indexSm,item)"
            ></van-button>
          </van-field>
          <!--手术类型-->
          <van-field label="手术类型" class="typeCardBox">
            <van-button
              slot="button"
              :size="itemSm.size"
              :text="itemSm.text"
              :type="itemSm.type"
              v-for="(itemSm,index2) of accessModeList"
              :key="index2"
              :class="{'active': item.operationType == (index2+1)}"
              @click="hosOperTypeClick(itemSm,index2,item)"
            ></van-button>
          </van-field>
          <!--手术时间-->
          <van-cell-group>
            <van-field
              v-model="item.operationTime"
              is-link
              placeholder
              label="手术时间"
              readonly="readonly"
              input-align="right"
              @click="TimeClick('手术时间',item)"
            ></van-field>
          </van-cell-group>
          <!-- 病历号-->
          <van-cell-group class="deaseInputBox">
            <van-field
              v-model="item.medicalRecordNo"
              placeholder="请输入病历号"
              label="病历号"
              input-align="right"
            ></van-field>

          </van-cell-group>
        </div>
        <!-- 手术 -->
        <div style="overflow:hidden;" v-if ="pageType == 1">
            <v-mditemaddreduce :currentList="operateionList" @addList="addList()" @reduceList="reduceList()"></v-mditemaddreduce>
        </div>
        <button class="deleteBtn" @click="handleDelete" v-if ="pageType == 2">删除</button>
      </div>
    </div>

    <!-- 科室选择公共弹窗组件 -->
    <v-depselect2 :showJson="activeDepJson"  :derpartList="derpartList"  @onConfirm="ondeptConfirm" ref="deptPop"></v-depselect2>
    <!-- 病种选择公共组件 -->
    <v-deaseselect :showJson="activeDeaseJson" :departmentId="activeDepartId"  :diseaseListMap="diseaseListMap"  @onConfirm="ondeaseConfirm" ref="deasePop"></v-deaseselect>
    <!-- 技能选择公共组件 -->
     <v-skillselect :showJson="activeSkillJson" :departmentId="activeDepartId" :skillListMap="skillListMap"   @onConfirm="onskillConfirm" ref="skillPop"></v-skillselect>
     <!-- 手术选择公共组件 -->
     <v-operateselect :showJson="activeOperateJson" :departmentId="activeDepartId"  :operationListMap="operationListMap" @onConfirm="onoperateConfirm" ref="operatePop"></v-operateselect>
     <!-- 时间弹窗 -->
     <van-popup v-model="timeflag" position="bottom" :overlay="true">
              <van-datetime-picker
                v-model="timeItem"
                :title="timeTitle"
                type="date"
                @cancel="timeCancel"
                @confirm="TimeConfirm"
                 :max-date="maxDate"
                :formatter="formatter"
              />
            </van-popup>
  </div>
</template>

<script>
/*
 *    1.officeValue ：选择科室的值
 *    2.entityValue :病种名称的值
 *    3.timeValue:就诊时间的值
 *
 * */
import { departBaseInfoMixin } from "@/common/js/mixin";
import depSelect2 from "@/components/input/deparmentSelect.vue";//选择科室
import deaseSelect from "@/components/input/deaseSelect.vue";//选择病种
import skillSelect from "@/components/input/skillSelect.vue";//选择技能
import operateSelect from "@/components/input/operateSelect.vue";//选择手术
import mdItemAddReduce from "@/components/input/mdItemAddReduce";

export default {
  name: "medicalAdd",
  mixins: [departBaseInfoMixin],
  components: {
    vDepselect2: depSelect2,
    vDeaseselect: deaseSelect,
    vSkillselect: skillSelect,
    vOperateselect: operateSelect,
    vMditemaddreduce:mdItemAddReduce
  },
  created() {
    this.getMedicalBaseInfo().then(
      res => {
        console.log(res);
        this.baseMedicalMap = res.data;
        this.derpartList = res.data.derpartList;

        //病种，技能，手术
        this.diseaseListMap = res.data.departIdAndDiseaseListMap;
        this.skillListMap = res.data.departIdAndSkillListMap;
        this.operationListMap = res.data.departIdAndOperationListMap;
      },
      error => {}
    );

    //区分新增，修改页面 1新增,2修改
    this.pageType = this.$store.state.medicalPageType;

    if(this.pageType == 1){
        this.pageTitle = "录入病种/技能/手术";
        this.diseaseList = [this.diseaseJson];
        this.skillList = [this.skillJson];
        this.operateionList = [this.operationJson];
    }
    //修改页面
    if(this.pageType == 2){
         this.pageTitle = "修改录入信息";
        // 区分病种技能手术
        this.activeTab = this.$store.state.medicalModifyType;
        //获取当前数据
        this.itemDetail = this.$store.state.medicalModifyItem;
        //初始化病种技能手术，修改默认显示数据
        if(this.activeTab == 0){
            this.diseaseList = [this.itemDetail];
        }
        if(this.activeTab == 1){
            this.skillList = [this.itemDetail];
        }
        if(this.activeTab == 2){
            this.operateionList = [this.itemDetail];
        }
    }

    // 初始化三组数据
    this.diseaseJsonyh= Object.assign({},{},this.diseaseJson);
    this.skillJsonyh= Object.assign({},{},this.skillJson);
    this.operationJsonyh= Object.assign({},{},this.operationJson);
  },
  mounted() {
    console.log(this.$route);
  },
  data() {
    return {
      // pageType 区分页面，1 新增，2 修改
      pageType: 1,
      pageTitle: "录入病种/技能/手术",
      itemDetail: {},
      baseMedicalMap: {},
      diseaseListMap: {},
      skillListMap:{},
      operationListMap: {},

      activeTab: 0,
      // 公用时间
      timeTitle:"就诊时间",
      timeItemJson: {},
      timeItem:new Date(),
      derpartList: [],
      //   当前活动科室json
      activeDepJson: {},
      // 三组件共用
      activeDepartId: -1,
      // 病种
      activeDeaseJson:{},
      // 技能
      activeSkillJson:{},
      // 手术
      activeOperateJson:{},

      // 病种，技能，手术
      // 病种
      diseaseList: [],
      diseaseJsonyh:{},
      diseaseJson: {
        accessMode: null, //就诊方式
        departmentId: null,
        departmentName: "",
        mainDiseaseId: null,
        mainDiseaseName: "",
        medicalRecordNo: "", //病历号
        visitTime: "",
        manageWholeProcess: 1, //全程管理
        writeMajorMedicalRecord: 1, //书写大病历
        orgId: this.Global.orgId,
      },
      // 就诊方式列表
      accessModeList: [
        {
          type: "default",
          text: "门诊",
          size: "small"
        },
        {
          text: "急诊",
          size: "small",
          type: "default"
        },
        {
          type: "default",
          text: "住院",
          size: "small"
        },

      ],
      // 全程管理列表
      wholeDeaseList: [
        {name:"是",id:"1"},
        {name:"否",id:"0"},
      ],
      //书写大病历列表
      bigRecordDeaseList: [
        {name:"是",id:"1"},
        {name:"否",id:"0"},
      ],
      //技能
      skillList: [],
      skillJsonyh:{},
      skillJson: {
        departmentId: null,
        departmentName: "",
        medicalRecordNo: "",
        operateTime: "",
        patientName: "",
        skillId: 0,
        skillName: "",
        orgId: this.Global.orgId,
      },
      // 手术
      operateionList: [],
      operationJsonyh:{},
      operationJson: {
        departmentId: null,
        departmentName: "",
        medicalRecordNo: "",
        operationId: 0,
        operationName: "",
        operationRole: 0,
        operationTime: "",
        operationType: 0,
        orgId: this.Global.orgId,
      },
      active: 0,
      initPostJson: {
        clinicalSkillRecordDtoList: [],
        diseaseRecordDtoList: [],
        operationRecordDtoList: [],
      },
      roleList: [
        {
          type: "default",
          text: "主刀",
          size: "small"
        },
        {
          text: "助手",
          size: "small",
          type: "default"
        }
      ],
      loadFlag:false,
      // 时间选择
      timeflag: false,
      onOff: false,
      index: 0,
      val: "请输入病历号",

      officeValue: "",
      value1: "",
      timeValue: "",
      entityValue: "",
      showKeyboard: false,
      keyboard: "value1",
      maxDate: new Date(),
      minDate:new Date(2019,1,1),
      typeList:{
        modifyUrl:{
          0: this.api.diseaseModify,
          1: this.api.skillModify,
          2: this.api.operateModify,
        },
        deleteUrl:{
          0: this.api.diseaseDelete,
          1: this.api.skillDelete,
          2: this.api.operateDelete,
        },
        toast:{
            0: "病种",
            1: "临床技能",
            2: "手术",
        }
     },

    };
  },
  methods: {
    // 科室选择
    toggleDeparmentList(item) {
      this.activeDepJson = item;
      this.$refs.deptPop.showDept();
    },
    /*科室确认事件*/
    ondeptConfirm(value, index) {
      const deptJson = {
        departmentId: value.id,
        departmentName: value.name
      };
      // 科室改变时
      if(this.activeDepJson.departmentId != deptJson.departmentId){
         this.clearMainName();
      }
      // 对当前对象 浅拷贝
      this.activeDepJson = Object.assign(this.activeDepJson, deptJson);
      console.log(this.activeDepJson);
      // this.$refs.deptPop.onCancel();
    },
    clearMainName(){
      if(this.activeTab == 0){
          this.activeDepJson.mainDiseaseId = "";
          this.activeDepJson.mainDiseaseName = "";
      }
      if(this.activeTab == 1){
          this.activeDepJson.skillId = "";
          this.activeDepJson.skillName = "";
      }
      if(this.activeTab == 2){
          this.activeDepJson.operationId = "";
          this.activeDepJson.operationName = "";
      }
    },
    // 病种选择
   toggleDeaseList(item) {
      this.activeDepartId = item.departmentId;
      this.activeDeaseJson = item;
      this.$refs.deasePop.showDept();
    },
    /*病种确认事件*/
    ondeaseConfirm(value, index) {
      const deptJson = {
        mainDiseaseId: value.id,
        mainDiseaseName: value.diseaseName
      };
      this.activeDeaseJson = Object.assign(this.activeDeaseJson, deptJson);
      this.$refs.deasePop.onCancel();
    },
    // 是否全程管理
    wholeProcess(item,type){
      item.manageWholeProcess = type;
    },
    // 是否书写大病历
    bigRecord(item,type){
      item.writeMajorMedicalRecord = type;
    },
    // 技能选择
    toggleSkillList(item) {
      this.activeDepartId = item.departmentId;
      this.activeSkillJson = item;
      this.$refs.skillPop.showDept();
    },
    /*技能pop确认事件*/
    onskillConfirm(value, index) {
      const deptJson = {
        skillId: value.id,
        skillName: value.skillName
      };
      this.activeSkillJson = Object.assign(this.activeSkillJson, deptJson);
      this.$refs.skillPop.onCancel();
    },
    // 手术选择
    toggleOperateList(item) {
      this.activeDepartId = item.departmentId;
      this.activeOperateJson = item;
      this.$refs.operatePop.showDept();
    },
    /*手术pop确认事件*/
    onoperateConfirm(value, index) {
      const deptJson = {
        operationId: value.id,
        operationName: value.operationName
      };
      this.activeOperateJson = Object.assign(this.activeOperateJson, deptJson);
      this.$refs.operatePop.onCancel();
    },

    /*路由返回*/
    goBackPage() {
      this.$route.meta.isBack = true;
      this.$router.go(-1);
    },
    // 判断病种/技能/手术 当前值和初始值是否相等
    isEqualSame(postList,yjson){
       let postJson = postList[0];
       let flag = true; //默认全部相等
       for(var key in postJson){
           if(postJson[key] != yjson[key]){
             flag = false;
           }
       }
       if(flag){
            return [];
       }else{
            return postList;
       }
    },
    checkAjData(deaseList,type){
      // 病种,技能，手术必填项校验
      let deaseFlag = true;
      if(!deaseList.length){
         return true;
      }

      let CheckJson;
      if(type ==1){
          CheckJson={
            departmentId: "请选择科室",
            accessMode:"请选择就诊方式",
            mainDiseaseId: "请选择病种名称",
            visitTime: "请选择就诊时间",
            medicalRecordNo:"请输入病历号"
          }
      }
      if(type ==2){
          CheckJson={
            departmentId: "请选择科室",
            skillId:"请选择临床操作技能",
            operateTime: "请选择操作时间",
            medicalRecordNo:"请输入病历号"
          }
      }
      if(type ==3){
          CheckJson={
            departmentId: "请选择科室",
            operationId:"请选择手术名称",
            operationRole: "请选择手术角色",
            operationType: "请选择手术类型",
            operationTime: "请选择手术时间",
            medicalRecordNo:"请输入病历号"
          }
      }
      let cRepeatJson ={};
      // 必填校验和病历号重复性校验
      deaseFlag = deaseList.every( (item)=> {
          console.log(item,11111)
            for(let key in CheckJson){
               if(!item[key]){
                  this.$toast(CheckJson[key]);
                  return false;
               }
            }
            if(type == 1){
                let key = item.mainDiseaseId+","+item.visitTime +"," +item.medicalRecordNo;
                if(cRepeatJson[key]){
                     this.$toast("相同时间相同病种不能录入同一个病历号");
                     return false;
                }
                cRepeatJson[key] = true;
            }
            if(type == 2){
                let key = item.skillId+","+item.operateTime+"," +item.medicalRecordNo;
                if(cRepeatJson[key]){
                     this.$toast("相同时间相同临床技能操作不能录入同一个病历号");
                     return false;
                }
                cRepeatJson[key] = true;
            }
            if(type == 3){
                let key = item.operationId+","+item.operationTime+"," +item.medicalRecordNo;
                if(cRepeatJson[key]){
                     this.$toast("相同时间相同手术不能录入同一个病历号");
                     return false;
                }
                cRepeatJson[key] = true;
            }
            return true;
      })
      return deaseFlag;
    },
    savePage() {
       //新增保存
       if(this.pageType == 1){
          this.saveAddPage();
       }
       //修改保存
       if(this.pageType == 2){
           this.saveModifyPage();
       }
    },
    saveAddPage(){
      let dease =this.isEqualSame(this.diseaseList,this.diseaseJsonyh);
      let skill =this.isEqualSame(this.skillList,this.skillJsonyh);
      let operate =this.isEqualSame(this.operateionList,this.operationJsonyh);
      console.log(dease);

      // 判断是否添加过内容
      if(!dease.length && !skill.length && !operate.length){
          this.$toast("请选择科室");
          return;
      }

      // 每一项必填校验
      if(!this.checkAjData(dease,1) || !this.checkAjData(skill,2) || !this.checkAjData(operate,3) ){
         return;
      }

      this.initPostJson = {
        diseaseRecordDtoList: dease,
        clinicalSkillRecordDtoList: skill,
        operationRecordDtoList: operate,
      };
      this.saveData();

    },
    //修改病种，技能，手术
    saveModifyPage() {
     let postJson={};
     if(this.activeTab == 0){
        postJson = this.diseaseList[0] ;
     }
     if(this.activeTab == 1){
        postJson = this.skillList[0] ;
     }
     if(this.activeTab == 2){
         postJson = this.operateionList[0];
     }
     if(!postJson.medicalRecordNo){
       this.$toast("请输入病历号");
       return;
     }
     if(postJson.medicalRecordNo && postJson.medicalRecordNo.length >30){
       this.$toast("病历号最长为30位");
       return;
     }
     const postUrl= this.typeList.modifyUrl[this.activeTab];
      this.utils.ajax({
        url: postUrl,
        method: "POST",
        data: postJson,
        success: res => {
          if (res.code == 0) {
            this.$toast("修改"+this.typeList.toast[this.activeTab]+"成功");
            this.$route.meta.isBack = false;
            let routerParams ={ name: "medicaList",params:{ medListTabType: this.activeTab}}
            this.$router.push(routerParams);
          }else{
            this.$toast( res.msg );
          }
        }
      });
    },
    // 新增病种技能手术
    saveData() {
      const url = this.api.medicalSave;
      let postJson= this.initPostJson;
      this.loadFlag = true;

      //病种，技能，手术列表显示哪个tab逻辑
      let routerParams ={ name: "medicaList",params:{}};
      let activeTab = 0;
      //如果病种录入了，tab  =0，如果病种没录入，技能录入了，tab =1,如果病种没录入，技能没录入，手术///录入了,tab =2

      let checkKeys= {
        0: "diseaseRecordDtoList",
        1: "clinicalSkillRecordDtoList",
        2: "operationRecordDtoList",
      };
      for(let key in checkKeys){
          let value = checkKeys[key];
          if(postJson.hasOwnProperty(value) && postJson[value].length){
            activeTab = key;
            break;
          }
      }
      routerParams.params["medListTabType"] = activeTab;

      this.utils.ajax({
        url: url,
        method: "POST",
        data: postJson,
        success: res => {
          console.log(res);
          this.loadFlag = false;
          if (res.code == 0) {
            this.$toast("新增病种/技能/手术成功");
            this.Global.depDetailType = 1;
            this.$route.meta.isBack = false;

            this.$router.push(routerParams);
          }else{
            this.$toast(res.msg);
          }
          this.loadFlag = true;
        }
      });
    },
    // 删除功能
    handleDelete(){
        this.$dialog.confirm({
          message:"确定要删除吗?"
        }).then(()=>{
          //    deleteUrl
          const postUrl= this.typeList.deleteUrl[this.activeTab]+"/"+this.itemDetail.id;

          this.utils.ajax({
            url: postUrl,
            method: "POST",
            data: {},
            success: res => {
              if (res.code == 0) {
                this.$toast("删除"+this.typeList.toast[this.activeTab]+"成功");
                this.$route.meta.isBack = false;
                this.$router.go(-1);

              }else{
                this.$toast("删除失败");
              }
            }
          });
        }).catch(()=>{

        })
    },
    // reduceList
    reduceList(){
      if (this.activeTab == 0) {
        this.diseaseList.pop();
      }
      if (this.activeTab == 1) {
        this.skillList.pop();
      }
      if (this.activeTab == 2) {
        this.operateionList.pop();
      }
    },
    addList() {
      if (this.activeTab == 0) {
        if(this.diseaseList.length >=10){
          this.$toast("最多只能添加10个病种");
          return;
        }
        const json=Object.assign({},{},this.diseaseJsonyh);
        this.diseaseList.push(json);
      }
      if (this.activeTab == 1) {
        if(this.skillList.length >=10){
          this.$toast("最多只能添加10个技能");
          return;
        }
        const json=Object.assign({},{},this.skillJsonyh);
        this.skillList.push(json);
      }
      if (this.activeTab == 2) {
        if(this.operateionList.length >=10){
          this.$toast("最多只能添加10个手术信息");
          return;
        }
        const json=Object.assign({},{},this.operationJsonyh);
        this.operateionList.push(json);
      }
    },
    // 时间选择
    TimeClick(title,item) {
      this.timeTitle = title;
      // timeItem 时间插件显示的时间
      let time;
      if(this.activeTab == 0){
        time = item.visitTime;
      }
      if(this.activeTab == 1){
        time = item.operateTime;
      }
      if(this.activeTab == 2){
        time = item.operationTime;
      }
      this.timeItem = time ? new Date(time.replace(/-/g,"/")): new Date();

      this.timeItemJson = item;
      this.timeflag = ! this.timeflag;
    },
     // 时间弹窗确认取消
    timeCancel() {
      this.timeflag = false;
      this.onOff = false;
    },
    addZero(s){
        return s < 10 ? '0' + s: s;
    },
    TimeConfirm(value) {
      let day= new Date(value);
      day = day.getFullYear()+"-"+this.addZero(day.getMonth()+1)+"-"+this.addZero(day.getDate());
      if(this.activeTab == 0){
        this.timeItemJson.visitTime =day;
      }
      if(this.activeTab == 1){
        this.timeItemJson.operateTime =day;
      }
      if(this.activeTab == 2){
        this.timeItemJson.operationTime =day;
      }
      this.timeflag = false;
    },
    formatter(type, value) {
      if (type === "year") {
        return `${value}年`;
      } else if (type === "month") {
        return `${value}月`;
      } else if (type === "day") {
        return `${value}日`;
      }
      return value;
    },
    // 就诊方式
    hospTypeClick(indexSm,index,item){
      item.accessMode= index+1;
      console.log(item.accessMode);
    },
    // 手术角色
    hosRoleClick(indexSm,index,item){
      item.operationRole= index+1;
      console.log(item.operationRole);
    },
    // 手术类型
    hosOperTypeClick(indexSm,index,item){
      item.operationType= index+1;
      console.log(item.operationType);
    },

  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  /*返回键和下面单元格对齐*/
  .wrapper /deep/ .van-nav-bar__left{
    left:0.625rem;
  }
  /*picker里面的确认和取消键的颜色*/
  .wrapper /deep/ .van-picker__confirm{
    color:#1da29a;
  }
  .wrapper /deep/ .van-picker__cancel{
    color:#1da29a;
  }
.inputBox {
  position: absolute;
  top: 96px;
  bottom: 0;
  left: 0;
  right: 0;
  overflow-y: scroll;
  -webkit-overflow-scrolling: touch;
  padding-bottom: 20px;
}
.inputModifyBox{
  top: 46px;
}
.van-button.active{
  background-color: #1da29a;
  color:white;
}
.wrapper /deep/ .van-tabs__content:first-child{
    margin-top: 0px;
}
.wrapper /deep/ .van-tabs__content{
    margin-top: 13px;
}
/*导航栏标题*/
.wrapper /deep/ .van-nav-bar__title {
  font-size: 14px;
  color: #1da29a;
}

/*左侧箭头*/
.wrapper /deep/ .van-icon-arrow-left {
  color: #1da29a;
}
/*左侧字体*/
.wrapper /deep/ .van-nav-bar__text {
  color: #1da29a;
}
/*标签页.van-tabs__nav--card*/
.wrapper /deep/ .van-tabs__nav--card {
  margin: 0 42px;
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
.wrapper {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  background: #F2F2F2;
}
.tabs_card {
  width: 100%;
  height: 40px;
  margin-top: 11px;
}
.tab_content {
  width: 100%;
  margin-top: 15px;
}
.displayBlock {
  display: block;
}
/* 科室选择说明 */
.deparmentNotice{
  width: 100%;
  padding: 5px 15px;
  color: #999999;
}
.deparmentNotice span{
  display: block;
  width: 160%;
  height: 28px;
  font-size: 16px;
  transform: scale(0.625);
  transform-origin: 0 0
}
/* 就诊方式 */
  .hospitalType{
    width:80px;
  }
  .btnSave{
    width:80px;
    background:#1da29a;
    color:#fff;
    border-radius:5px;
  }
  .typeCardBox >>> .van-field__label{
    width: 70px;
  }
  /* 删除功能 */
.deleteBtn{
      border-radius: 4px;
      height:32px;
      margin-top:15px;
      border: none;
      width:95%;
      background:#f04844;
      color:#fff;
      font-size:14px;
}
</style>
