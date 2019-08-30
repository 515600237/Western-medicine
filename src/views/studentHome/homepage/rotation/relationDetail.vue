<template>
  <div class="wrapper">
    <van-nav-bar
      title="轮转计划详情"
      left-text="返回"
      right-text="查看完成情况"
      left-arrow
      @click-left="goPage('rotation')"
      @click-right="lookDeptDetail()"
      class="titSaveBtn"
    />
    <div class="addRoleBox">
      <van-cell-group>
        <van-field v-model="itemData.departmentName" label="轮转科室" readonly="readonly" input-align="right"></van-field>
      </van-cell-group>
      <van-cell-group>
        <van-field
          v-model="isCooper"
          label="是否在协同单位轮转"
          readonly="readonly"
          input-align="right"
        ></van-field>
      </van-cell-group>
      <!-- 协同单位名称 -->
      <van-cell-group v-if="itemData.cooperationFlag == 1">
        <van-field
          v-model="itemData.cooperationBaseName"
          label="协同单位名称"
          readonly="readonly"
          input-align="right"
        ></van-field>
      </van-cell-group>
      <van-cell-group>
        <van-field
          v-model="itemData.startTime"
          label="轮转计划开始时间"
          readonly="readonly"
          input-align="right"
        ></van-field>
      </van-cell-group>
      <van-cell-group>
        <van-field
          v-model="itemData.endTime"
          label="轮转计划结束时间"
          readonly="readonly"
          input-align="right"
        ></van-field>
      </van-cell-group>
    </div>
    <div v-if="itemData.rotationScheduleTeacherDtoList && itemData.rotationScheduleTeacherDtoList.length">
        <div class="teacherItem" v-for="(item,index) in itemData.rotationScheduleTeacherDtoList" :key="index">
          <van-cell-group>
            <van-field v-model="item.teacherName" label="指导医师" readonly="readonly" input-align="right"></van-field>
          </van-cell-group>
          <van-cell-group>
            <van-field
              v-model="item.teacherPhone"
              label="指导医师手机"
              readonly="readonly"
              input-align="right"
            ></van-field>
          </van-cell-group>
        </div>
    </div>

    <div class="labelTab detOptionbtns">
      <van-row type="flex" justify="space-between">
        <van-col span="12" class="text-left">
          <van-button type="primary" class="greenWgBtn" @click="modify()">修改</van-button>
        </van-col>
        <van-col span="12" class="text-right">
          <van-button type="primary" class="deleteBtn" @click="confirmDelete()">删除</van-button>
        </van-col>
      </van-row>
    </div>
  </div>
</template>

<script>
export default {
  name: "relationDetail",
  data() {
    return {
      currentItem:{},
      currentScheduleId:"",
      itemData: {
        departmentName:"",
        startTime: "",
        endTime: "",
        rotationScheduleTeacherDtoList: [],
        isEnd: null,
      }
    };
  },
  computed:{
    isCooper(){
        let flag="否";
        return flag= this.itemData.cooperationFlag == 0? "否":"是"
    }
  },
  created(){
    this.currentItem = this.Global.currentItem;
    this.currentScheduleId = this.currentItem.currentScheduleId;
    this.getDetail();
  },
  methods: {
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
                    this.itemData = res.data;
                  }
              }
          })
    },
    goPage(name) {
      this.$router.push({ name: name });
    },
    lookDeptDetail() {
      this.$store.state.deaseListPagePre = 2;
      this.$router.push({ path: "/studentHome/medicaList"});
    },
    //判断当前轮转计划是否已经结束，如果已经结束，不允许修改和删除
    isModifyDelete(){
      if(this.isEnd != null){
          return this.isEnd;
      }
      console.log(this.itemData);
      let endTime = this.itemData.endTime;
      if(endTime){
         let today = new Date();
         endTime = new Date( endTime.replace(/-/g,"/"));
         endTime.setHours(23,59,59);
         if(today.getTime() > endTime.getTime()){
            return false;
         }
         return true;
      }
      return true;
    },
    modify(){
      this.isEnd = this.isModifyDelete();
      if(this.isEnd == false){
        this.$toast("此轮转计划已经结束,不允许修改");
        return;
      }
      if(this.itemData.permitUpdateOrDelete == 0){
         this.$toast("此轮转计划,住院医师不可以修改");
         return;
      }
      this.Global.rotationAddType =2;
      this.$router.push({name: "addRolation"});
    },
    confirmDelete() {
      this.isEnd = this.isModifyDelete();
      if(this.isEnd == false){
        this.$toast("此轮转计划已经结束,不允许删除");
        return;
      }
      if(this.itemData.permitUpdateOrDelete == 0){
         this.$toast("此轮转计划,住院医师不可以删除");
         return;
      }
      this.$dialog.confirm({
        title: "确定删除",
        message: "此轮转计划录入的信息也将同步删除,确定删除吗？",
        confirmButtonText: "确定"
      })
        .then(() => {
          this.sureDelete()
        })
        .catch(() => {
          
        });
    },
    sureDelete(){
        const url =this.api.scheDelete;
        const postJson={
            id: this.itemData.id,
        };
        console.log(url);
        this.utils.ajax({
            url:url,
            method:"POST",
            data:postJson,
            success:(res)=>{
                console.log(res);
                if(res.code == 0){
                    this.$toast("删除成功");
                    this.$router.push({ name:"rotation"});
                }else{
                    this.$toast( res.msg );
                }
            }
        })

    }

  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
/* 头部 */
.titSaveBtn .van-nav-bar__right{
    width: 100px;
}
.addRoleBox {
  margin-top: 15px;
}
.addRoleBox /deep/ .van-field__label{
  width: 150px;
}
.teacherItem {
  margin-top: 15px;
}
.detOptionbtns .van-button {
  width: 165px;
}
.labelTab {
  padding: 10px 15px;
  font-size: 14px;
}
.labelTab /deep/ .van-tabs__nav {
  margin-right: 0;
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
.defaultNone {
  display: block;
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
</style>
