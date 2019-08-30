<template>
  <div>
      <van-popup v-model="selectDepShow" position="bottom" close-on-click-overlay :overlay="true">
        <div class="deparmentNotice text-left">
            <span>此科室为《住院医师规范化培训内容与标准》中的国家标准科室，不是基地的实际培训科室。</span>
          </div>
        <van-picker
          show-toolbar
          title="选择科室"
           value-key="name"
          :default-index="activeIndex"
          :columns="derpartList"
          @cancel="onCancel"
          @confirm="onConfirm"
        />
      </van-popup>
  </div>
</template>

<script>
export default {
  props: ["showJson","derpartList"],
  data() {
    return {
      showSelectJson: this.showJson,
      selectDepShow: false
    };
  },
  computed:{
      activeIndex(){
         let itemIndex = this.derpartList.findIndex((item,index)=>{
                return item.id == this.showJson.departmentId;
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
       console.log(this.derpartList);
      this.selectDepShow = false;
      this.$emit("onConfirm", value);
    },
  },
  watch:{
    showJson(newValue,oldValue){
      this.showSelectJson = newValue;
    }
  },
  mounted() {
    
  }
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

