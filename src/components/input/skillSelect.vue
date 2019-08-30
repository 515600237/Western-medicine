<template>
  <div>
      <van-popup v-model="selectDepShow" position="bottom" close-on-click-overlay :overlay="true">
        <van-picker
          show-toolbar
          title="选择技能"
           value-key="skillName"
          :default-index="activeIndex"
          :columns="deaseList"
          @cancel="onCancel"
          @confirm="onConfirm"
        />
      </van-popup>
  </div>
</template>

<script>
export default {
  props: ["showJson","departmentId","skillListMap"],
  data() {
    return {
      showSelectJson: this.showJson,
      selectDepShow: false,
    };
  },
  created(){
  
  },
  computed:{
      deaseList(){
        console.log(this.skillListMap);
        console.log(this.departmentId);
        console.log(this.skillListMap[this.departmentId]);
         return this.skillListMap[this.departmentId] || [];
      },
      activeIndex(){
         let itemIndex = this.deaseList.findIndex((item,index)=>{
                return item.id == this.showJson.skillId;
         })
         if(itemIndex == -1){
           itemIndex = 0;
         }
         return itemIndex;
      }
  },
  methods: {
    showDept(){
      this.selectDepShow = true;
    },
    onCancel() {
      this.selectDepShow = false;
    },
    onConfirm(value,index) {
      this.selectDepShow = false;
      this.$emit("onConfirm", value);
    },
  },
  watch:{
    showJson(newValue,oldValue){
      this.showSelectJson = newValue;
    }
  },
  mounted() {}
};
</script>

<style scoped>
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
</style>

