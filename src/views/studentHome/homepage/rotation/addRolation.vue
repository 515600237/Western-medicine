<template>
  <div class="wrapper">
    <!--标题-->
    <van-nav-bar
      :title="pageTitle"
      left-text="返回"
      right-text="保存"
      left-arrow
      @click-left="goBackPage('rotation')"
      @click-right="savePage()"
      class="titSaveBtn"
    />
    <!--标签页-->
    <div class="tabbar addRoleBox">
      <!--选择科室-->
      <van-cell-group>
        <van-field
          v-model="initPostJson.departmentName"
          is-link
          placeholder="请选择"
          label="轮转科室"
          readonly="readonly"
          input-align="right"
          @click="deptHandleClick"
        ></van-field>

        <van-popup v-model="deptShow" position="bottom" close-on-click-overlay :overlay="true">
          <div class="deparmentNotice text-left">
            <span>此科室为《住院医师规范化培训内容与标准》中的国家标准科室，不是基地的实际培训科室。</span>
          </div>
          <van-picker
            show-toolbar
            title="选择科室"
            value-key="name"
            :columns="derpartList"
            :default-index="defautDepIndex"
            @cancel="onCancel"
            @confirm="deptConfirm"
          />
        </van-popup>

      </van-cell-group>

      <!--是否协同单位-->
      <van-cell-group class="labelTab">
        <van-row type="flex" justify="space-between">
          <van-col span="14" class="text-left">是否在协同单位轮转</van-col>
          <van-col span="10" class="text-right">
            <van-tabs v-model="unitActive" type="card" style="margin-right：0;"  @click="tabClick">
              <van-tab title="是" ></van-tab>
              <van-tab title="否"></van-tab>
            </van-tabs>
          </van-col>
        </van-row>
      </van-cell-group>
     
       <!--协同单位选择-->
      <van-cell-group v-if="unitActive == 0">
        <van-field
          v-model="cooperUnit"
          is-link
          placeholder="请选择"
          label="协同单位"
          readonly="readonly"
          input-align="right"
          @click="cooperClick"
        ></van-field>

        <van-popup v-model="unitPopFlag" position="bottom" close-on-click-overlay :overlay="true">
          <van-picker
            show-toolbar
            title="选择协同单位"
            value-key="name"
            :columns="coodUnitList"
            @cancel="onCancel"
            @confirm="coodUnitConfirm"
          />
        </van-popup>
      </van-cell-group>
      
      <!--开始时间-->
      <van-cell-group>
        <van-field
          v-model="initPostJson.startTime"
          is-link
          placeholder="请选择"
          label="轮转计划开始时间"
          readonly="readonly"
          input-align="right"
          @click="selectTime(1)"
        ></van-field>
        
      </van-cell-group>

      <!--结束时间-->
      <van-cell-group>
        <van-field
          v-model="initPostJson.endTime"
          is-link
          placeholder="请选择"
          label="轮转计划结束时间"
          readonly="readonly"
          input-align="right"
           @click="selectTime(2)"
        ></van-field>
      </van-cell-group>
      
      <div class="teacherListBox" v-for="(item,index) in teacherCollList" :key="index">
          <!--指导医师 0 导入 1录入-->
        <van-cell-group v-if="
teacherCollect == 0">
          <van-field
            v-model="item.teacherName"
            is-link
            placeholder="请选择"
            label="指导医师"
            readonly="readonly"
            input-align="right"
            @click="teacherHandleClick(index)"
          ></van-field>
        </van-cell-group>

        <van-cell-group v-if="
teacherCollect == 1">
          <van-field
            v-model="item.teacherName"
            placeholder="请填写指导医师"
            label="指导医师"
            input-align="right"
          ></van-field>
        </van-cell-group>

        <van-cell-group>
          <van-field
            v-model="item.teacherPhone"
            placeholder="请填写指导医师手机"
            label="指导医师手机"
            input-align="right"
            type="number"
            :readonly="teacherCollect == 0"
          ></van-field>
        </van-cell-group>
      </div>
      <p class="promise" @click="changeType()">本人承诺信息真实有效，如有不实之处承担全部责任</p>
      <div class="bottomBtns">
            <div class="add" @click="addTeacher()">
              <van-icon name="add" class="add-icon greenWg"/>
              <span>新增</span>
            </div>
            <div class="add reduce" @click="reduceTeacher()" v-if="teacherCollList.length >=2">
              <van-icon name="delete" color="#FF0000" class="add-icon"/>
              <span>删除</span>
            </div>
        </div>

    </div>
    <!-- 选择指导医师弹窗 -->
    <van-popup v-model="teacherPopFlag" position="bottom" close-on-click-overlay :overlay="true">
          <van-picker
            show-toolbar
            title="选择指导老师"
            value-key="name"
            :columns="teacherList"
            @cancel="onCancel"
            @confirm="teacherConfirm"
          />
      </van-popup>
      <!-- 选择时间弹窗 -->
      <van-popup v-model="timeFlag1" position="bottom" :overlay="true">
          <van-datetime-picker
            v-model="currentTimeDate"
            title="选择开始时间"
            type="date"
            :min-date ="minDate"
            @cancel="onCancel"
            @confirm="TimeConfirm1"
            :formatter="formatter"
          />
         
        </van-popup>

  </div>
</template>

<script>
import {departListMixin} from "@/common/js/mixin";

export default {
  name: "addRolation",
  mixins: [departListMixin],
  data() {
    return {
      // 页面类型 1新增，2修改
      pageType: 1,
      pageTitle:"新增轮转计划",
      // 科室弹窗
      deptShow: false,
      defautDepIndex: 0,
      departmentName: "",
      cooperTab:{"0":1,"1":0},
      initPostJson:{
          "departmentId": "",
          "departmentName": "",
          "startTime": "",
          "endTime": "",
          "cooperationFlag": 0,
          "cooperationBaseId": null,
          "cooperationBaseName": null,
          "orgId": this.Global.orgId,
          "rotationScheduleTeacherDtoList": []
      },
      activeTimeType: 1,
      // 录入方式 0 导入  1 填写
      teacherCollect: 0,
      teacherList:[],
      teacherCollList:[],
      teacherItem:{
        "teacherId": "",
        "teacherName": "",
        "teacherPhone": ""
      },
      activeThIndex: 0,
      // 协同单位
      unitActive: 1,
      unitPopFlag: false,
      cooperUnit: "",
      coodUnitList: [],
      // 开始时间选择1 结束时间选择
      startTime: "",
      endTime: "",
      timeFlag1: false,
      minDate: new Date(),
      currentTimeDate: new Date(2015,1,1),
      // 指导医师
      standardTchJson:{},
      teacherName: "",
      teacherPopFlag: false,
      teacherPhone: "",
      rotationAddType : 1,// 1 新增页面，2 修改页面
      currentItem: {},
      currentScheduleId: 0
    };
  },
  created(){
    //指导老师    
    let myInfo = this.Global.myInfo;
    console.log(myInfo);
    //根据参培时间，限制选择的最小时间
    if(myInfo){ 
      this.minDate =  new Date(myInfo.startTime.replace(/-/g,'/'));
    }
    
    //获取指导老师填写方式
    this.getTeacherConfig();
    //获取协同单位
    this.getCooridionList();
    this.rotationAddType = this.Global.rotationAddType || 1;
    
    //获取当前轮转id
    this.currentItem = this.Global.currentItem;
    this.currentScheduleId = this.currentItem.currentScheduleId;
    // 新增页面
    if( this.rotationAddType == 1){
        this.pageTitle ="新增轮转计划";
        this.teacherCollList=[];
        const teacher= Object.assign({},{},this.teacherItem);
        this.teacherCollList.push(teacher);
    }
    //修改页面
    if( this.rotationAddType == 2){
       this.pageTitle ="修改轮转计划";
       this.getDetail();
    }
    //显示上次保存的科室
    this.defautDepIndex = this.$store.state.rotationDepIndex;
  },
  mounted(){
     console.log(this.derpartList);

  },
  beforeRouteLeave(to,from,next){    
    next();
  },
  methods: {
    changeType(){
       if(this.teacherCollect ==0){
         this.teacherCollect =1;
       }else{
         this.teacherCollect =0;
       }
    },
    // 获取轮转计划详情
    getDetail(){
        const url =this.api.scheDetail+"/"+ this.currentScheduleId;
        console.log(url);
          this.utils.ajax({
              url:url,
              method:"POST",
              data: {},
              success:(res)=>{
                  console.log(res);
                  if(res.code == 0){
                    // this.itemData = res.data;
                    this.initPostJson = res.data;
                    this.teacherCollList = res.data.rotationScheduleTeacherDtoList;
                    //根据标准科室id，获取指导老师列表
                    this.standardTchJson.standardId = res.data.standardDepartmentId;
                    if(this.standardTchJson.standardId){
                        this.getDepartmentTeacher();
                    }

                  }
              }
          })
    },
    // 获取指导老师填写方式
    getTeacherConfig(){
        const url =this.api.getConfigInfo;
        const postJson={};
        console.log(url);
        this.utils.ajax({
            url:url,
            method:"POST",
            data:postJson,
            success:(res)=>{
                console.log(res);
                if(res.code == 0){
                    this.teacherCollect = res.teacherCollect || 0;
                    // this.teacherCollect = 1;
                }
            }
        })

    },
    // 页面跳转
    goBackPage(name) {
      this.$router.push({ name: name });
    },
    // 选择开始结束时间
    selectTime(type){
       this.activeTimeType = type;
      //  开始时间
       if(type == 1){
         this.currentTimeDate = this.initPostJson.startTime || new Date();
       }
      //  结束时间
       if(type == 2){
         this.currentTimeDate = this.initPostJson.endTime || new Date();
       }
       this.currentTimeDate = new Date(this.currentTimeDate);
       this.timeFlag1 = true;
    },
    // 时间过滤
    getTimeValue(value){
      let start= new Date(value);
      start = start.getFullYear()+"-"+this.addZero(start.getMonth()+1)+"-"+ this.addZero( start.getDate());
      return start;
    },
    // 时间确认
    TimeConfirm1(value) {
      let start = this.getTimeValue(value);
      if(this.activeTimeType == 1){
        this.initPostJson.startTime = start;
      }
      if(this.activeTimeType == 2){
        this.initPostJson.endTime = start;
      }
      this.timeFlag1 = false;
    },
    // 获取协同单位
    getCooridionList(){
          const url =this.api.getCooridionList;
          console.log(url)
          const postJson={};
          this.utils.ajax({
              url:url,
              method:"POST",
              data:postJson,
              success:(res)=>{
                  console.log(res);
                  if(res.code == 0){
                      this.coodUnitList = res.data;
                  }
              }
          })
    },
    // 获取指导老师
    getDepartmentTeacher(){
         const url =this.api.getDepartmentTeacher;
          const postJson={
              standardId: this.standardTchJson.standardId
          };
          // 协同单位  0 否 1是, 是协同单位,协同单位id存在,才传cooperationBaseId
          const cooperationBaseId= this.initPostJson.cooperationBaseId;
          if(this.initPostJson.cooperationFlag == 1 && cooperationBaseId){
              postJson.coordinationId = cooperationBaseId;
          }
          console.log(url);
          this.utils.ajax({
              url:url,
              method:"POST",
              data:postJson,
              success:(res)=>{
                  if(res.code == 0){
                      this.teacherList = res.data;
                      console.log(this.teacherList);
                  }else{
                      this.$toast( res.msg);
                  }
              }
          })
    },
    // 新增指导老师
    addTeacher(){
        if(this.teacherCollList.length>10){
            this.$toast("最多能添加10个指导老师");
            return;
        }
        const teacher= Object.assign({},{},this.teacherItem);
        this.teacherCollList.push(teacher);
    },
    reduceTeacher(){
      const length =this.teacherCollList.length;
      if(this.teacherCollList.length >1){
            this.teacherCollList.pop();
      }
    },
    // 新增轮转计划  数据请求
    savePage(){
       if(!this.initPostJson.departmentName){
          this.$toast("请选择轮转科室");
          return;
       }
      if(!this.initPostJson.startTime){
          this.$toast("请选择轮转计划开始时间");
          return;
       }

       if(!this.initPostJson.endTime){
          this.$toast("请选择轮转计划结束时间");
          return;
       }
       
       let startTime = this.initPostJson.startTime;
       startTime = new Date(startTime.replace(/-/g,'/'));
       let endTime = this.initPostJson.endTime;
       endTime = new Date(endTime.replace(/-/g,'/'));
       if(endTime.getTime() < startTime.getTime()){
          this.$toast("轮转计划结束时间不能小于轮转计划开始时间");
          return;
       }

      //  导入方式时
       if(this.teacherCollect == 0){
          let teacherIds= this.teacherCollList.map((item) =>{
             return  item.teacherId;
          })
          if(teacherIds.includes("")){
              this.$toast("请选择指导医师");
              return;
          }
          if(new Set(teacherIds).size != teacherIds.length ){
              this.$toast("指导医师有重复，请重新选择");
              return;
          }
       }
        //  填写时，判断指导老师手机号
       let phoneFlag= true;
       let phoneReg = /^1[3456789]\d{9}$/;
       let teacherPhoneS= [];
       if(this.teacherCollect == 1){
          phoneFlag= this.teacherCollList.every((item)=>{
              if(!item.teacherName){
                this.$toast("请填写指导医师");
                return false;
              }
              if(!item.teacherPhone){
                this.$toast("请填写指导医师手机号");
                return false;
              }
              if(!phoneReg.test(item.teacherPhone)){
                  this.$toast("手机号输入不合法");
                  return false;
              }
              teacherPhoneS.push(item.teacherPhone);
              return true;
          })
          if(new Set(teacherPhoneS).size != teacherPhoneS.length){
                this.$toast("指导老师手机号不能重复");
                return;
          }
       }
       console.log(phoneFlag);
       if(!phoneFlag){
          return;
       }
      //新增页面
      if(this.rotationAddType == 1){
          this.saveDataAjax();
      }
      //修改页面
      if(this.rotationAddType == 2){
          this.modifySaveDate();
      }
    },
    //返回轮转日历页面
    saveGoBack(){
      setTimeout(()=>{
          this.$store.dispatch("setNewRotationShType",1);
          this.$router.push({ name: "rotation"});
      },200)
    },
    // 新增请求
    saveDataAjax(){
       const url = this.api.scheAdd;
       this.initPostJson.rotationScheduleTeacherDtoList= this.teacherCollList;
       this.utils.ajax({
                url: url,
                method: "POST",
                data: this.initPostJson,
                success: (res) => {
                    console.log(res);
                    if(res.code == 0){
                      this.$toast("新增轮转计划成功");
                      this.$store.state.rotationDepIndex = this.defautDepIndex;
                      this.saveGoBack();
                    }else{
                       this.$toast(res.msg);
                    }
              } 
        });
    },
    // 修改轮转计划
    modifySaveDate(){
        const url = this.api.scheModify;
        this.initPostJson.rotationScheduleTeacherDtoList= this.teacherCollList;
        console.log(this.initPostJson);
        this.utils.ajax({
                url: url,
                method: "POST",
                data: this.initPostJson,
                success: (res) => {
                    console.log(res);
                    if(res.code == 0){
                      this.$toast("修改轮转计划成功");
                      this.saveGoBack();
                   }else{
                       this.$toast(res.msg);
                   }
              }
        });
    },
     /*科室*/
    deptHandleClick() {
      this.deptShow = !this.deptShow;
    },
    // 科室确认
    deptConfirm(value, index) {
      this.deptShow = false;
      this.initPostJson.departmentName = value.name;
      if(this.initPostJson.departmentId != value.id){
          this.initPostJson.departmentId = value.id;
          //根据标准科室id查指导老师
          this.standardTchJson.standardId = value.standardId;
          this.getDepartmentTeacher();
      }
      //记录选择的科室索引
      this.defautDepIndex = index;
    },
    // 协同单位tab切换
    tabClick(index, title){
        this.initPostJson.cooperationFlag = this.cooperTab[index];
    }, 
    // 指导老师
    teacherHandleClick(index){
        this.activeThIndex = index;
        this.teacherPopFlag  = true;
    },
    teacherConfirm(value, index) {
      this.teacherPopFlag = false;
      console.log(this.teacherCollList);
      this.teacherCollList[this.activeThIndex].teacherId = value.id;
      this.teacherCollList[this.activeThIndex].teacherName = value.name;
      this.teacherCollList[this.activeThIndex].teacherPhone =value.phone;
      console.log(this.teacherCollList);
    },
    cooperClick() {
      this.unitPopFlag = true;
    },
    coodUnitConfirm(value, index) {
      this.unitPopFlag = false;
      console.log(value);
       this.initPostJson.cooperationBaseId = value.id;
       this.initPostJson.cooperationBaseName = value.name;
       this.cooperUnit = value.name;
       //获取指导老师
       this.getDepartmentTeacher();
    },
    addZero(data){
       let data1 = String(data);
       return  data1.length <2 ? '0'+data1 :data1;
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
    onCancel() {
      this.deptShow = false;
      this.unitPopFlag = false;
      this.teacherPopFlag = false;

      this.timeFlag1 = false;
      this.timeFlag2 = false;
    },
    // 指导医师手机号
    onDelete() {
      const length = this.teacherItem.teacherPhone.length;
      this.teacherItem.teacherPhone = this.teacherItem.teacherPhone.slice(0, length-1);
    },
    /*时间change事件*/
    timeChangeConfrim(e) {
      let timearr = e.getValues();
      this.startTime = `${timearr[0]}${timearr[1]}${timearr[2]}`;
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
  /*返回*/
  .wrapper /deep/ .van-nav-bar__text{
    color:#1da29a;
  }
  /*左箭头*/
  .wrapper /deep/ .van-nav-bar__arrow{
    color:#1da29a;
  }
  /*确认*/
  .wrapper /deep/ .van-picker__confirm{
    color:#1da29a;
  }
  /*取消*/
  .wrapper /deep/ .van-picker__cancel{
    color:#1da29a;
  }
  /*右侧按钮*/
  .wrapper /deep/ .van-nav-bar__right{
    background-color:#1da29a;
  }
  /*按钮文字颜色*/
  .wrapper /deep/ .van-nav-bar__right .van-nav-bar__text{
    color:#fff;
  }
.addRoleBox {
  position: absolute;
  top: 60px;
  bottom: 0px;
  left: 0;
  right: 0;
  padding-bottom: 20px;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
}
.teacherItem {
  margin-top: 15px;
}
.labelTab{
  padding: 10px 15px;
  font-size: 14px;
}
.labelTab /deep/ .van-tabs__nav{
  margin-right: 0;
}
.wrapper /deep/ .van-field__label {
  width: 150px;
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
  bottom: 0;
  left: 0;
  right: 0;
  padding-bottom: 20px;
  background: #f5f5f5;
}
.tabs_card {
  width: 100%;
  height: 80px;
  margin-top: 15px;
}
.tab_content {
  width: 100%;
  margin-top: 15px;
}
.promise {
  height: 40px;
  line-height: 40px;
  margin-top: 5px;
  font-size: 12px;
  color: #999999;
}
.bottomBtns{
  overflow: hidden;
}
.add {
  display: flex;
  float: right;
  align-items: flex-end;
  font-size: 12px;
  text-align: right;
  margin-right: 24px;
  padding-top: 10px;
  box-sizing: border-box;
}
.add .add-icon {
  font-size: 18px;
}
.add span {
  margin-left: 5px;
}
/* 科室选择说明 */
.deparmentNotice{
  width: 100%;
  padding: 5px 15px;
  color: #f00;
}
.deparmentNotice span{
  display: block;
  width: 160%;
  height: 28px;
  font-size: 16px;
  transform: scale(0.625);
  transform-origin: 0 0
}

</style>
