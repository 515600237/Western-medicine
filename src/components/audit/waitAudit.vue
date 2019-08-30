<template>
  <div>
    <div class="awaitItem" v-for="(item,index) of auditList" :key="index">
      <!--提交时间-->
      <div class="submit-time" v-if="item.medicalRecord">
        <div class="submit-time-all">
          <ul class="submit-time-left">
            <li>
              <van-icon name="todo-list-o" class="titleIcon" />
            </li>
            <li>提交时间：</li>
            <li class="colorLgGreen">{{item.createTime}}</li>
          </ul>
          <div class="submit-time-right">
            <van-button
              v-if="item.auditState == 0"
              plain
              hairline
              type="primary"
              slot="right"
              size="small"
              class="auditBtn"
              :class="{'animation-btn':isAnimation}"
              ref="btn"
              @click="auditPop(item,index)"
            >
              <van-icon name="checked" color="#fff" />审核
            </van-button>
            <!-- <span v-if="item.auditState == 1" >{{item.auditStateTitle}}</span> -->
            <ol class="hasPass greenLg" v-if="item.auditState == 1">
              <li>|</li>
              <li class="stateTitle">【已通过】</li>
            </ol>
            <ol class="noPass colorWhite" v-if="item.auditState == 2">
              <li>|</li>
              <li class="stateTitle">【未通过】</li>
            </ol>
          </div>
        </div>
      </div>

      <!--内容区title-->
      <div class="messageTbody-tag" v-if="item.medicalRecord">
        <p class="office-tag-left">
          <i class="greenLBcgBtn tagBg">{{item.dataTypeName}}</i>
          <b class="name">{{item.studentName}}</b>
        </p>
        <p class="office-tag-right">培训时间:{{item.startTime}}——{{item.endTime}}</p>
      </div>

      <!-- 病种 -->
      <div class="messageTbody" v-if="item.dataType==1&&item.medicalRecord">
        <ul v-if="item.medicalRecord">

          <li :class="{highlight:item.auditState==2}" v-if="item.auditState != 0">
            <i>审核人:</i>
            <span :class="{textcolor:item.auditState==2}">{{item.medicalRecord["auditByName"]}}</span>
          </li>
          <li :class="{highlight:item.auditState==2}"  v-if="item.auditState != 0">
            <i>审核时间:</i>
            <span :class="{textcolor:item.auditState==2}">{{item.medicalRecord["auditTime"]}}</span>
          </li>
          <li :class="{highlight:item.auditState==2}"  v-if="item.medicalRecord['auditReason']&&item.auditState != 0">
            <i>审核意见:</i>
            <span :class="{textcolor:item.auditState==2}" >{{item.medicalRecord["auditReason"]}}</span>
          </li>
          <li>
            <i>就诊方式:</i>
            <span>{{item.medicalRecord["accessModeTitle"]}}</span>
          </li>
          <li>
            <i>病种:</i>
            <span>{{item.medicalRecord["mainDiseaseName"]}}</span>
          </li>
          <li>
            <i>就诊时间:</i>
            <span>{{item.medicalRecord["visitTime"]}}</span>
          </li>
          <li v-if="item.medicalRecord.accessMode == 3">
            <i>是否全程管理:</i>
            <span>{{item.medicalRecord["manageWholeProcessTitle"]}}</span>
          </li>
          <li v-if="item.medicalRecord.accessMode == 3">
            <i>书写大病历:</i>
            <span>{{item.medicalRecord["writeMajorMedicalRecordTitle"]}}</span>
          </li>
          <li>
            <i>病历号:</i>
            <span>{{item.medicalRecord["medicalRecordNo"]}}</span>
          </li>
        </ul>
      </div>

      <!-- 技能 -->
      <div class="messageTbody" v-if="item.dataType==2&&item.medicalRecord">
        <ul v-if="item.medicalRecord">
          <li :class="{highlight:item.auditState==2}" v-if="item.auditState != 0">
            <i>审核人:</i>
            <span :class="{textcolor:item.auditState==2}" >{{item.medicalRecord["auditByName"]}}</span>
          </li>
          <li :class="{highlight:item.auditState==2}" v-if="item.auditState != 0">
            <i>审核时间:</i>
            <span :class="{textcolor:item.auditState==2}" >{{item.medicalRecord["auditTime"]}}</span>
          </li>
          <li :class="{highlight:item.auditState==2}" v-if="item.medicalRecord['auditReason']&&item.auditState != 0">
            <i>审核意见:</i>
            <span :class="{textcolor:item.auditState==2}" >{{item.medicalRecord["auditReason"]}}

           </span>
          </li>
          <li>
            <i>技能:</i>
            <span>{{item.medicalRecord["skillName"]}}</span>
          </li>
          <li>
            <i>操作时间:</i>
            <span>{{item.medicalRecord["operateTime"]}}</span>
          </li>
          <li>
            <i>病历号:</i>
            <span>{{item.medicalRecord["medicalRecordNo"]}}</span>
          </li>
        </ul>
      </div>
      <!-- 手术 -->
      <div class="messageTbody" v-if="item.dataType==3&&item.medicalRecord">
        <ul v-if="item.medicalRecord">
          <li :class="{highlight:item.auditState==2}" v-if="item.auditState != 0">
            <i>审核人:</i>
            <span :class="{textcolor:item.auditState==2}" >{{item.medicalRecord["auditByName"]}}</span>
          </li>
          <li :class="{highlight:item.auditState==2}" v-if="item.auditState != 0">
            <i>审核时间:</i>
            <span :class="{textcolor:item.auditState==2}" >{{item.medicalRecord["auditTime"]}}</span>
          </li>
          <li :class="{highlight:item.auditState==2}" v-if="item.medicalRecord['auditReason']&&item.auditState != 0">
            <i>审核意见:</i>
            <span :class="{textcolor:item.auditState==2}" >{{item.medicalRecord["auditReason"]}}</span>
          </li>
          <li>
              <i>手术名称:</i>
              <span>{{item.medicalRecord["operationName"]}}</span>
          </li>
          <li>
              <i>角色:</i>
              <span>{{item.medicalRecord["operationRoleTitle"]}}</span>
          </li>
          <li>
              <i>手术类型:</i>
              <span>{{item.medicalRecord["operationRoleTitle"]}}</span>
          </li>
          <li>
              <i>手术时间:</i>
              <span>{{item.medicalRecord["operationTime"]}}</span>
          </li>
          <li>
              <i>病历号:</i>
              <span>{{item.medicalRecord["medicalRecordNo"]}}</span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: "waitAudit",
  props: {
    auditList: Array
  },
  data() {
    return {
      show: true,
      name: "李雷",
        isAnimation:false,
    };
  },
  created() {
      console.log(this.$parent,1111)

  },
  computed: {
    getDate() {
      let mydate = new Date();
      let onedate = mydate.toLocaleString("chinese", { hour12: false });
      let reg = /\/+/g;
      this.time = onedate.replace(reg, "-");
    }
  },
  methods: {
    auditPop(item, index) {
      this.$emit("auditOperate", item, index);
    }

  }
};
</script>

<style scoped>
i {
  font-style: normal;
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

.titleIcon {
  font-size: 18px;
  margin-top: 4px;
  margin-right: 4px;
}
/*条件选择区*/
/*提交时间*/
.van-dropdown-item{
    top: 78px;
}
.submit-time {
  display: flex;
  background: #666;
  opacity: 1;
  width: 100%;
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
  height: 37px;
  line-height: 37px;
}
.submit-time-all {
  width: 100%;
  height: 37px;
  font-size: 12px;
  display: flex;
  padding: 0 10px;
  box-sizing: border-box;
}
.submit-time-left {
  width: 60%;
  display: flex;
  color: #fff;
  align-items: center;
}
.submit-time-left li {
  height: 28px;
  line-height: 28px;
}
/* 列表审核状态 */
.submit-time-right {
  width: 40%;
  text-align: right;
}
.submit-time-right ol li{
    float: left;
}
.stateTitle{
    margin-left: 8px;
}
/*主干*/
section {
  width: 100%;
  position: absolute;
  top: 78px;
  bottom: 0;
  left: 0;
  right: 0;
  overflow-y: scroll;
  -webkit-overflow-scrolling: touch;
}

/* body区域 */
.messageTbody {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  background: #fff;
  border: 1px solid #f3f1f1;
  font-size: 12px;
  color: #666;
}
.messageTbody ul,
.messageTbody li {
  width: 100%;
}
.messageTbody li{
    display: flex;
    align-items:center;
    justify-content: center;
    height: auto;
    overflow: hidden;
    border: 1px solid #f3f1f1;
}
.messageTbody li i {
  width: 30%;
  text-align: left;
  text-indent: 20px;
  line-height: 40px;
  border-right:1px solid  #f3f1f1;
}

.messageTbody span {
  width: 70%;
  word-break: break-all;
  padding: 0 20px;
  text-align: left;

  border-left:1px solid  #f3f1f1;
  margin-left:-1px;
  box-sizing: border-box;
}
.messageTbody-tag {
  display: flex;
  background: #fff;
  border-left: 1px solid #f3f1f1;
  border-right: 1px solid #f3f1f1;
}
.office-tag-left {
  width: 30%;
  height: 52px;
  display: flex;
  justify-content: space-around;
  align-items: center;
}

.office-tag-left .tag {
  width: 45px;
  height: 20px;
  line-height: 20px;
  text-align: center;
  background: #1da29a;
  border-radius: 10px;
  color: #fff;
  font-size: 12px;
}
/*技能*/
.office-tag-left .tagBg {
  width: 45px;
  height: 20px;
  line-height: 20px;
  text-align: center;
  border-radius: 10px;
  font-size: 12px;
  background: #1da29a;
  color: #fff;
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
  transform: rotate(-315deg);
  right: -50px;
  top: 16px;
  width: 60px;
}
.awaitItem{
  position: relative;
  overflow: hidden;
  margin-top: 12px;
}
.awaitItem .auditBtn {
  color: #fff;
  background: #1da29a;
}
/* 未通过 */
.noPass {
  height: 1.875rem;
  font-size: 14px;
  text-align: left;
  text-indent: -3px;
}
.noPass::before {
  position: absolute;
  right: -50px;
  top: 16px;
  width: 60px;
  content: "不属实";
  color: #fff;
  display: block;
  height: 0;
  border-width: 0 35px 35px;
  border-style: none solid solid;
  border-color: transparent transparent #f04844;
  transform: rotate(-315deg);
}
.highlight{
  background:lightgoldenrodyellow;
}
  .textcolor{
    color:#F04844;
  }

</style>

